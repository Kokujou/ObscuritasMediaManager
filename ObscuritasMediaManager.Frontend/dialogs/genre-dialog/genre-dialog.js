import { GenreModel } from '../../data/genre.model.js';
import { LitElement } from '../../exports.js';
import { renderGenreDialogStyles } from './genre-dialog.css.js';
import { renderGenreDialog } from './genre-dialog.html.js';

export class GenreDialog extends LitElement {
    static get styles() {
        return renderGenreDialogStyles();
    }

    static get properties() {
        return {
            genres: { type: Array, reflect: true },
            caption: { type: String, reflect: false },
        };
    }

    constructor() {
        super();
        /** @type {GenreModel[]} */ this.genres = [];

        /** @type {string[]} */ this.allowedGenres = [];
        /** @type {string[]} */ this.forbiddenGenres = [];
    }

    /** @returns {Object.<string, string[]>} */
    get genreDict() {
        return this.genres.reduce((prev, curr, index, array) => {
            if (!prev[curr.section]) prev[curr.section] = [];
            prev[curr.section].push(curr.name);

            return prev;
        }, {});
    }

    /**
     * @returns {GenreDialog}
     * @param {GenreModel[]} [genres]
     */
    static show(genres) {
        // @ts-ignore
        /** @type {MessageDialog }*/ var dialog = document.createElement('genre-dialog');

        dialog.caption = 'Tags auswählen';
        dialog.genres = genres;
        document.body.append(dialog);

        return dialog;
    }

    render() {
        return renderGenreDialog(this);
    }

    /**
     * @param {{value: number}} eventDetail
     * @param {string} genre
     */
    handleGenreSelection(eventDetail, genre) {
        this.allowedGenres = this.allowedGenres.filter((x) => x === genre);
        this.forbiddenGenres = this.forbiddenGenres.filter((x) => x === genre);

        switch (eventDetail.value) {
            case -1:
                this.forbiddenGenres.push(genre);
                return;
            case 0:
                return;
            case 1:
                this.allowedGenres.push(genre);
                return;
            default:
                throw new Error('unsupported tri-value-checkbox value');
        }
    }

    accept() {
        var acceptEvent = new CustomEvent('accept', {
            detail: { allowedGenres: this.allowedGenres, forbiddenGenres: this.forbiddenGenres },
        });
        this.dispatchEvent(acceptEvent);
    }
}
