#!/usr/bin/env node

import dotenv from 'dotenv';

dotenv.config();

import yargs from 'yargs';
import { hideBin } from "yargs/helpers";
import { migrate } from './lib/migrate.js';
import { createMigration } from './lib/create-migration.js';

yargs(hideBin(process.argv))
    .completion()
    .strict()
    .help()
    .alias("help", "h")
    .command(
        "new <migration-name>",
        "Create a new migration",
        () => { },
        createMigration
    )
    .command(
        "migrate",
        "Apply the migrations to the database",
        (argv) => {
            argv
                .help()
                .option(
                    "default-database",
                    {
                        alias: "dd",
                        default: "Database name used when checking/creating the database",
                        type: "string",
                        default: "postgres"
                    }
                )
                .option(
                    "database",
                    {
                        alias: "d",
                        description: "Database name to connect to",
                        type: "string"
                    }
                )
                .option(
                    "user",
                    {
                        alias: "u",
                        description: "Database user to connect with",
                        type: "string"
                    }
                )
                .option(
                    "password",
                    {
                        alias: "w",
                        description: "Database user password",
                        type: "string"
                    }
                )
                .option(
                    "host",
                    {
                        alias: "h",
                        description: "Database host",
                        type: "string",
                        default: "localhost"
                    }
                )
                .option(
                    "port",
                    {
                        alias: "p",
                        description: "Database port",
                        type: "number",
                        default: "5432"
                    }
                )
                .option(
                    "migration-table",
                    {
                        alias: "t",
                        description: "Set the name of the migrations table",
                        type: "string",
                        default: "migrations"
                    }
                )
                .option(
                    "migration-schema",
                    {
                        alias: "s",
                        description: "Set the name of the migrations table schema",
                        type: "string",
                        default: "public"
                    }
                )
                .option(
                    "verbose",
                    {
                        alias: "v",
                        description: "Verbose output",
                        type: "boolean",
                        default: false
                    }
                )
        },
        migrate
    )
    .version(false)
    .argv
