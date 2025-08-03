import { customElement, query, state } from 'lit-element/decorators';
import { LitElementBase } from '../../data/lit-element-base';
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
    static caching = false;

    static async cacheMetadata(index: number, dish: FoodModel) {
        localStorage.setItem(MetadataCacheKey(index), JSON.stringify(Object.assign({}, dish, { imageData: null })));
    }

    static async cacheFilesParallel(files: FileList) {
        if (files.length) await this.clearCache();
        await this.cacheFiles(files);
    }

    private static async clearCache() {
        for (var request of await Cache.keys()) await Cache.delete(request);

        for (let i = 0; i < localStorage.length; i++)
            if (localStorage.key(i)!.startsWith('ImportFood.item')) localStorage.removeItem(localStorage.key(i)!);
    }

    private static async cacheFiles(files: FileList | Response[]) {
        this.caching = true;
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            await Cache.put(ImageCacheKey(i), file instanceof Response ? file : new Response(file));
        }
        this.caching = false;
    }

    static override get styles() {
        return renderImportFoodPageStyles();
    }

    @query('side-scroller') protected declare sideScroller: SideScroller;

    protected paginatedFiles: string[] = [];
    @state() protected declare currentImage: FoodModel;

    private lastCachedIndex = 0;

    constructor() {
        super();
        this.currentImage = new FoodModel({ tags: [] });
    }

    override render() {}

    async connectedCallback() {
        await super.connectedCallback();
        dimLight();
        document.title = 'Gerichte importieren';

        var fromQuery = getQueryValue('index');
        await this.requestFullUpdate();
        await this.updated;
        await waitForAnimation();
        await this.loadMoreImages(10);
        if (fromQuery) this.sideScroller.setIndex(Number.parseInt(fromQuery));
    }

    async loadMoreImages(itemsToGet?: number) {
        const currentLength = this.paginatedFiles.length;
        while (itemsToGet && this.sideScroller.currentItemIndex > currentLength + itemsToGet) itemsToGet += 10;
        itemsToGet ??= Number.POSITIVE_INFINITY;

        do var cacheSize = (await Cache.keys()).length;
        while (ImportFoodPage.caching && cacheSize < itemsToGet);

        if (cacheSize <= this.paginatedFiles.length) return;
        if (!cacheSize) throw new Error('no items to import!');

        if (itemsToGet > cacheSize - this.paginatedFiles.length) itemsToGet = cacheSize - this.paginatedFiles.length;

        for (var i = 0, success = 0; success < itemsToGet; i++) {
            var fromCache = await Cache.match(ImageCacheKey(this.lastCachedIndex + i));
            if (!fromCache) continue;
            this.paginatedFiles.push(URL.createObjectURL(await fromCache.blob()));
            success++;
        }
        this.lastCachedIndex = i; // already +1 due to final iteration of for

        await this.requestFullUpdate();
        this.changeCurrentImage();
    }

    async changeCurrentImage() {
        this.currentImage = await this.loadImageData(this.sideScroller.currentItemIndex, 'url');
        this.requestFullUpdate();

        changePage(ImportFoodPage, { index: this.sideScroller.currentItemIndex }, false);
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

    async removeImageAt(index: number) {
        this.paginatedFiles = this.paginatedFiles.filter((_, i) => i != index);
        await Cache.delete((await Cache.keys()).at(index)!);
        localStorage.removeItem(MetadataCacheKey(index));

        if (index == this.sideScroller.currentItemIndex) await this.changeCurrentImage();
        await this.requestFullUpdate();
    }

    async importFiles() {
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
            await ImportFoodPage.cacheFiles(dupes.map((dish) => dish.imageData as any as Response));
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
    }
}
