import { html } from 'lit-element';
import { customElement, state } from 'lit-element/decorators.js';
import { LitElementBase } from '../../data/lit-element-base';
import { LinkElement } from '../../native-components/link-element/link-element';
import { renderObscuritasMediaManager } from './obscuritas-media-manager.html';
LinkElement;

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

    get currentResources() {
        return ObscuritasMediaManager.resourceList
            .slice(0, this.loadedResourceIndex + 1)
            .map((resName) => ObscuritasMediaManager.imagePrefix + resName);
    }

    @state() protected declare initialized: boolean;
    @state() protected declare loadedResourceIndex: number;

    override render() {
        if (this.loadedResourceIndex < ObscuritasMediaManager.resourceList.length)
            return this.currentResources.map(
                (resUrl) => html`<img invisible src="${resUrl}" @load="${() => this.loadedResourceIndex++}" />`
            );

        this.initialized = true;
        return renderObscuritasMediaManager.call(this);
    }
}
