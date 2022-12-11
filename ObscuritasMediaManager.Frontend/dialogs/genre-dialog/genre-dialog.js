import { CheckboxState } from '../../data/enumerations/checkbox-state.js';
import { LitElementBase } from '../../data/lit-element-base.js';
import { GenreModel } from '../../obscuritas-media-manager-backend-client.js';
import { GenreDialogResult } from '../dialog-result/genre-dialog.result.js';
import { renderGenreDialogStyles } from './genre-dialog.css.js';
import { renderGenreDialog } from './genre-dialog.html.js';

export class GenreDialog extends LitElementBase {
    static get styles() {
        return renderGenreDialogStyles();
    }

    static get properties() {
        return {
            genres: { type: Array, reflect: true },
            allowThreeValues: { type: Array, reflect: true },
            ignoredState: { type: String, reflect: true },

            caption: { type: String, reflect: false },
        };
    }

    constructor() {
        super();
        /** @type {GenreModel[]} */ this.genres = [];
        /** @type {boolean} */ this.allowThreeValues = false;

        /** @type {GenreModel[]} */ this.allowedGenres = [];
        /** @type {GenreModel[]} */ this.forbiddenGenres = [];
        /** @type {CheckboxState} */ this.ignoredState = CheckboxState.Ignore;
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
    static show(genres, allowedGenres = [], forbiddenGenres = [], allowThreeValues = true, ignoredstate = CheckboxState.Ignore) {
        var dialog = new GenreDialog();

        dialog.genres = genres;
        dialog.allowedGenres = allowedGenres;
        dialog.forbiddenGenres = forbiddenGenres;
        dialog.allowThreeValues = allowThreeValues;
        dialog.ignoredState = ignoredstate;
        document.body.append(dialog);
        dialog.requestUpdate(undefined);

        return dialog;
    }

    render() {
        return renderGenreDialog(this);
    }

    /**
     * @param {{value: CheckboxState}} eventDetail
     * @param {GenreModel} genre
     */
    handleGenreSelection(eventDetail, genre) {
        switch (eventDetail.value) {
            case CheckboxState.Forbid:
                this.forbiddenGenres.push(genre);
                this.allowedGenres = this.allowedGenres.filter((x) => x.name != genre.name);
                return;
            case CheckboxState.Ignore:
                this.forbiddenGenres = this.forbiddenGenres.filter((x) => x.name != genre.name);
                this.allowedGenres = this.allowedGenres.filter((x) => x.name != genre.name);
                return;
            case CheckboxState.Allow:
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
        if (this.allowedGenres.some((x) => x.name == genre.name)) return CheckboxState.Allow;
        if (this.forbiddenGenres.some((x) => x.name == genre.name)) return CheckboxState.Forbid;
        return CheckboxState.Ignore;
    }
}
