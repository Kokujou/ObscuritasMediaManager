import { CheckboxState } from '../../data/enumerations/checkbox-state.js';
import { FilterEntry } from '../../data/filter-entry.js';
import { LitElementBase } from '../../data/lit-element-base.js';
import { Session } from '../../data/session.js';
import { MessageSnackbar } from '../../native-components/message-snackbar/message-snackbar.js';
import { GenreModel, InstrumentModel, InstrumentType, MediaGenreModel } from '../../obscuritas-media-manager-backend-client.js';
import { PageRouting } from '../../pages/page-routing/page-routing.js';
import { GenreService, MusicService } from '../../services/backend.services.js';
import { GenreDialogResult } from '../dialog-result/genre-dialog.result.js';
import { InputDialog } from '../input-dialog/input-dialog.js';
import { renderGenreDialogStyles } from './genre-dialog.css.js';
import { renderGenreDialog } from './genre-dialog.html.js';
import { getAvailableGenreSections } from './media-genres.js';

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
     *
     * @param {MediaGenreModel[] | FilterEntry<string>} genresOrFilter
     */
    static async startShowingWithGenres(genresOrFilter) {
        var genres = await GenreService.getAll();

        /** @type {Partial<GenreDialogOptions>} */ var options = { genres, allowAdd: true, allowRemove: true };
        if (genresOrFilter instanceof FilterEntry) {
            options.allowedGenres = genres.filter((x) => genresOrFilter.required.includes(x.id));
            options.forbiddenGenres = genres.filter((x) => genresOrFilter.forbidden.includes(x.id));
            options.allowThreeValues = true;
        } else {
            options.allowedGenres = genresOrFilter;
            options.ignoredState = CheckboxState.Forbid;
        }

        var genreDialog = GenreDialog.#show(options);

        var availableSections = getAvailableGenreSections(/** @type {MediaGenreModel[]} */ (genreDialog.options.allowedGenres));
        genreDialog.options.genres = genres.filter((x) => availableSections.includes(x.section));

        genreDialog.addEventListener('selection-changed', (e) => {
            var availableSections = getAvailableGenreSections(
                /** @type {MediaGenreModel[]} */ (genreDialog.options.allowedGenres)
            );
            genreDialog.options.genres = genres.filter((x) => availableSections.includes(x.section));
        });

        genreDialog.addEventListener(
            'add-genre',
            /** @param {CustomEvent<{name, section}>} e */ async (e) => {
                try {
                    await GenreService.addGenre(e.detail.section, e.detail.name);
                    genreDialog.options.genres = await GenreService.getAll();
                    genreDialog.requestFullUpdate();
                    MessageSnackbar.popup('Das Genre wurde erfolgreich hinzugefügt.', 'success');
                } catch (err) {
                    MessageSnackbar.popup('Ein Fehler ist beim hinzufügen des Genres aufgetreten: ' + err, 'error');
                    e.preventDefault();
                }
            }
        );
        genreDialog.addEventListener(
            'remove-genre',
            /** @param {CustomEvent<GenreModel>} e */ async (e) => {
                try {
                    await GenreService.removeGenre(e.detail.id);
                    genreDialog.options.genres = await GenreService.getAll();
                    genreDialog.requestFullUpdate();
                    MessageSnackbar.popup('Das Genre wurde erfolgreich gelöscht.', 'success');
                } catch (err) {
                    MessageSnackbar.popup('Ein Fehler ist beim löschen des Genres aufgetreten: ' + err, 'error');
                    e.preventDefault();
                }
            }
        );

        return genreDialog;
    }

    /**
     * @param {InstrumentModel[] | FilterEntry<string>} instrumentsOrFilter
     */
    static async startShowingWithInstruments(instrumentsOrFilter) {
        /** @param {InstrumentModel} item */
        var instrumentToGenre = (item, index) => new GenreModel({ id: `${index}`, name: item.name, sectionName: item.type });
        var genres = Session.instruments.current().map(instrumentToGenre);

        /** @type {Partial<GenreDialogOptions>} */ var options = { genres, allowAdd: true, allowRemove: true };

        if (instrumentsOrFilter instanceof FilterEntry) {
            options.allowedGenres = genres.filter((x) => instrumentsOrFilter.required.includes(x.name));
            options.forbiddenGenres = genres.filter((x) => instrumentsOrFilter.forbidden.includes(x.name));
            options.allowThreeValues = true;
        } else {
            options.allowedGenres = instrumentsOrFilter.map(instrumentToGenre);
            options.ignoredState = CheckboxState.Forbid;
        }

        var dialog = GenreDialog.#show(options);

        dialog.addEventListener(
            'add-genre',
            /** @param {CustomEvent<MediaGenreModel>} e */ async (e) => {
                await MusicService.addInstrument(/** @type {InstrumentType} */ (e.detail.sectionName), e.detail.name);
                dialog.options.genres.push(
                    new MediaGenreModel({
                        id: e.detail.name,
                        name: e.detail.name,
                        section: e.detail.section,
                        sectionName: e.detail.sectionName,
                    })
                );
                Session.instruments.next(await MusicService.getInstruments());
                await dialog.requestFullUpdate();
            }
        );
        dialog.addEventListener(
            'remove-genre',
            /** @param {CustomEvent<GenreModel>} e */ async (e) => {
                await MusicService.removeInstrument(/** @type {InstrumentType} */ (e.detail.sectionName), e.detail.name);
                dialog.options.genres = dialog.options.genres.filter((x) => x.name != e.detail.name);
                Session.instruments.next(await MusicService.getInstruments());
                await dialog.requestFullUpdate();
            }
        );

        return dialog;
    }

    /**
     * @param {Partial<GenreDialogOptions>} options
     */
    static #show(options) {
        var dialog = new GenreDialog();

        Object.assign(dialog.options, options);

        PageRouting.container.append(dialog);
        dialog.requestFullUpdate();

        return dialog;
    }

    /** @returns {Object.<string, MediaGenreModel[]>} */
    get genreDict() {
        return this.options.genres.reduce((prev, current, index, array) => {
            if (!prev[current.sectionName]) prev[current.sectionName] = [];
            prev[current.sectionName].push(current);

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

        this.dispatchEvent(new CustomEvent('selection-changed'));
        this.requestFullUpdate();
    }

    /**
     * @param {Event} e
     */
    accept(e) {
        e.stopPropagation();
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
        if (!name) return;
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
