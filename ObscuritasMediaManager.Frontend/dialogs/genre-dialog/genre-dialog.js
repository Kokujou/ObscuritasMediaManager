import { GenreModel } from '../../data/genre.model.js';
import { LitElement } from '../../exports.js';
import { GenreDialogResult } from '../dialog-result/genre-dialog.result.js';
import { renderGenreDialogStyles } from './genre-dialog.css.js';
import { renderGenreDialog } from './genre-dialog.html.js';

export class GenreDialog extends LitElement {
    static get styles() {
        return renderGenreDialogStyles();
    }

    static get properties() {
        return {
            genres: { type: Array, reflect: true },
            allowThreeValues: { type: Array, reflect: true },

            caption: { type: String, reflect: false },
        };
    }

    constructor() {
        super();
        /** @type {GenreModel[]} */ this.genres = [];
        /** @type {boolean} */ this.allowThreeValues = false;

        /** @type {GenreModel[]} */ this.allowedGenres = [];
        /** @type {GenreModel[]} */ this.forbiddenGenres = [];
    }

    /** @returns {Object.<string, GenreModel[]>} */
    get genreDict() {
        return this.genres.reduce((prev, current, index, array) => {
            if (!prev[current.section]) prev[current.section] = [];
            prev[current.section].push(current);

            return prev;
        }, {});
    }

    /**
     * @returns {GenreDialog}
     * @param {GenreModel[]} genres
     * @param {GenreModel[]} allowedGenres
     * @param {GenreModel[]} forbiddenGenres
     * @param {boolean} allowThreeValues
     */
    static show(genres, allowedGenres = [], forbiddenGenres = [], allowThreeValues = true) {
        // @ts-ignore
        /** @type {MessageDialog }*/ var dialog = document.createElement('genre-dialog');

        dialog.caption = 'Tags auswählen';
        dialog.genres = genres;
        dialog.allowedGenres = allowedGenres;
        dialog.forbiddenGenres = forbiddenGenres;
        dialog.allowThreeValues = allowThreeValues;
        document.body.append(dialog);
        dialog.requestUpdate(undefined);

        return dialog;
    }

    render() {
        return renderGenreDialog(this);
    }

    /**
     * @param {{value: number}} eventDetail
     * @param {GenreModel} genre
     */
    handleGenreSelection(eventDetail, genre) {
        switch (eventDetail.value) {
            case -1:
                this.forbiddenGenres.push(genre);
                this.allowedGenres = this.allowedGenres.filter((x) => x.name != genre.name);
                return;
            case 0:
                this.forbiddenGenres = this.forbiddenGenres.filter((x) => x.name != genre.name);
                this.allowedGenres = this.allowedGenres.filter((x) => x.name != genre.name);
                return;
            case 1:
                this.allowedGenres.push(genre);
                this.forbiddenGenres = this.forbiddenGenres.filter((x) => x.name != genre.name);
                return;
            default:
                throw new Error('unsupported tri-value-checkbox value');
        }
    }

    accept() {
        var result = new GenreDialogResult();
        result.acceptedGenres = this.allowedGenres;
        result.forbiddenGenres = this.forbiddenGenres;
        var acceptEvent = new CustomEvent('accept', { detail: result });
        this.dispatchEvent(acceptEvent);
    }

    /**
     * @param {GenreModel} genre
     */
    getValue(genre) {
        if (this.allowedGenres.some((x) => x.name == genre.name)) return 1;
        if (this.forbiddenGenres.some((x) => x.name == genre.name)) return -1;
        return 0;
    }
}
