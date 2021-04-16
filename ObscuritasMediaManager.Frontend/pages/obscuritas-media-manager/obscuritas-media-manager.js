import { session } from '../../data/session.js';
import { LitElement } from '../../exports.js';
import { MediaService } from '../../services/media.service.js';
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
    }

    render() {
        return renderObscuritasMediaManager(this);
    }
}
