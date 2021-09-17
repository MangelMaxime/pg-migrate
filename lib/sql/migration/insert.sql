INSERT INTO
	${migration_schema:name}.${migration_table:name} (
		id, "name", hash
	)
VALUES(
    ${migration_id},
    ${migration_name},
    ${migration_hash}
);
