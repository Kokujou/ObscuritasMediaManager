export class MediaModel {
    /** @type {string} */ id;
    /** @type {string} */ name;
    /** @type {string} */ type;
    /** @type {number} */ rating = 0;
    /** @type {number} */ release = 0;

    /** @type {string} */ genreString = '';
    /** @type {string[]} */ get genres() {
        if (this.genreString) return this.genreString.split(',');
        return [];
    }
    set genres(value) {}

    /** @type {number} */ state = 0;
    /** @type {string} */ description = '';
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
