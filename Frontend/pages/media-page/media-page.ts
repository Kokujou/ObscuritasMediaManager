import { customElement, state } from 'lit-element/decorators';
import { MediaFilter } from '../../advanced-components/media-filter-sidebar/media-filter';
import { AutoFillAnimeQueryRequest } from '../../client-interop/auto-fill-anime-query-request';
import { AutoFilledAnimeResponse } from '../../client-interop/auto-filled-anime-response';
import { InteropEvent } from '../../client-interop/interop-event';
import { InteropQuery } from '../../client-interop/interop-query';
import { LitElementBase } from '../../data/lit-element-base';
import { Session } from '../../data/session';
import { DialogBase } from '../../dialogs/dialog-base/dialog-base';
import { EntityStatusDialog } from '../../dialogs/entity-status-dialog/entity-status-dialog';
import { ContextTooltip } from '../../native-components/context-tooltip/context-tooltip';
import { LinkElement } from '../../native-components/link-element/link-element';
import { MessageSnackbar } from '../../native-components/message-snackbar/message-snackbar';
import {
    Language,
    MediaCategory,
    MediaModel,
    ModelCreationState,
    UpdateRequestOfObject,
} from '../../obscuritas-media-manager-backend-client';
import { GenreService, MediaService } from '../../services/backend.services';
import { ClientInteropService } from '../../services/client-interop-service';
import { MaintenanceService } from '../../services/maintenance.service';
import { MediaFilterService } from '../../services/media-filter.service';
import { MediaImportService } from '../../services/media-import.service';
import { MediaDetailPage } from '../media-detail-page/media-detail-page';
import { renderMediaPageStyles } from './media-page.css';
import { renderMediaPageTemplate } from './media-page.html';

@customElement('media-page')
export class MediaPage extends LitElementBase {
    static override get styles() {
        return renderMediaPageStyles();
    }

    static isPage = true as const;

    static get pageName() {
        return 'Filme & Serien';
    }

    get filteredMedia() {
        if (!this.filter) return Session.media.current();

        return MediaFilterService.filter([...Session.media.current()], this.filter);
    }

    get itemsPerPage() {
        return Math.floor((this.shadowRoot!.querySelector('#results')?.getBoundingClientRect()?.width ?? 800) / 200) * 5;
    }

    get paginatedMedia() {
        return this.filteredMedia.slice(0, this.itemsPerPage * this.page);
    }

    get animeToAutoFill() {
        return Session.media
            .current()
            .filter((x) => x.type == MediaCategory.AnimeMovies || x.type == MediaCategory.AnimeSeries)
            .filter(
                (x) =>
                    (x.description?.length ?? 0) <= 5 ||
                    (x.kanjiName?.length ?? 0) < 2 ||
                    (x.romajiName?.length ?? 0) < 5 ||
                    x.release <= 1900,
            );
    }

    @state() declare protected genreList: string[];
    @state() declare protected page: number;
    @state() declare protected loading: boolean;

    declare protected filter: MediaFilter;

    constructor() {
        super();
        this.loading = true;
        this.page = 1;
        this.genreList = [];
    }

    override async connectedCallback() {
        super.connectedCallback();

        document.title = MediaPage.pageName;
        var genres = await GenreService.getAll();
        this.genreList = genres.map((x) => x.name);
        this.filter = new MediaFilter(genres.map((x) => x.id));

        var localSearchString = localStorage.getItem(`media.search`);
        if (localSearchString) this.filter = MediaFilter.fromJSON(localSearchString);

        this.subscriptions.push(Session.media.subscribe(() => this.requestFullUpdate()));

        this.loading = false;
        await this.requestFullUpdate();
    }

    override render() {
        return renderMediaPageTemplate.call(this);
    }

    async importFolder(category: MediaCategory, language: Language) {
        try {
            await MediaImportService.importMediaCollections(category, language);
            Session.media.next(await MediaService.getAll());
        } catch (err) {
            console.error('the import of files was aborted', err);
        }
    }

    async cleanupMedia() {
        var success = await MaintenanceService.cleanMedia();
        if (!success) return;
        Session.media.next(await MediaService.getAll());
        await this.requestFullUpdate();
    }

    async autoFillAnime() {
        var isComplete = false;
        var dialog = EntityStatusDialog.show(() => isComplete);
        var relevantAnime = this.animeToAutoFill;
        var aborter = new AbortController();

        var eventSubscription = ClientInteropService.eventResponse.subscribe((e) => {
            if (e.event != InteropEvent.ChromeClosed) return;
            aborter.abort();
            MessageSnackbar.popup('Die Verbindung zum Chrome Browser wurde unterbrochen. Der Vorgang wird abgebrochen.', 'error');
            eventSubscription.unsubscribe();
        });

        for (var anime of relevantAnime) {
            if (aborter.signal.aborted) break;
            try {
                var updated = await ClientInteropService.executeQuery<AutoFilledAnimeResponse>({
                    query: InteropQuery.AutoFillAnime,
                    payload: { isMovie: anime.type == MediaCategory.AnimeMovies, name: anime.name } as AutoFillAnimeQueryRequest,
                });

                const { oldModel, newModel } = { oldModel: {} as MediaModel, newModel: {} as MediaModel };

                if ((anime.romajiName?.length ?? 0) < 5) newModel.romajiName = updated.romajiName ?? anime.romajiName;
                if ((anime.kanjiName?.length ?? 0) < 2) newModel.kanjiName = updated.kanjiName ?? anime.kanjiName;
                if ((anime.description?.length ?? 0) < 5) newModel.description = updated.description ?? anime.description;
                if ((anime.englishName?.length ?? 0) < 5) newModel.englishName = updated.englishName ?? anime.englishName;
                if ((anime.germanName?.length ?? 0) < 5) newModel.germanName = updated.germanName ?? anime.germanName;
                if (anime.rating == null) newModel.rating = updated.rating ?? anime.rating;
                if (anime.release <= 1900) newModel.release = updated.release ?? anime.release;

                for (var key of Object.keysOf(newModel)) oldModel[key] = anime[key] as never;

                await MediaService.updateMedia(anime.id, new UpdateRequestOfObject({ oldModel, newModel }));

                if ((updated.image?.length ?? 0) > 5 && !(await MediaService.imageExists(anime.id)))
                    await MediaService.addMediaImage(updated.image, anime.id);

                dialog.addEntry({
                    status: ModelCreationState.Updated,
                    text: LinkElement.forPage(MediaDetailPage, { mediaId: anime.id }, anime.name),
                });
            } catch {
                dialog.addEntry({
                    status: ModelCreationState.Error,
                    text: LinkElement.forPage(MediaDetailPage, { mediaId: anime.id }, anime.name),
                });
            }
        }
        dialog.addEventListener('accept', () => dialog.remove());
        isComplete = true;

        dialog.requestFullUpdate();
        eventSubscription.unsubscribe();
    }

    async repairMedia() {
        var success = await MaintenanceService.repairMedia();
        if (!success) return;
        Session.media.next(await MediaService.getAll());
        await this.requestFullUpdate();
    }

    async requestImportTypeSelection(event: PointerEvent) {
        const tooltipItems = [
            { text: 'Animes Ger Dub', category: MediaCategory.AnimeSeries, language: Language.German },
            { text: 'Animes Ger Sub', category: MediaCategory.AnimeSeries, language: Language.Japanese },
            { text: 'Realfilme', category: MediaCategory.RealMovies, language: Language.German },
            { text: 'Animefilme', category: MediaCategory.AnimeMovies, language: Language.German },
            { text: 'Realfilmserien', category: MediaCategory.RealSeries, language: Language.German },
            { text: 'J-Dramen', category: MediaCategory.RealSeries, language: Language.Japanese },
        ];
        var selection = (await ContextTooltip.spawn(event, tooltipItems)) as (typeof tooltipItems)[0];

        if (!selection) return;

        await this.importFolder(selection.category, selection.language);
    }

    async changePropertyOf<T extends keyof MediaModel>(media: MediaModel, property: T, value: MediaModel[T]) {
        try {
            if (typeof media[property] != typeof value) return;

            const { oldModel, newModel } = { oldModel: {} as any, newModel: {} as any };
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

    async setMediaImage(mediaId: string, image: string) {
        await MediaService.addMediaImage(image, mediaId);
        await this.requestFullUpdate();
    }

    async hardDelete(media: MediaModel) {
        try {
            var confirmed = await DialogBase.show('Achtung', {
                content:
                    'Der Anime wird aus der Datenbank gelöscht.!\n' +
                    'Alle eingegebenen Daten werden unwiederruflich gelöscht.!\n' +
                    'Bist du sicher?\n',
            });
            if (!confirmed) return;
            await MediaService.hardDeleteMedium(media.id);
            Session.media.next(Session.media.current().filter((x) => x.id != media.id));
            MessageSnackbar.popup('Der Track wurde erfolgreich aus der Datenbank gelöscht.', 'success');
        } catch (err) {
            MessageSnackbar.popup('Ein Fehler ist beim löschen des Eintrags aufgetreten: ' + err, 'error');
        }
    }

    async fullDelete(media: MediaModel) {
        try {
            var confirmed = await DialogBase.show('ACHTUNG - NICHT RÜCKGÄNGIG ZU MACHEN!', {
                content:
                    'Der Eintrag wird nicht nur aus der Datenbank sondern auch von der Festplatte gelöscht.\n' +
                    'Daten die so verloren werden können nicht wiederhergestellt werden!\n' +
                    'Bist du sicher, dass du den Eintrag löschen möchtest?\n',
            });
            if (!confirmed) return;
            await MediaService.fullDeleteMedium(media.id);
            Session.media.next(Session.media.current().filter((x) => x.id != media.id));
            MessageSnackbar.popup('Der Track wurde vollständig gelöscht.', 'success');
        } catch (err) {
            MessageSnackbar.popup('Ein Fehler ist beim löschen des Eintrags aufgetreten: ' + err, 'error');
        }
    }
}
