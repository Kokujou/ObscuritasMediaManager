import { customElement, state } from 'lit-element/decorators';
import { MediaFilter } from '../../advanced-components/media-filter-sidebar/media-filter';
import { InteropQuery } from '../../client-interop/interop-query';
import { LitElementBase } from '../../data/lit-element-base';
import { Session } from '../../data/session';
import { GenreDialogResult } from '../../dialogs/dialog-result/genre-dialog.result';
import { GenreDialog } from '../../dialogs/genre-dialog/genre-dialog';
import { MessageSnackbar } from '../../native-components/message-snackbar/message-snackbar';
import {
    ContentWarning,
    MediaCategory,
    MediaCreationRequest,
    MediaGenreModel,
    MediaModel,
    ModelCreationState,
    MusicModel,
    UpdateRequestOfObject,
} from '../../obscuritas-media-manager-backend-client';
import { MediaService } from '../../services/backend.services';
import { ClientInteropService } from '../../services/client-interop-service';
import { setFavicon } from '../../services/extensions/style.extensions';
import { changePage } from '../../services/extensions/url.extension';
import { MediaFilterService } from '../../services/media-filter.service';
import { renderMediaDetailPageStyles } from './media-detail-page.css';
import { renderMediaDetailPage } from './media-detail-page.html';

@customElement('media-detail-page')
export class MediaDetailPage extends LitElementBase {
    static get isPage() {
        return true as const;
    }

    static override get styles() {
        return renderMediaDetailPageStyles();
    }

    get nameInputValue() {
        return (this.shadowRoot!.querySelector('#media-name') as HTMLInputElement)?.value;
    }

    get seasonScrollContainer() {
        var element = this.shadowRoot!.querySelector<HTMLElement>('#season-inner')!;

        if (element) return element;
        return undefined;
    }

    get nextMediaId() {
        var currentIndex = this.mediaIds.findIndex((x) => x == this.updatedMedia.id);
        if (currentIndex < 0) return null;
        return this.mediaIds[currentIndex + 1];
    }

    get prevMediaId() {
        var currentIndex = this.mediaIds.findIndex((x) => x == this.updatedMedia.id);
        if (currentIndex < 0) return null;
        return this.mediaIds[currentIndex - 1];
    }

    get imageUrl() {
        return `./Backend/api/media/${this.updatedMedia.id}/image?rev=${this.imageRevision}`;
    }

    get isJapanese() {
        var type = this.updatedMedia.type;
        return type == MediaCategory.AnimeMovies || type == MediaCategory.AnimeSeries || type == MediaCategory.JDrama;
    }

    @state() public declare mediaId: string;

    @state() protected declare updatedMedia: MediaModel;
    @state() protected declare mediaIds: string[];
    @state() protected declare hasImage: boolean;
    @state() protected declare relatedTracks: MusicModel[];
    @state() protected declare imageRevision: number;
    @state() protected declare hoveredRating: number;
    @state() protected declare selectedSeason: number;
    @state() protected declare createNew: boolean;

    override async connectedCallback() {
        this.imageRevision = Date.now();
        this.mediaIds = [];
        this.relatedTracks = [];
        if (this.createNew) this.updatedMedia = await MediaService.getDefault();

        super.connectedCallback();

        this.subscriptions.push(
            Session.mediaList.subscribe((newList) => {
                var filter = MediaFilter.fromJSON(localStorage.getItem(`media.search`) ?? '');
                this.mediaIds = MediaFilterService.filter([...newList], filter).map((x) => x.id);
            })
        );
        Session.mediaList.refresh();
    }

    override render() {
        if (!this.updatedMedia) return null;

        document.title = this.updatedMedia.name;

        return renderMediaDetailPage.call(this);
    }

    async updated(_changedProperties: Map<keyof MediaDetailPage, any>) {
        super.updated(_changedProperties);
        if (this.mediaId != this.updatedMedia?.id && !this.createNew) {
            this.updatedMedia = await MediaService.get(this.mediaId);
            this.relatedTracks = Session.tracks
                .current()
                .filter((x) => x.source && x.source.length > 2)
                .filter((x) => MediaFilterService.search([this.updatedMedia], x.source!, false).length > 0);

            this.requestFullUpdate();
            document.title = this.updatedMedia.name;
            setFavicon(this.imageUrl, 'url');
        }
    }

    async showGenreSelectionDialog() {
        var genreDialog = await GenreDialog.startShowingWithGenres(this.updatedMedia.genres);

        genreDialog.addEventListener('accept', async (e: CustomEvent<GenreDialogResult>) => {
            await this.changeProperty('genres', e.detail.acceptedGenres as MediaGenreModel[]);
            genreDialog.remove();
        });
    }

    async changeProperty<T extends keyof MediaModel>(property: T, value: MediaModel[T]) {
        try {
            const { oldModel, newModel } = { oldModel: {} as any, newModel: {} as any };
            oldModel[property] = this.updatedMedia[property];
            newModel[property] = value;

            if (!this.createNew) {
                await MediaService.updateMedia(this.updatedMedia.id, new UpdateRequestOfObject({ oldModel, newModel }));
                Session.mediaList.current().find((x) => x.id == this.updatedMedia.id)![property] = value;
                Session.mediaList.refresh();
            }

            this.updatedMedia[property] = value;
            this.requestFullUpdate();
        } catch (err) {
            console.error(err);
        }
    }

    async setMediaImage(image: string | null) {
        if (!image) await MediaService.deleteMediaImage(this.updatedMedia.id);
        else await MediaService.addMediaImage(image, this.updatedMedia.id);
        this.imageRevision = Date.now();
        await this.requestFullUpdate();
    }

    async releaseChanged(inputElement: HTMLInputElement) {
        var numberValue = Number.parseInt(inputElement.value);
        var maxYears = new Date().getFullYear() + 2;
        if (numberValue < 1900) numberValue = 1900;
        if (numberValue > maxYears) numberValue = maxYears;
        if (`${numberValue}` != inputElement.value) inputElement.value = `${numberValue}`;
        await this.changeProperty('release', numberValue);
    }

    releaseInput(inputElement: HTMLInputElement) {
        var numberValue = Number.parseInt(inputElement.value);
        if (`${numberValue}` != inputElement.value) inputElement.value = `${numberValue}`;
    }

    async toggleContentWarning(warning: ContentWarning) {
        if (!this.updatedMedia.contentWarnings.includes(warning))
            return await this.changeProperty('contentWarnings', this.updatedMedia.contentWarnings.concat(warning));

        return await this.changeProperty(
            'contentWarnings',
            this.updatedMedia.contentWarnings.filter((x) => x != warning)
        );
    }

    async changeBasePath() {
        var folderPath = await ClientInteropService.executeQuery<string>({
            query: InteropQuery.RequestFolderPath,
            payload: null,
        });
        if (!folderPath) return;
        await this.changeProperty('rootFolderPath', folderPath);
    }

    async createEntry() {
        try {
            if (!this.updatedMedia.rootFolderPath) throw new Error('The folder path must be valid.');
            var result = await MediaService.createFromMediaPath(
                new MediaCreationRequest({
                    category: this.updatedMedia.type,
                    entry: this.updatedMedia,
                    language: this.updatedMedia.language,
                    rootPath: this.updatedMedia.rootFolderPath,
                })
            );
            if (result.value != ModelCreationState.Success) throw new Error(result.value);
            Session.mediaList.next(await MediaService.getAll());
            await MessageSnackbar.popup('Der Eintrag wurde erfolgreich erstellt.', 'success');
            changePage(MediaDetailPage, { mediaId: result.key });
        } catch (err) {
            await MessageSnackbar.popup('Ein Fehler ist beim erstellen des Eintrags aufgetreten: ' + err, 'error');
        }
    }

    openMediaExternal() {
        if (this.updatedMedia.type == MediaCategory.AnimeSeries || this.updatedMedia.type == MediaCategory.AnimeMovies)
            window.open(`https://anilist.co/search/anime?search=${this.updatedMedia.name}`);
        else window.open(`https://www.imdb.com/find/?q=${this.updatedMedia.name}&ref_=nv_sr_sm`);
    }
}
