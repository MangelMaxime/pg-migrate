import monitor from "pg-monitor";
import { Logger } from "./logger.js";
import sql from "./sql.js";

/**
 *
 * @param {MigrateArgs} argv
 * @param {Logger} logger
 */
export const ensureDatabaseExist = async (argv, logger) => {

    const connectionOptions = {
        host: process.env.PGHOST || argv.host,
        port: process.env.PGPORT || argv.port,
        user: process.env.PGUSER || argv.user,
        password: process.env.PGPASSWORD || argv.password,
        // Use the default database to check the exist of the target database
        database: argv.defaultDatabase
    };

    const pgp = await import('pg-promise');

    const initOptions = {}

    const db = pgp.default(initOptions)(connectionOptions);

    if (argv.verbose) {
        if (monitor.isAttached()) {
            monitor.detach();
        }

        monitor.attach(initOptions);
    }

    await db.task(
        "check-database",
        async (task) => {
            const databaseExist = await task.oneOrNone(sql.database.exist, { database_name: argv.database });

            if (!databaseExist) {
                logger.log(`Database '${argv.database}' does not exist`);
                await task.none(sql.database.create, { database_name: argv.database });
                logger.log(`Database '${argv.database}' created`);
            } else {
                logger.log(`Database '${argv.database}' already exist`);
            }
        }
    )
}
