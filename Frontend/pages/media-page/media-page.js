import { MediaFilter } from '../../advanced-components/media-filter-sidebar/media-filter.js';
import { InteropCommand } from '../../client-interop/interop-command.js';
import { LitElementBase } from '../../data/lit-element-base.js';
import { Session } from '../../data/session.js';
import { EntityStatusDialog } from '../../dialogs/entity-status-dialog/entity-status-dialog.js';
import { ContextTooltip } from '../../native-components/context-tooltip/context-tooltip.js';
import { LinkElement } from '../../native-components/link-element/link-element.js';
import { MessageSnackbar } from '../../native-components/message-snackbar/message-snackbar.js';
import {
    Language,
    MediaCategory,
    MediaModel,
    ModelCreationState,
    UpdateRequestOfObject,
} from '../../obscuritas-media-manager-backend-client.js';
import { GenreService, MediaService } from '../../services/backend.services.js';
import { ClientInteropService } from '../../services/client-interop-service.js';
import { MaintenanceService } from '../../services/maintenance.service.js';
import { MediaFilterService } from '../../services/media-filter.service.js';
import { MediaImportService } from '../../services/media-import.service.js';
import { MediaDetailPage } from '../media-detail-page/media-detail-page.js';
import { renderMediaPageStyles } from './media-page.css.js';
import { renderMediaPageTemplate } from './media-page.html.js';

export class MediaPage extends LitElementBase {
    static get styles() {
        return renderMediaPageStyles();
    }

    static get isPage() {
        return true;
    }

    static get pageName() {
        return 'Filme & Serien';
    }

    get filteredMedia() {
        if (!this.filter) return Session.mediaList.current();

        return MediaFilterService.filter([...Session.mediaList.current()], this.filter);
    }

    constructor() {
        super();

        /** @type {string[]} */ this.genreList = [];
        this.loading = true;
    }

    async connectedCallback() {
        super.connectedCallback();
        document.title = MediaPage.pageName;
        var genres = await GenreService.getAll();
        this.genreList = genres.map((x) => x.name);
        this.filter = new MediaFilter(genres.map((x) => x.id));

        var localSearchString = localStorage.getItem(`media.search`);
        if (localSearchString) this.filter = MediaFilter.fromJSON(localSearchString);

        this.subscriptions.push(Session.mediaList.subscribe(() => this.requestFullUpdate()));

        this.loading = false;
        this.requestFullUpdate();
    }

    get paginatedMedia() {
        return Session.mediaList;
    }

    render() {
        return renderMediaPageTemplate(this);
    }

    /**
     * @param {MediaCategory} category
     * @param {Language} language
     */
    async importFolder(category, language) {
        try {
            await MediaImportService.importMediaCollections(category, language);
            Session.mediaList.next(await MediaService.getAll());
        } catch (err) {
            console.error('the import of files was aborted', err);
        }
    }

    async cleanupMedia() {
        var success = await MaintenanceService.cleanMedia();
        if (!success) return;
        Session.mediaList.next(await MediaService.getAll());
        await this.requestFullUpdate();
    }

    async autoFillAnime() {
        var relevantAnime = Session.mediaList
            .current()
            .filter((x) => x.type == MediaCategory.AnimeMovies || x.type == MediaCategory.AnimeSeries);

        var isComplete = false;
        var dialog = EntityStatusDialog.show(() => isComplete);

        if (relevantAnime.length > 0)
            await ClientInteropService.sendCommand({ command: InteropCommand.OpenChromeForDebugging, payload: null });
        for (var anime of relevantAnime) {
            try {
                var updated = await MediaService.autoFillMediaDetails(anime.id);
                dialog.addEntry({
                    status: ModelCreationState.Updated,
                    text: LinkElement.forPage(MediaDetailPage, { mediaId: anime.id }, updated.name),
                });
            } catch {}
        }
        if (relevantAnime.length > 0)
            await ClientInteropService.sendCommand({ command: InteropCommand.OpenChromeForDebugging, payload: { close: true } });
        dialog.addEventListener('accept', () => dialog.remove());
        isComplete = true;

        dialog.requestFullUpdate();
    }

    async repairMedia() {
        var success = await MaintenanceService.repairMedia();
        if (!success) return;
        Session.mediaList.next(await MediaService.getAll());
        await this.requestFullUpdate();
    }

    /**
     * @param {PointerEvent} event
     */
    async requestImportTypeSelection(event) {
        const tooltipItems = [
            { text: 'Animes Ger Dub', category: MediaCategory.AnimeSeries, language: Language.German },
            { text: 'Animes Ger Sub', category: MediaCategory.AnimeSeries, language: Language.Japanese },
            { text: 'Realfilme', category: MediaCategory.RealMovies, language: Language.German },
            { text: 'Animefilme', category: MediaCategory.AnimeMovies, language: Language.German },
            { text: 'Realfilmserien', category: MediaCategory.RealSeries, language: Language.German },
            { text: 'J-Dramen', category: MediaCategory.RealSeries, language: Language.Japanese },
        ];
        /** @type {typeof tooltipItems[0]} */ var selection = await ContextTooltip.spawn(event, tooltipItems);

        if (!selection) return;

        await this.importFolder(selection.category, selection.language);
    }

    /**
     * @template {keyof MediaModel} T
     * @param {MediaModel} media
     * @param {T} property
     * @param {MediaModel[T]} value
     */
    async changePropertyOf(media, property, value) {
        try {
            if (typeof media[property] != typeof value) return;

            /** @type {any} */ const { oldModel, newModel } = { oldModel: {}, newModel: {} };
            oldModel[property] = media[property];
            newModel[property] = value;
            await MediaService.updateMedia(media.id, new UpdateRequestOfObject({ oldModel, newModel }));
            media[property] = value;
            MessageSnackbar.popup('Der Eintrag wurde erfolgreich geändert.', 'success');
            this.requestFullUpdate();
        } catch (err) {
            MessageSnackbar.popup('Ein Fehler ist beim update des Eintrags aufgetreten: ' + err, 'error');
            console.error(err);
        }
    }

    async setMediaImage(mediaId, image) {
        await MediaService.addMediaImage(image, mediaId);
        await this.requestFullUpdate();
    }

    /**
     * @param {MediaModel} media
     */
    async hardDelete(media) {
        try {
            await MediaService.hardDeleteMedium(media.id);
            Session.mediaList.next(Session.mediaList.current().filter((x) => x.id != media.id));
            MessageSnackbar.popup('Der Track wurde erfolgreich aus der Datenbank gelöscht.', 'success');
        } catch (err) {
            MessageSnackbar.popup('Ein Fehler ist beim löschen des Eintrags aufgetreten: ' + err, 'error');
        }
    }

    /**
     * @param {MediaModel} media
     */
    async fullDelete(media) {
        try {
            await MediaService.fullDeleteMedium(media.id);
            Session.mediaList.next(Session.mediaList.current().filter((x) => x.id != media.id));
            MessageSnackbar.popup('Der Track wurde vollständig gelöscht.', 'success');
        } catch (err) {
            MessageSnackbar.popup('Ein Fehler ist beim löschen des Eintrags aufgetreten: ' + err, 'error');
        }
    }
}
