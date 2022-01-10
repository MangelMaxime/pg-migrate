const parseId = (id) => {
    const parsedId = parseInt(id, 10);

    if (isNaN(parsedId)) {
        throw new Error(`Migration file name should start with an integer`);
    }

    return parsedId;
}

export const parseFileName = (fileName) => {
    const result = /^(\d+)[-_]?(.+)\.sql$/.exec(fileName);

    if (!result) {
        throw new Error(`Invalid file name: ${fileName}`);
    }

    const [, id, name] = result;

    return {
        id: parseId(id),
        name: name
    }
}
