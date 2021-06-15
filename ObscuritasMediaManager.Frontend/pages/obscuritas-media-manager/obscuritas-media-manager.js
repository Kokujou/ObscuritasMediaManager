import { session } from '../../data/session.js';
import { LitElement } from '../../exports.js';
import { MediaService } from '../../services/media.service.js';
import { MusicService } from '../../services/music.service.js';
import { renderObscuritasMediaManagerStyles } from './obscuritas-media-manager.css.js';
import { renderObscuritasMediaManager } from './obscuritas-media-manager.html.js';

export class ObscuritasMediaManager extends LitElement {
    static get styles() {
        return renderObscuritasMediaManagerStyles();
    }

    static get properties() {
        return {};
    }

    constructor() {
        super();
        this.initialized = false;

        this.loadResources().then(() => {
            this.initialized = true;
            this.requestUpdate(undefined);
        });
    }

    async loadResources() {
        session.mediaList.next(await MediaService.getAllMedia());
        session.instruments.next(await MusicService.getInstruments());
    }

    render() {
        return renderObscuritasMediaManager(this);
    }
}
