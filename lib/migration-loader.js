import { readdir } from "fs/promises";
import path from "path";
import { Logger } from "./logger.js";
import { loadMigrationFile } from "./migration-file.js";

/**
 *
 * @param {String} migrationsDir
 * @param {Logger} logger
 * @returns
 */
export const loadMigrationFiles = async (migrationsDir, logger) => {
    const fileNames = await readdir(migrationsDir);

    logger.debug(`Found migration files:\n- ${fileNames.join("\n- ")}`);

    const migrationFiles = fileNames.map((fileName) => {
        return path.join(migrationsDir, fileName);
    });

    const unorderedMigrations = await Promise.all(
        migrationFiles.map(loadMigrationFile)
    )

    const orderedMigrations = unorderedMigrations.sort((a, b) => {
        return a.id - b.id
    });


    return orderedMigrations;
}
