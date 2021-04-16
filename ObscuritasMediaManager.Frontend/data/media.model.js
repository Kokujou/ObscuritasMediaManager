export class MediaModel {
    /** @type {string} */ name;
    /** @type {string} */ type;
    /** @type {number} */ rating = 0;
    /** @type {number} */ release = 1900;
    /** @type {string[]} */ genres = [];
    /** @type {number} */ state = 0;
    /** @type {string} */ description;
    /** @type {Blob} */ thumbnail;
    /** @type {string} */ image;

    /**
     * @param {string} name
     * @param {string} type
     */
    constructor(name, type) {
        this.name = name;
        this.type = type;
    }
}
