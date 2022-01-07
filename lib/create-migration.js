import path from 'node:path';
import { promises as fs } from 'node:fs';
import { constants as fsConstants } from 'node:fs';

const cwd = process.cwd()

const checkFileExists = async (file) => {
    try {
        await fs.access(file, fsConstants.F_OK);
        return true;
    } catch (e) {
        return false;
    }
}

export const createMigration = async (argv) => {

    const migrationNameRegex = /^(\d)+[-_]?.+$/;

    const matches = migrationNameRegex.exec(argv.migrationName);

    // Validation of migration name
    if (matches === null) {
        console.error(`Migration name must be in format: "number-migrationName"`);
        process.exit(1);
    }

    // Check if file exist
    const migrationsPath = path.join(cwd, 'migrations');
    const fileContent = "-- replace with your sql";

    // If the migration folder doesn't exist, create it
    if (!await checkFileExists(migrationsPath)) {
        fs.mkdir(migrationsPath);
    }

    const existingMigrationsFile = await fs.readdir(migrationsPath);

    const existingMigrationIds = existingMigrationsFile.map(file => {
        return migrationNameRegex.exec(file)[1]
    });

    if (existingMigrationIds.includes(matches[1])) {
        console.error(`Migration with id ${matches[1]} already exists`);
        process.exit(1);
    }

    const migrationFile = path.join(migrationsPath, `${argv.migrationName}.sql`);

    if (await checkFileExists(migrationFile)) {
        console.log(`Migration ${argv.migrationName}.sql already exist`);
    } else {
        await fs.writeFile(migrationFile, fileContent);
    }
}
