import { customElement, query, state } from 'lit-element/decorators';
import { LitElementBase } from '../../data/lit-element-base';
import { Observable } from '../../data/observable';
import { DialogBase } from '../../dialogs/dialog-base/dialog-base';
import { waitForAnimation } from '../../extensions/animation.extension';
import { dimLight, undimLight } from '../../extensions/document.extensions';
import { changePage, getQueryValue } from '../../extensions/url.extension';
import { AutocompleteItem } from '../../native-components/autocomplete-input/autocomplete-input';
import { SideScroller } from '../../native-components/side-scroller/side-scroller';
import { FoodModel } from '../../obscuritas-media-manager-backend-client';
import { RecipeService } from '../../services/backend.services';
import { RecipesPage } from '../recipes-page/recipes-page';
import { renderImportFoodPageStyles } from './import-food-page.css';

const CacheName = 'food-cache' as const;
let Cache = await caches.open(CacheName);
const MetadataCacheKey = (i: number) => `ImportFood.item.${i}`;
const ImageCacheKey = (i: number) => `https://localhost/food-item/${i}`;

@customElement('import-food-page')
export class ImportFoodPage extends LitElementBase {
    static isPage = true as const;
    static caching = new Observable<boolean>(true);
    static cacheAbertController? = new AbortController();

    static async cacheMetadata(index: number, dish: FoodModel) {
        localStorage.setItem(MetadataCacheKey(index), JSON.stringify(Object.assign({}, dish, { imageData: null })));
    }

    static async cacheFilesParallel(files: FileList) {
        if (this.cacheAbertController) this.cacheAbertController.abort();
        this.cacheAbertController = new AbortController();

        window.onbeforeunload = (e) => {
            if (ImportFoodPage.caching) e.preventDefault();
        };
        window.onpopstate = (e) => {
            e.stopImmediatePropagation();
            console.log('pop');
            alert('Einige Bilder sind noch nicht hochgeladen, wenn du die Seite jetzt verlässt, gehen einige Bilder verloren!');
        };

        if (files.length) await this.clearCache();

        var first10 = files.toIterator().take(10);
        var next = files.toIterator().drop(10);

        this.caching.next(true);
        await this.cacheFiles(first10.take(10), this.cacheAbertController.signal);
        this.cacheFiles(next, this.cacheAbertController.signal).then(() => {
            this.caching.next(false);
            window.onbeforeunload = null;
            window.onpopstate = null;
        });
    }

    private static async clearCache() {
        var allDeletions = (await Cache.keys()).map(async (key) => await Cache.delete(key));

        for (let i = 0; i < localStorage.length; i++)
            if (localStorage.key(i)!.startsWith('ImportFood.item')) localStorage.removeItem(localStorage.key(i)!);

        await Promise.all(allDeletions);
    }

    private static async cacheFiles(
        files: IteratorObject<File, undefined> | IteratorObject<Response, undefined>,
        signal: AbortSignal
    ) {
        let i = 0;
        while (!signal.aborted) {
            var result = files.next();
            console.log(result.done);
            if (result.done) break;
            const file = result.value;
            await Cache.put(ImageCacheKey(i), file instanceof Response ? file : new Response(file));
            i++;
        }
    }

    static override get styles() {
        return renderImportFoodPageStyles();
    }

    @query('side-scroller') protected declare sideScroller: SideScroller;
    @query('#current-image') protected declare currentImageElement?: HTMLImageElement;

    protected paginatedFiles: string[] = [];
    @state() protected declare currentImage: FoodModel;

    private lastCachedIndex = 0;

    get currentAspectRatio() {
        if (!this.currentImageElement) return 1;
        return this.currentImageElement.naturalWidth / this.currentImageElement.naturalHeight;
    }

    constructor() {
        super();
        this.currentImage = new FoodModel({ tags: [] });
    }

    override render() {}

    async connectedCallback() {
        await super.connectedCallback();

        dimLight();
        this.tabIndex = 0;
        this.focus();
        document.title = 'Gerichte importieren';

        document.addEventListener('keyup', this.handleKeyUp.bind(this));
        this.subscriptions.push(ImportFoodPage.caching.subscribe(() => this.requestFullUpdate()));

        var fromQuery = Number.parseInt(getQueryValue('index') ?? '0');
        await this.requestFullUpdate();
        await this.updated;
        await waitForAnimation();

        let itemsToGet = 10;
        while (itemsToGet <= fromQuery) itemsToGet += 10;
        await this.loadMoreImages(itemsToGet);
        if (fromQuery) this.sideScroller.setIndex(fromQuery);
    }

    async loadMoreImages(itemsToGet?: number) {
        const currentLength = this.paginatedFiles.length;
        while (itemsToGet && this.sideScroller.currentItemIndex > currentLength + itemsToGet) itemsToGet += 10;
        itemsToGet ??= Number.POSITIVE_INFINITY;

        do var cacheSize = (await Cache.keys()).length;
        while (ImportFoodPage.caching.current() && cacheSize < itemsToGet);

        if (cacheSize <= this.paginatedFiles.length) return;
        if (!cacheSize) throw new Error('no items to import!');

        if (itemsToGet > cacheSize - this.paginatedFiles.length) itemsToGet = cacheSize - this.paginatedFiles.length;

        for (var i = 0, success = 0; success < itemsToGet; i++) {
            var fromCache = await Cache.match(ImageCacheKey(this.lastCachedIndex + i));
            if (!fromCache) continue;
            this.paginatedFiles.push(URL.createObjectURL(await fromCache.blob()));
            success++;
        }
        this.lastCachedIndex += i; // already +1 due to final iteration of for

        await this.requestFullUpdate();
        this.changeCurrentImage();
    }

    async changeCurrentImage() {
        this.currentImage = await this.loadImageData(this.sideScroller.currentItemIndex, 'url');
        this.requestFullUpdate();

        changePage(ImportFoodPage, { index: this.sideScroller.currentItemIndex } as any, false);
    }

    async searchDishes(search: string) {
        var localNames: (string | undefined)[] = [];
        for (let i = 0; i < localStorage.length; i++) {
            var key = localStorage.key(i)!;
            if (key.startsWith('ImportFood.item') && key != MetadataCacheKey(this.sideScroller.currentItemIndex))
                localNames.push((JSON.parse(localStorage.getItem(key)!) as FoodModel).title);
        }

        return localNames
            .filter((x) => x?.length && x.toLowerCase().includes(search.toLowerCase()))
            .concat(await RecipeService.searchDishes(search))
            .sort()
            .map((name) => ({ id: name, text: name } as AutocompleteItem));
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
            await this.removeImageAt(this.sideScroller.currentItemIndex);
        }
        if (event.key == 'ArrowLeft') this.sideScroller.setIndex(this.sideScroller.currentItemIndex - 1);
        if (event.key == 'ArrowRight') this.sideScroller.setIndex(this.sideScroller.currentItemIndex + 1);
    }

    async removeImageAt(index: number) {
        this.paginatedFiles = this.paginatedFiles.filter((_, i) => i != index);
        await Cache.delete((await Cache.keys()).at(index)!);
        localStorage.removeItem(MetadataCacheKey(index));

        if (index == this.sideScroller.currentItemIndex) await this.changeCurrentImage();
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

        var cacheSize = (await Cache.keys()).length;
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
        var withMetadata = this.paginatedFiles.map((_, i) => this.loadImageData(i, 'data'));

        var dupes = [];
        for (let dish of await Promise.all(withMetadata)) {
            var response = dish.imageData;
            try {
                dish.imageData = await (dish.imageData as any as Response).clone().base64();
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
            } finally {
                dish.imageData = response as any as Response as any;
            }
        }

        await ImportFoodPage.clearCache();

        if (dupes.length > 0) {
            ImportFoodPage.cacheAbertController = new AbortController();
            await ImportFoodPage.cacheFiles(
                dupes.map((dish) => dish.imageData as any as Response).values(),
                ImportFoodPage.cacheAbertController?.signal
            );
            for (let i = 0; i < dupes.length; i++) await ImportFoodPage.cacheMetadata(i, dupes[i]);
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

    private async loadImageData(index: number, imageMode: 'url' | 'data') {
        var imageUrl = this.paginatedFiles[index];
        var metadata = localStorage.getItem(MetadataCacheKey(index));
        var withMetadata =
            FoodModel.fromJS(JSON.parse(metadata!)) ??
            new FoodModel({ deleted: false, difficulty: 0, rating: 0, tags: [], description: '', title: '' });
        if (imageMode == 'url') withMetadata.imageData = imageUrl;
        else withMetadata.imageData = (await Cache.match(ImageCacheKey(index)))!.clone() as any;
        return withMetadata;
    }

    disconnectedCallback(): void {
        super.disconnectedCallback();
        undimLight();
        document.removeEventListener('keyup', this.handleKeyUp);
    }
}
