import { customElement, query, state } from 'lit-element/decorators';
import { LitElementBase } from '../../data/lit-element-base';
import { Observable } from '../../data/observable';
import { DialogBase } from '../../dialogs/dialog-base/dialog-base';
import { waitForAnimation, waitForSeconds } from '../../extensions/animation.extension';
import { dimLight, undimLight } from '../../extensions/document.extensions';
import { changePage, getQueryValue } from '../../extensions/url.extension';
import { AutocompleteItem } from '../../native-components/autocomplete-input/autocomplete-input';
import { SideScroller } from '../../native-components/side-scroller/side-scroller';
import { FoodImageModel, FoodModel, FoodThumbModel } from '../../obscuritas-media-manager-backend-client';
import { RecipeService } from '../../services/backend.services';
import { CachingService } from '../../services/caching.service';
import { ImageCompressionService } from '../../services/image-compression.service';
import { RecipesPage } from '../recipes-page/recipes-page';
import { renderImportFoodPageStyles } from './import-food-page.css';

const CacheName = 'food-cache' as const;
export const FoodCache = window.caches ? new CachingService<FoodModel>(await caches.open(CacheName)) : null!;
if (FoodCache) await FoodCache.initialize();

@customElement('import-food-page')
export class ImportFoodPage extends LitElementBase {
    static isPage = true as const;
    static caching = new Observable<boolean>(false);
    static cacheAbertController? = new AbortController();

    static async cacheFilesParallel(files: FileList) {
        if (this.cacheAbertController) this.cacheAbertController.abort();
        this.cacheAbertController = new AbortController();

        window.onbeforeunload = (e) => {
            if (ImportFoodPage.caching.current()) e.preventDefault();
        };
        window.onpopstate = (e) => {
            if (!ImportFoodPage.caching.current()) return;
            e.stopImmediatePropagation();
            alert('Einige Bilder sind noch nicht hochgeladen, wenn du die Seite jetzt verlässt, gehen einige Bilder verloren!');
        };

        if (files.length) await FoodCache.clear();

        this.caching.next(true);
        this.cacheFiles(files.toIterator(), this.cacheAbertController.signal).then(() => {
            this.caching.next(false);
            window.onbeforeunload = null;
            window.onpopstate = null;
        });

        while (FoodCache.length <= 10 && this.caching.current()) await waitForSeconds(0);
    }

    private static async cacheFiles(
        files: IteratorObject<File, undefined> | IteratorObject<Response, undefined>,
        signal: AbortSignal
    ) {
        let i = 0;

        while (!signal.aborted) {
            var result = files.next();
            if (result.done) break;
            const file = result.value;
            const response = file instanceof Response ? file : new Response(file);
            const dish = new FoodModel({
                id: i.toString(),
                tags: [],
                images: [new FoodImageModel()],
                thumbs: [new FoodThumbModel()],
                deleted: false,
                difficulty: 0,
                rating: 0,
                description: '',
                title: '',
            });
            await FoodCache.cacheJson(dish, await response.blob());

            i++;
        }
    }

    static override get styles() {
        return renderImportFoodPageStyles();
    }

    @query('side-scroller') protected declare sideScroller?: SideScroller;
    @query('#current-image') protected declare currentImageElement?: HTMLImageElement;

    protected paginatedFiles: FoodModel[] = [];
    @state() protected declare currentDish: FoodModel;
    @state() protected declare loading: boolean;

    get currentAspectRatio() {
        if (!this.currentImageElement) return 1;
        return this.currentImageElement.naturalWidth / this.currentImageElement.naturalHeight;
    }

    get currentIndex() {
        return this.sideScroller?.currentItemIndex ?? 0;
    }

    override render() {}

    async connectedCallback() {
        await super.connectedCallback();

        dimLight();
        this.tabIndex = 0;
        this.focus();
        document.title = 'Gerichte importieren';

        document.addEventListener('keyup', this.handleKeyUp.bind(this));
        this.subscriptions.push(ImportFoodPage.caching.subscribe(async () => this.requestFullUpdate(), true));

        var fromQuery = Number.parseInt(getQueryValue('index') ?? '0');
        let itemsToGet = 10;

        while (itemsToGet <= fromQuery) itemsToGet += 10;
        await this.loadMoreImages(itemsToGet);
        await this.requestFullUpdate();
        await this.updated;
        await waitForAnimation();

        if (fromQuery) this.sideScroller!.setIndex(fromQuery);
    }

    async loadMoreImages(itemsToGet?: number) {
        if (this.loading) return;
        this.loading = true;
        const currentLength = this.paginatedFiles.length;
        while (itemsToGet && this.currentIndex > currentLength + itemsToGet) itemsToGet += 10;
        itemsToGet ??= Number.POSITIVE_INFINITY;

        while (ImportFoodPage.caching.current() && FoodCache.length < itemsToGet) await Promise.resolve();

        if (FoodCache.length <= this.paginatedFiles.length) {
            this.loading = false;
            return;
        }
        if (!FoodCache.length) throw new Error('no items to import!');

        const itemsLeft = FoodCache.length - this.paginatedFiles.length;
        if (itemsToGet > itemsLeft) itemsToGet = itemsLeft;

        for (var fromCache of (await FoodCache.getIterator()).drop(this.paginatedFiles.length).take(itemsToGet)) {
            var dish = FoodModel.fromJS(await fromCache);
            this.paginatedFiles.push(dish);
            await this.reloadThumb(dish, false);
        }

        await this.requestFullUpdate();
        this.changeCurrentImage();
        this.loading = false;
    }

    async changeCurrentImage() {
        if (this.currentDish) await FoodCache.updateMetadata(this.currentDish);
        if (this.currentIndex >= this.paginatedFiles.length - 5) await this.loadMoreImages(10);
        this.currentDish = this.paginatedFiles[this.currentIndex];

        changePage(ImportFoodPage, { index: this.currentIndex } as any, false);
        this.requestFullUpdate();
    }

    async reloadImage(dish: FoodModel, update = true) {
        var response = await FoodCache.getPayload(dish);
        var test = await response.base64();
        if (!test.startsWith('data:image')) return;
        dish.images[0].imageData = URL.createObjectURL(response);
        await FoodCache.updateMetadata(dish);
        if (update) await this.requestFullUpdate();
    }

    async reloadThumb(dish: FoodModel, update = true) {
        await this.reloadImage(dish, update);
        if (!dish.images[0].imageData?.startsWith('data:image')) return;
        var thumbData = await ImageCompressionService.generateThumbnail(dish.images[0].imageData!);
        dish.thumbs[0].thumbData = URL.createObjectURL(thumbData);
        await FoodCache.updateMetadata(dish);
        if (update) await this.requestFullUpdate();
    }

    async searchDishes(search: string) {
        var fromCache = await Promise.all((await FoodCache.getIterator()).toArray());

        return fromCache
            .filter((x) => x?.title?.length && x.title.toLowerCase().includes(search.toLowerCase()))
            .concat(await RecipeService.searchDishes(search))
            .sort()
            .distinctBy((x) => x.title)
            .map((x) => Object.assign(x, { id: x.title, text: x.title }) as typeof x & AutocompleteItem);
    }

    async handleKeyUp(event: KeyboardEvent) {
        if (event.key == 'Delete') {
            var confirmed = await DialogBase.show('Bist du sicher?', {
                acceptActionText: 'Ja',
                declineActionText: 'Nein',
                content: `Das Bild wird aus dem Cache gelöscht und kann nicht wiederhergestellt werden.
Es bleibt jedoch auf deinem Computer erhalten.
Bit du sicher dass du es löschen möchtest?`,
            });
            if (!confirmed) return;
            await this.removeDish(this.currentDish!);
        }
        if (event.key == 'ArrowLeft') this.sideScroller!.setIndex(this.currentIndex - 1);
        if (event.key == 'ArrowRight') this.sideScroller!.setIndex(this.currentIndex + 1);
    }

    applySearchResult(result: FoodModel) {
        if (!this.currentDish) return;
        this.currentDish.description ||= result.description;
        this.currentDish.rating ||= result.rating;
        this.currentDish.difficulty ||= result.difficulty;
        if (!this.currentDish.tags.length) this.currentDish.tags = [...result.tags];

        this.requestFullUpdate();
    }

    async removeDish(dish: FoodModel) {
        await FoodCache.deleteObject(dish);
        this.paginatedFiles = this.paginatedFiles.filter((fromList) => fromList != dish);

        if (this.sideScroller!.currentItemIndex >= this.paginatedFiles.length) {
            this.sideScroller?.setIndex(this.paginatedFiles.length - 1);
            return;
        }

        if (dish == this.currentDish) {
            this.changeCurrentImage();
        } else {
            var currentIndex = this.paginatedFiles.indexOf(this.currentDish);
            if (this.sideScroller?.currentItemIndex != currentIndex) this.sideScroller?.setIndex(currentIndex);
        }

        await this.requestFullUpdate();
    }

    async importFiles() {
        if (ImportFoodPage.caching.current()) {
            await DialogBase.show('Einige Bilder laden noch!', {
                acceptActionText: 'Ok',
                content: `Einige Bilder sind noch nicht geladen. 
Bitte warte, bis das Caching abgeschlossen ist, bevor du importierst.`,
            });
            return;
        }

        var cacheSize = FoodCache.length;
        var confirmed = await DialogBase.show(`${cacheSize} Gerichte importieren`, {
            acceptActionText: 'Ja',
            declineActionText: 'Nein',
            content: `Bist du sicher, dass du diese Gerichte importieren möchtest?
${
    this.paginatedFiles.length < cacheSize
        ? '\nWarnung! Es sind noch unbearbeitete Bilder übrig. Diese Bilder werden ohne Metadaten importiert.'
        : ''
}
Abhängig von der Größe kann der Vorgang einige Minuten dauern.`,
        });

        if (!confirmed) return;

        this.loadMoreImages();

        var dupes = [];
        for (let dish of this.paginatedFiles) {
            try {
                dish.id = null!;
                dish.images[0].recipeId = null!;
                var response = await fetch(dish.images[0].imageData!);
                var blob = await response.blob();
                var base64 = await blob.base64();
                dish.images[0].imageData = base64.split(',')[1];
                dish.images[0].mimeType = blob.type;
                dish.thumbs[0].thumbData = (await (await ImageCompressionService.generateThumbnail(base64)).base64()).split(
                    ','
                )[1];
                await RecipeService.importDish(dish);
            } catch (ex) {
                if (ex.httpStatus == 409) dupes.push(dish);
                else {
                    await DialogBase.show('Something went wrong', {
                        declineActionText: 'Ok',
                        content: `Ein Fehler ist beim hochladen des Gerichts ${dish.title} aufgetreten.
Fehler: ${ex.reason}`,
                    });
                    return;
                }
            }
        }

        await FoodCache.clear();

        if (dupes.length > 0) {
            ImportFoodPage.cacheAbertController = new AbortController();

            for (let i = 0; i < dupes.length; i++)
                await FoodCache.cacheJson(dupes[i], await (dupes[i].images[0].imageData as any as Response).blob());
            await DialogBase.show('Duplikate übersprungen', {
                declineActionText: 'Ok',
                content: `Beim hochladen wurden ${dupes.length} Duplikate übersprungen.
Alle anderen Gerichte wurden erfolgreich hochgeladen.
Die Duplikate verbleiben auf der Seite.
Wenn alles in Ordnung ist, kannst du die Seite manuell verlassen.`,
            });
            return;
        }

        changePage(RecipesPage);
    }

    disconnectedCallback(): void {
        super.disconnectedCallback();
        undimLight();
        document.removeEventListener('keyup', this.handleKeyUp);
    }
}
