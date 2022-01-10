# PgMigrate

A PostgreSQL migration CLI tool which us up only migration scripts.

## CLI Usage

```
pg-migrate [command]

Commands:
  pg-migrate completion            generate completion script
  pg-migrate new <migration-name>  Create a new migration
  pg-migrate migrate               Apply the migrations to the database

Options:
  -h, --help  Show help                                                [boolean]
```

### Create a new migration

To create a new migration, you can run `pg-migrate new <migration-name>`.

This will check that a migration with the same id does not already exist and then create a new migration file under the `migrations` directory.

Example:

`pg-migrate new 001-create_users` will create a migration file named `001-create_users.sql` in the `migrations` directory.

#### File name format

[id][separator][name].sql

| Section | Description |
| --- | --- |
| id | The migration id, this is a number. |
| separator | Can be `-` or `_` |
| name | The name of the migration |

### Apply the migrations

```
pg-migrate migrate

Apply the migrations to the database

Options:
      --help                    Show help                              [boolean]
      --default-database, --dd                    [string] [default: "postgres"]
  -d, --database                Database name to connect to             [string]
  -u, --user                    Database user to connect with           [string]
  -w, --password                Database user password                  [string]
  -h, --host                    Database host    [string] [default: "localhost"]
  -p, --port                    Database port         [number] [default: "5432"]
  -t, --migration-table         Set the name of the migrations table
                                                [string] [default: "migrations"]
  -s, --migration-schema        Set the name of the migrations table schema
                                                    [string] [default: "public"]
  -v, --verbose                 Verbose output        [boolean] [default: false]
```

Note:

You can also use the following environment variables to set the connection parameters:

- `PGHOST`
- `PGPORT`
- `PGUSER`
- `PGPASSWORD`
- `PGDATABASE`

The CLI arguments will override the environment variables.
