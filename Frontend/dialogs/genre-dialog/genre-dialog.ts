import { customElement, property, state } from 'lit-element/decorators';
import { CheckboxState } from '../../data/enumerations/checkbox-state';
import { FilterEntry } from '../../data/filter-entry';
import { LitElementBase } from '../../data/lit-element-base';
import { Session } from '../../data/session';
import { MessageSnackbar } from '../../native-components/message-snackbar/message-snackbar';
import { GenreModel, InstrumentModel, InstrumentType, MediaGenreModel } from '../../obscuritas-media-manager-backend-client';
import { PageRouting } from '../../pages/page-routing/page-routing';
import { GenreService, MusicService } from '../../services/backend.services';
import { GenreDialogResult } from '../dialog-result/genre-dialog.result';
import { InputDialog } from '../input-dialog/input-dialog';
import { renderGenreDialogStyles } from './genre-dialog.css';
import { renderGenreDialog } from './genre-dialog.html';
import { getAvailableGenreSections } from './media-genres';

export class GenreDialogOptions {
    genres: (MediaGenreModel | GenreModel)[] = [];
    allowedGenres: (MediaGenreModel | GenreModel)[] = [];
    forbiddenGenres: (MediaGenreModel | GenreModel)[] = [];
    allowThreeValues: boolean;
    allowAdd: boolean;
    allowRemove: boolean;
    ignoredState: CheckboxState;
}

@customElement('genre-dialog')
export class GenreDialog extends LitElementBase {
    static override get styles() {
        return renderGenreDialogStyles();
    }

    static async startShowingWithGenres(genresOrFilter: MediaGenreModel[] | FilterEntry<string>) {
        var genres = await GenreService.getAll();

        var options = { genres, allowAdd: true, allowRemove: true } as GenreDialogOptions;
        if (genresOrFilter instanceof FilterEntry) {
            options.allowedGenres = genres.filter((x) => genresOrFilter.required.includes(x.id));
            options.forbiddenGenres = genres.filter((x) => genresOrFilter.forbidden.includes(x.id));
            options.allowThreeValues = true;
        } else {
            options.allowedGenres = genresOrFilter;
            options.ignoredState = CheckboxState.Forbid;
        }

        var genreDialog = GenreDialog.show(options);

        genreDialog.options.genres = genres.filter((x) => genreDialog.availableSections.includes(x.section));

        genreDialog.addEventListener('selection-changed', async (e: Event) => {
            var mediaGenres = await GenreService.getAll();
            genreDialog.options.genres = mediaGenres.filter((x) => genreDialog.availableSections.includes(x.section));
            genreDialog.requestFullUpdate();
        });

        genreDialog.addEventListener('add-genre', async (e: CustomEvent<{ name: string; sectionName: string }>) => {
            try {
                var mediaGenres = genreDialog.options.genres as MediaGenreModel[];
                var sectionCategory = mediaGenres.find((x) => x.sectionName == e.detail.sectionName)!.section;
                await GenreService.addGenre(sectionCategory, e.detail.name);
                var genres = await GenreService.getAll();
                genreDialog.options.genres = genres.filter((x) => genreDialog.availableSections.includes(x.section));
                genreDialog.requestFullUpdate();
                MessageSnackbar.popup('Das Genre wurde erfolgreich hinzugefügt.', 'success');
            } catch (err) {
                MessageSnackbar.popup('Ein Fehler ist beim hinzufügen des Genres aufgetreten: ' + err, 'error');
                e.preventDefault();
            }
        });
        genreDialog.addEventListener('remove-genre', async (e: CustomEvent<GenreModel>) => {
            try {
                await GenreService.removeGenre(e.detail.id);
                var genres = await GenreService.getAll();
                genreDialog.options.genres = genres.filter((x) => genreDialog.availableSections.includes(x.section));
                genreDialog.requestFullUpdate();
                MessageSnackbar.popup('Das Genre wurde erfolgreich gelöscht.', 'success');
            } catch (err) {
                MessageSnackbar.popup('Ein Fehler ist beim löschen des Genres aufgetreten: ' + err, 'error');
                e.preventDefault();
            }
        });

        return genreDialog;
    }

    static async startShowingWithInstruments(instrumentsOrFilter: InstrumentModel[] | FilterEntry<string>) {
        var instrumentToGenre = (item: InstrumentModel, index: number) =>
            new GenreModel({ id: `${index}`, name: item.name, sectionName: item.type });
        var genres = Session.instruments.current().map(instrumentToGenre);

        var options: Partial<GenreDialogOptions> = { genres, allowAdd: true, allowRemove: true };

        if (instrumentsOrFilter instanceof FilterEntry) {
            options.allowedGenres = genres.filter((x) => instrumentsOrFilter.required.includes(x.name));
            options.forbiddenGenres = genres.filter((x) => instrumentsOrFilter.forbidden.includes(x.name));
            options.allowThreeValues = true;
        } else {
            options.allowedGenres = instrumentsOrFilter.map(instrumentToGenre);
            options.ignoredState = CheckboxState.Forbid;
        }

        var dialog = GenreDialog.show(options);

        dialog.addEventListener('add-genre', async (e: CustomEvent<MediaGenreModel>) => {
            await MusicService.addInstrument(e.detail.sectionName as InstrumentType, e.detail.name);
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
        });
        dialog.addEventListener('remove-genre', async (e: CustomEvent<GenreModel>) => {
            await MusicService.removeInstrument(e.detail.sectionName as InstrumentType, e.detail.name);
            dialog.options.genres = dialog.options.genres.filter((x) => x.name != e.detail.name);
            Session.instruments.next(await MusicService.getInstruments());
            await dialog.requestFullUpdate();
        });

        return dialog;
    }

    static show(options: Partial<GenreDialogOptions>) {
        var dialog = new GenreDialog();

        Object.assign(dialog.options, options);

        PageRouting.container!.append(dialog);
        dialog.requestFullUpdate();

        return dialog;
    }

    get availableSections() {
        return getAvailableGenreSections(this.options.allowedGenres as MediaGenreModel[]);
    }

    get genreDict() {
        return this.options.genres.reduce((prev, current, index, array) => {
            if (!prev[current.sectionName]) prev[current.sectionName] = [];
            prev[current.sectionName].push(current as MediaGenreModel);

            return prev;
        }, {} as { [key: string]: MediaGenreModel[] });
    }

    @property({ type: Object }) public declare options: GenreDialogOptions;
    @state() protected declare searchText: string;

    constructor() {
        super();
        this.searchText = '';
        this.options = {
            genres: [],
            allowedGenres: [],
            forbiddenGenres: [],
            allowThreeValues: false,
            ignoredState: CheckboxState.Ignore,
            allowAdd: false,
            allowRemove: false,
        };
    }

    override render() {
        return renderGenreDialog.call(this);
    }

    handleGenreSelection(eventDetail: { value: CheckboxState }, genre: GenreModel) {
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

    accept(e: Event) {
        e.stopPropagation();
        var result = new GenreDialogResult();
        result.acceptedGenres = this.options.allowedGenres;
        result.forbiddenGenres = this.options.forbiddenGenres;
        this.dispatchEvent(new CustomEvent('accept', { detail: result }));
    }

    getValue(genre: GenreModel) {
        if (this.options.allowedGenres.some((x) => x.name == genre.name)) return CheckboxState.Require;
        if (this.options.forbiddenGenres.some((x) => x.name == genre.name)) return CheckboxState.Forbid;
        return CheckboxState.Ignore;
    }

    async addGenre(sectionName: string) {
        var name = await InputDialog.show('Bitte Namen eingeben:');
        if (!name) return;
        this.dispatchEvent(new CustomEvent('add-genre', { detail: { name, sectionName } }));
    }

    async removeGenre(event: Event, genre: GenreModel) {
        this.dispatchEvent(new CustomEvent('remove-genre', { detail: genre }));
        event.stopPropagation();
    }
}
