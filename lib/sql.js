import pgPromise from "pg-promise";
import {fileURLToPath} from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function sql(filePath) {
    const fullPath = path.join(__dirname, filePath);
    return new pgPromise.QueryFile(fullPath);
}

// Export object
export default {
    migration: {
        create: sql("./sql/migration/create.sql"),
        exist: sql("./sql/migration/exist.sql"),
        all: sql("./sql/migration/all.sql"),
        insert: sql("./sql/migration/insert.sql")
    },
    database: {
        create: sql("./sql/database/create.sql"),
        exist: sql("./sql/database/exist.sql")
    }
}
