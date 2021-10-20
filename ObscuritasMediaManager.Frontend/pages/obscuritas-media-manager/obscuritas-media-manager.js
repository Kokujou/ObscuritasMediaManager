import { session } from '../../data/session.js';
import { html, LitElement } from '../../exports.js';
import { MediaService } from '../../services/media.service.js';
import { MusicService } from '../../services/music.service.js';
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

        this.loadedResourceIndex = 0;
        this.loadResources();
    }

    async loadResources() {
        this.initialized = false;

        try {
            session.mediaList.next(await MediaService.getAllMedia());
        } catch (err) {
            console.error(err);
        }
        try {
            session.instruments.next(await MusicService.getInstruments());
        } catch (err) {
            console.error(err);
        }

        this.initialized = true;
        this.requestUpdate(undefined);
    }

    render() {
        if (this.loadedResourceIndex >= ObscuritasMediaManager.resourceList.length) return renderObscuritasMediaManager(this);
        else
            return this.currentResources.map(
                (resUrl) => html`<img invisible src="${resUrl}" @load="${() => this.loadedResourceIndex++}" />`
            );
    }
}
