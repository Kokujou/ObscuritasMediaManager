import { html } from 'lit-element';
import { customElement } from 'lit-element/decorators.js';
import { LitElementBase } from '../../data/lit-element-base';
import { renderObscuritasMediaManager } from './obscuritas-media-manager.html';

import 'lit-element/decorators.js';

@customElement('obscuritas-media-manager')
export class ObscuritasMediaManager extends LitElementBase {
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

    static override get styles() {
        return [];
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

    override render() {
        console.log(this.shadowRoot);
        if (this.loadedResourceIndex < ObscuritasMediaManager.resourceList.length)
            return this.currentResources.map(
                (resUrl) => html`<img invisible src="${resUrl}" @load="${() => this.loadedResourceIndex++}" />`
            );

        this.initialized = true;
        return renderObscuritasMediaManager(this);
    }
}
