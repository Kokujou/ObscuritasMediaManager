export class StreamingEntryModel {
    /** @type {string} */ name;
    /** @type {string} */ season;
    /** @type {number} */ episode = 0;
    /** @type {string} */ src;
    /** @type {string} */ type;

    /**
     * @param {File} file
     * @param {string} type
     * @param {string} basePath
     */
    static fromFile(file, type, basePath) {
        var streamingEntry = new StreamingEntryModel();
        streamingEntry.type = type;
        // @ts-ignore
        var fileLevels = file.webkitRelativePath.split('/');

        // @ts-ignore
        streamingEntry.src = `${basePath}\\${file.webkitRelativePath}`;
        streamingEntry.season = 'Staffel 1';
        if (fileLevels.length == 4) {
            streamingEntry.season = fileLevels[2];
            streamingEntry.name = fileLevels[1];
        } else if (fileLevels.length == 3) streamingEntry.name = fileLevels[1];
        else {
            // @ts-ignore
            var error = `the depth of the selected folder must be between 3 and 4 (root -> media -> (season) -> episode). file: ${file.webkitRelativePath}`;
            console.error(error);
            throw new Error(error);
        }

        return streamingEntry;
    }
}
