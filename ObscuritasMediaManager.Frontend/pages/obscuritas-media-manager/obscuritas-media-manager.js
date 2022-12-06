import { html, LitElement } from '../../exports.js';
import { renderObscuritasMediaManagerStyles } from './obscuritas-media-manager.css.js';
import { renderObscuritasMediaManager } from './obscuritas-media-manager.html.js';

export class ObscuritasMediaManager extends LitElement {
    static imagePrefix = './resources/images/';

    static get resourceList() {
        return [
            'background.jpg',
            'games.png',
            'ger-dub.png',
            'ger-dub2.png',
            'ger-sub.png',
            'ger-sub2.png',
            'ger-sub3.png',
            'ger-sub4.png',
            'j-drama.png',
            'music.png',
            'real-movies.png',
            'real-series.png',
            'totoro.png',
        ];
    }

    static get styles() {
        return renderObscuritasMediaManagerStyles();
    }

    static get properties() {
        return {
            loadedResourceIndex: { type: Number, reflect: false },
        };
    }

    get currentResources() {
        return ObscuritasMediaManager.resourceList
            .slice(0, this.loadedResourceIndex + 1)
            .map((resName) => ObscuritasMediaManager.imagePrefix + resName);
    }

    constructor() {
        super();

        this.initialized = false;
        this.loadedResourceIndex = 0;
    }

    render() {
        if (this.loadedResourceIndex < ObscuritasMediaManager.resourceList.length)
            return this.currentResources.map(
                (resUrl) => html`<img invisible src="${resUrl}" @load="${() => this.loadedResourceIndex++}" />`
            );

        this.initialized = true;
        return renderObscuritasMediaManager(this);
    }
}
