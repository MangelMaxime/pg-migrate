SELECT
    table_name
FROM
    information_schema.tables
WHERE
    table_schema = ${migrationSchema}
    AND table_name = ${migrationTable}
