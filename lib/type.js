import pgPromise from "pg-promise";

/**
 * @typedef {Object} MigrateArgs
 * @property {String} host                Database host
 * @property {Number} port                Database port
 * @property {String} user                Database user to connect with
 * @property {String} password            Database user password
 * @property {String} database            Database name to connect to
 * @property {String} defaultDatabase     Database name used when checking/creating the database
 * @property {String} migrationTable      Name of the migration table
 * @property {String} migrationSchema     Name of the migration table schema
 * @property {String} verbose             True if should output verbose messages
 */

/**
 * @typedef {Object} NewMigrationArgs
 * @property {String} migrationName        Name of the migration
 */

/**
 * @typedef {Object} MigrationFile
 * @property {Number} id                        Id of the migration
 * @property {String} name                      Name of the migration
 * @property {String} content                   Content of the migration
 * @property {pgPromise.QueryFile} queryFile    PgPromise query file
 * @property {String} hash                      Hash of the migration file
 */

/**
 * @typedef {Object} MigrationDb
 * @property {Number} id            Id of the migration
 * @property {String} name          Name of the migration
 * @property {String} hash          Hash of the migration file
 * @property {Date} executed_at     Date of the migration
 */
