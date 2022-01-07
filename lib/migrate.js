import { loadMigrationFiles } from "./migration-loader.js"
import path from "path";
import { Logger } from "./logger.js";
import sql from "./sql.js";
import monnitor from "pg-monitor";
import { ensureDatabaseExist } from "./create-database.js";
import pgPromise from "pg-promise";
import { runMigration } from "./run-migration.js";

const cwd = process.cwd();


/**
 * @description
 * Run the migrations
 *
 * @param {MigrateArgs} argv
 */
export const migrate = async (argv) => {
    const logger = new Logger(argv.verbose);

    try {

        const migrationsDir = path.join(cwd, "migrations");
        const intendedMigrations = await loadMigrationFiles(migrationsDir, logger);

        await ensureDatabaseExist(argv, logger);

        const connectionOptions = {
            host: process.env.PGHOST || argv.host,
            port: process.env.PGPORT || argv.port,
            user: process.env.PGUSER || argv.user,
            password: process.env.PGPASSWORD || argv.password,
            database: process.env.PGDATABASE || argv.database,
        };

        const pgp = await import('pg-promise');

        const initOptions = {}

        const db = pgp.default(initOptions)(connectionOptions);

        if (argv.verbose) {
            monnitor.attach(initOptions);
        }

        const appliedMigration =
            await fetchAppliedMigrationFromDB(db, argv.migrationSchema, argv.migrationTable, logger);

        validateMigrationHashes(intendedMigrations, appliedMigration);

        const migrationToApply = filterMigrations(intendedMigrations, appliedMigration);

        /**
         * @type {Array<MigrationFile>}
         */
        let completedMigrations = [];

        for (const migration of migrationToApply) {
            logger.debug(`Starting migration: ${migration.id} ${migration.name}`);
            try {
                await runMigration(db, argv.migrationSchema, argv.migrationTable, migration);
            } catch (err) {
                throw new Error(`Migration ${migration.id} ${migration.name} failed. This migration has been rollback and no more migration are applied. Reason:\n${err.message}`);
            }
            logger.debug(`Migration ${migration.id} ${migration.name} completed`);
            completedMigrations.push(migration);
        }

        if (completedMigrations.length === 0) {
            logger.success("No migration applied");
        } else {
            const migrationTextList =
                completedMigrations
                    .map((migration) => migration.name)
                    .join("\n- ")

            logger.success(`Successfully applied migrations:\n- ${migrationTextList}`);
        }

    } catch (err) {
        logger.error(`Migration failed. Reason:\n${err.message}`);
        process.exit(1);
    }

    process.exit(0);
}

/**
 *
 * @param {pgPromise.IDatabase<{}, pg.IClient>} db
 * @param {String} migrationSchema
 * @param {String} migrationTable
 * @param {Logger} logger
 */
const fetchAppliedMigrationFromDB = async (db, migrationSchema, migrationTable, logger) => {
    let appliedMigration = [];

    const exist = await db.oneOrNone(sql.migration.exist, {
        migrationSchema: migrationSchema,
        migrationTable: migrationTable
    });

    if (exist) {
        logger.log(`Migration table '${migrationSchema}.${migrationTable}' exist`)
        logger.log(`Fetching applied migration`);

        appliedMigration = await db.manyOrNone(sql.migration.all, {
            migrationSchema: migrationSchema,
            migrationTable: migrationTable
        });

    } else {
        logger.log(`Migration table '${migrationSchema}.${migrationTable}' doesn't exist`)
        logger.log(`Creating migration table: ${migrationSchema}.${migrationTable}`)

        await db.none(sql.migration.create, {
            migrationSchema: migrationSchema,
            migrationTable: migrationTable
        });
    }

    return appliedMigration;
}

/**
 * @description
 * Validate the migration hashes, checking if the migration file have not
 * changed since the last time the migration was applied.
 *
 * @param {Array<MigrationFile>} migrations
 * @param {Arra<MigrationDb>} appliedMigrations
 */
const validateMigrationHashes = (migrations, appliedMigrations) => {
    const invalidHashes =
        migrations.filter(migration => {
            const appliedMigration =
                appliedMigrations.find(appliedMigration =>
                    appliedMigration.id === migration.id
                );

            return appliedMigration != null && appliedMigration.hash !== migration.hash;
        });

    if (invalidHashes.length > 0) {
        const invalidFiles = invalidHashes.map(migration => migration.name);
        throw new Error(`Invalid migration hash for ${invalidFiles.join(", ")}
This means that the migration files have changed since their application. Please fix it`);
    }
}

/**
 * @description
 * Filter the migrations to apply based on the applied migrations
 *
 * @param {Array<MigrationFile>} migrations
 * @param {Array<MigrationDb>} appliedMigrations
 * @returns {Array<MigrationFile>} List of the migration to apply
 */
const filterMigrations = (migrations, appliedMigrations) => {
    return migrations.filter(migration => {
        const appliedMigration =
            appliedMigrations.find(appliedMigration =>
                appliedMigration.id === migration.id
            )

        return appliedMigration == null;
    });
}