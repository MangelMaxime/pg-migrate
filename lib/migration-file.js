import path from 'path';
import { promises as fs } from 'fs';
import crypto from 'crypto';
import { parseFileName } from './file-name-parser.js';
import pgPromise from "pg-promise";

const hashString = (str) =>
    crypto.createHash("sha1").update(str).digest("hex");

/**
 *
 * @param {String} filePath
 * @returns {Promise<MigrationFile>}
 */
export const loadMigrationFile = async (filePath) => {
    const fileName = path.basename(filePath);

    try {
        const { id, name } = parseFileName(fileName);
        const content = await fs.readFile(filePath, { encoding: 'utf8' });
        const hash = hashString(content);
        const queryFile = new pgPromise.QueryFile(filePath)

        return {
            id,
            name,
            content,
            queryFile,
            hash,
        }
    } catch (e) {
        throw new Error(`Error reading migration file: ${fileName}\n${e.message}`);
    }
}
