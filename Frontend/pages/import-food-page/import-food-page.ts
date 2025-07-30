import { customElement, query, state } from 'lit-element/decorators';
import { LitElementBase } from '../../data/lit-element-base';
import { dimLight, undimLight } from '../../extensions/document.extensions';
import { changePage, getQueryValue } from '../../extensions/url.extension';
import { AutocompleteItem } from '../../native-components/autocomplete-input/autocomplete-input';
import { SideScroller } from '../../native-components/side-scroller/side-scroller';
import { FoodModel } from '../../obscuritas-media-manager-backend-client';
import { RecipeService } from '../../services/backend.services';
import { renderImportFoodPageStyles } from './import-food-page.css';

const CacheName = 'food-cache' as const;
let Cache = await caches.open(CacheName);
const MetadataCacheKey = (i: number) => `ImportFood.item.${i}`;

@customElement('import-food-page')
export class ImportFoodPage extends LitElementBase {
    static isPage = true as const;
    static caching = false;

    static async cacheFiles(files: FileList) {
        this.caching = true;
        if (files.length) {
            for (var request of await Cache.keys()) await Cache.delete(request);

            for (let i = 0; i < localStorage.length; i++)
                if (localStorage.key(i)!.startsWith('ImportFood.item')) localStorage.removeItem(localStorage.key(i)!);
        }

        for (let i = 0; i < files.length; i++) await Cache.put(i.toString(), new Response(files[i]));
        this.caching = false;
    }

    static override get styles() {
        return renderImportFoodPageStyles();
    }

    @query('side-scroller') protected declare sideScroller: SideScroller;

    protected paginatedFiles: string[] = [];
    @state() protected declare currentImage: FoodModel;
    @state() protected declare pageSize: number;

    constructor() {
        super();
        this.pageSize = 0;
        this.currentImage = new FoodModel();
    }

    override render() {}

    async connectedCallback() {
        await super.connectedCallback();
        dimLight();
        document.title = 'Gerichte importieren';

        var fromQuery = getQueryValue('index');
        await this.loadMoreImages();
        if (fromQuery) this.sideScroller.setIndex(Number.parseInt(fromQuery));
    }

    async loadMoreImages() {
        if (this.pageSize && this.paginatedFiles.length < this.pageSize) return;

        while (ImportFoodPage.caching && (await Cache.keys()).length < 10) await Promise.resolve();
        if (!(await Cache.keys()).length) throw new Error('no items to import!');
        this.pageSize += 10;
        for (var response of (await Cache.matchAll()).slice(this.paginatedFiles.length))
            this.paginatedFiles.push(URL.createObjectURL(await response!.blob()));

        await this.requestFullUpdate();
        this.changeCurrentImage();
    }

    changeCurrentImage() {
        var imageUrl = this.paginatedFiles[this.sideScroller.currentItemIndex];
        var metadata = localStorage.getItem(MetadataCacheKey(this.sideScroller.currentItemIndex));
        this.currentImage = new FoodModel();
        Object.assign(this.currentImage, JSON.parse(metadata!));
        this.currentImage.imageData = imageUrl;
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

    async updateCurrentImage() {
        localStorage.setItem(MetadataCacheKey(this.sideScroller.currentItemIndex), JSON.stringify(this.currentImage));
    }

    async removeImageAt(index: number) {
        this.paginatedFiles = this.paginatedFiles.filter((_, i) => i != index);
        await Cache.delete((await Cache.keys()).at(index) as any);
        localStorage.removeItem(MetadataCacheKey(index));

        await this.requestFullUpdate();
    }

    disconnectedCallback(): void {
        super.disconnectedCallback();
        undimLight();
    }
}
