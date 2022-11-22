import { LitElement } from '../../exports.js';
import { renderFallbackAudio } from './fallback-audio.html.js';

export class FallbackAudio extends LitElement {
    static get properties() {
        return {
            volume: { type: Number, reflect: true },
            src: { type: String, reflect: true },
            fallbackSrc: { type: String, reflect: true },
        };
    }

    get currentSrc() {
        if (this.fallback) return this.fallbackSrc;
        return this.src;
    }

    constructor() {
        super();

        /** @type {number} */ this.volume;
        /** @type {boolean} */ this.fallback;
        /** @type {string} */ this.src;
        /** @type {string} */ this.fallbackSrc;
        /** @type {HTMLAudioElement} */ this.audioElement;
    }

    /**
     * @param {Map<keyof FallbackAudio,any>} _changedProperties
     */
    updated(_changedProperties) {
        super.updated(_changedProperties);
        if (_changedProperties.has('src')) {
            this.fallback = false;
            this.requestUpdate(undefined);
        }
    }

    firstUpdated(_changedProperties) {
        super.firstUpdated(_changedProperties);
        if (!this.audioElement) this.audioElement = this.shadowRoot.querySelector('audio');
    }

    render() {
        return renderFallbackAudio(this);
    }

    async initiateFallback() {
        if (this.fallback) return;
        this.fallback = true;
        await this.requestUpdate(undefined);
        await this.audioElement.play();
    }
}
