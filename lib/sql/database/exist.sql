SELECT
    TRUE AS exist
FROM
    pg_database
WHERE
    datname=${database_name}
