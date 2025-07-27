import { customElement, state } from 'lit-element/decorators';
import { LitElementBase } from '../../data/lit-element-base';
import { newGuid } from '../../extensions/crypto.extensions';
import { renderImportFoodPageStyles } from './import-food-page.css';

const CacheName = 'food-cache';
const cache = await caches.open(CacheName);

@customElement('import-food-page')
export class ImportFoodPage extends LitElementBase {
    static isPage = true as const;

    static async cacheFiles(files: FileList) {
        if (files.length) for (var item of await cache.keys()) await cache.delete(item);
        for (var file of files ?? []) await cache.put(newGuid(), new Response(file));
    }

    static override get styles() {
        return renderImportFoodPageStyles();
    }

    files: any[] = [];
    @state() public declare currentIndex: number;

    get currentImage() {
        if (!this.files.length) return null;
        return this.files[this.currentIndex];
    }

    constructor() {
        super();
        this.currentIndex = 0;
    }

    override render() {}

    async connectedCallback() {
        await super.connectedCallback();

        if (!(await cache.keys()).length) throw new Error('no items to import!');

        const keys = await cache.keys();
        for (var key of keys) this.files.push(URL.createObjectURL(await (await cache.match(key))?.blob()!));

        await this.requestFullUpdate();
    }
}
