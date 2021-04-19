export class MediaModel {
    /** @type {string} */ name;
    /** @type {string} */ type;
    /** @type {number} */ rating = 0;
    /** @type {number} */ release = 0;

    /** @type {string} */ genreString;
    /** @type {string[]} */ get genres() {
        return this.genreString.split(',');
    }
    set genres(value) {}

    /** @type {number} */ state = 0;
    /** @type {string} */ description;
    /** @type {Blob} */ thumbnail;
    /** @type {string} */ image;

    pushGenre(genre) {
        if (!this.genreString) this.genreString += ',';
        this.genreString += genre;
    }

    /**
     * @param {string} name
     * @param {string} type
     */
    constructor(name = '', type = '') {
        this.name = name;
        this.type = type;
    }
}
