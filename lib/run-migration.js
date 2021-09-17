import pgPromise from "pg-promise";
import sql from "./sql.js";

/**
 *
 * @param {pgPromise.IDatabase<{}, pg.IClient>} db
 * @param {string} migrationSchema
 * @param {string} migrationTable
 * @param {MigrationFile} migration
 */
export const runMigration = async (db, migrationSchema, migrationTable, migration) => {
    // Start a transaction
    return await db.tx(
        "run-migration",
        async (tx) => {
            // Apply the migration
            await tx.query(migration.queryFile);
            // Insert the migration
            await tx.none(sql.migration.insert, {
                migration_schema: migrationSchema,
                migration_table: migrationTable,
                migration_id: migration.id,
                migration_name: migration.name,
                migration_hash: migration.hash,
            });
        })
}
