import { CheckboxState } from '../../data/enumerations/checkbox-state.js';
import { LitElementBase } from '../../data/lit-element-base.js';
import { GenreModel } from '../../obscuritas-media-manager-backend-client.js';
import { PageRouting } from '../../pages/page-routing/page-routing.js';
import { GenreDialogResult } from '../dialog-result/genre-dialog.result.js';
import { InputDialog } from '../input-dialog/input-dialog.js';
import { renderGenreDialogStyles } from './genre-dialog.css.js';
import { renderGenreDialog } from './genre-dialog.html.js';

/**
 * @typedef {object} GenreDialogOptions
 * @prop {GenreModel[]} genres
 * @prop {GenreModel[]} allowedGenres
 * @prop {GenreModel[]} forbiddenGenres
 * @prop {boolean} allowThreeValues
 * @prop {boolean} allowAdd
 * @prop {boolean} allowRemove
 * @prop {CheckboxState} ignoredState
 */

export class GenreDialog extends LitElementBase {
    static get styles() {
        return renderGenreDialogStyles();
    }

    /**
     * @param {Partial<GenreDialogOptions>} options
     */
    static show(options) {
        var dialog = new GenreDialog();

        Object.assign(dialog.options, options);

        PageRouting.container.append(dialog);
        dialog.requestUpdate(undefined);

        return dialog;
    }

    /** @returns {Object.<string, GenreModel[]>} */
    get genreDict() {
        return this.options.genres.reduce((prev, current, index, array) => {
            if (!prev[current.section]) prev[current.section] = [];
            prev[current.section].push(current);

            return prev;
        }, {});
    }

    constructor() {
        super();
        /** @type {Partial<GenreDialogOptions>} */ this.options = {
            genres: [],
            allowedGenres: [],
            forbiddenGenres: [],
            allowThreeValues: false,
            ignoredState: CheckboxState.Ignore,
            allowAdd: false,
            allowRemove: false,
        };
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
                this.options.forbiddenGenres.push(genre);
                this.options.allowedGenres = this.options.allowedGenres.filter((x) => x.name != genre.name);
                break;
            case CheckboxState.Ignore:
                this.options.forbiddenGenres = this.options.forbiddenGenres.filter((x) => x.name != genre.name);
                this.options.allowedGenres = this.options.allowedGenres.filter((x) => x.name != genre.name);
                break;
            case CheckboxState.Require:
                this.options.allowedGenres.push(genre);
                this.options.forbiddenGenres = this.options.forbiddenGenres.filter((x) => x.name != genre.name);
                break;
            default:
                throw new Error('unsupported tri-value-checkbox value');
        }
        this.requestUpdate(undefined);
    }

    accept() {
        var result = new GenreDialogResult();
        result.acceptedGenres = this.options.allowedGenres;
        result.forbiddenGenres = this.options.forbiddenGenres;
        this.dispatchEvent(new CustomEvent('accept', { detail: result }));
    }

    /**
     * @param {GenreModel} genre
     */
    getValue(genre) {
        if (this.options.allowedGenres.some((x) => x.name == genre.name)) return CheckboxState.Require;
        if (this.options.forbiddenGenres.some((x) => x.name == genre.name)) return CheckboxState.Forbid;
        return CheckboxState.Ignore;
    }

    /**
     * @param {string} section
     */
    async addGenre(section) {
        var name = await InputDialog.show('Bitte Namen eingeben:');
        this.dispatchEvent(new CustomEvent('add-genre', { detail: { name, section } }));
    }

    /**
     * @param {Event} event
     * @param {GenreModel} genre
     */
    async removeGenre(event, genre) {
        this.dispatchEvent(new CustomEvent('remove-genre', { detail: genre }));
        event.stopPropagation();
    }
}
