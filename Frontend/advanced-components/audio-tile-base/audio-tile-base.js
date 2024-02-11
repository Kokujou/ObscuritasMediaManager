import { LitElementBase } from '../../data/lit-element-base.js';
import { Session } from '../../data/session.js';
import { MusicModel } from '../../obscuritas-media-manager-backend-client.js';
import { AudioService } from '../../services/audio-service.js';
import { renderAudioTileBaseStyles } from './audio-tile-base.css.js';
import { renderAudioTileBase } from './audio-tile-base.html.js';

export class AudioTileBase extends LitElementBase {
    static get styles() {
        return renderAudioTileBaseStyles();
    }

    static get properties() {
        return {
            track: { type: Object, reflect: true },
            hoveredRating: { type: Number, reflect: true },
            paused: { type: Boolean, reflect: true },
            disabled: { type: Boolean, reflect: true },
        };
    }

    constructor() {
        super();

        /** @type {boolean} */ this.disabled = false;
        /** @type {boolean} */ this.paused = false;
        /** @type {MusicModel} */ this.track = new MusicModel();
        /** @type {Number} */ this.hoveredRating = 0;
        /** @type {boolean} */ this.animating = false;

        /** @type {HTMLCanvasElement} */ this.canvas = null;
        /** @type {CanvasRenderingContext2D} */ this.canvasContext = null;

        this.subscriptions.push(
            Session.instruments.subscribe(() => this.requestFullUpdate()),
            AudioService.visualizationData.subscribe(async () => {
                if (this.paused || AudioService.paused) return;
                await this.updateVisualization();
            })
        );
    }

    render() {
        return renderAudioTileBase(this);
    }

    async updateVisualization() {
        if (this.animating) return;
        this.animating = true;
        this.canvas ??= this.shadowRoot.querySelector('canvas');
        this.canvasContext ??= this.canvas.getContext('2d');

        this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
        const startHeight = Math.floor(this.canvas.height / 2);

        if (!AudioService.visualizationData.current()) return;

        // Zeichnen Sie die Audiodaten
        this.canvasContext.lineWidth = 2;
        this.canvasContext.strokeStyle = 'white';
        this.canvasContext.beginPath();

        const sliceWidth = Math.floor(this.canvas.width - 40.0) / AudioService.visualizationData.current().length;
        let x = 20;
        this.canvasContext.moveTo(0, startHeight);
        this.canvasContext.lineTo(x, startHeight);

        for (let i = 0; i < AudioService.visualizationData.current().length; i++) {
            let y = startHeight + AudioService.visualizationData.current()[i] * startHeight;
            y = Math.floor(y);
            this.canvasContext.lineTo(x, y);
            x += sliceWidth;
        }
        this.canvasContext.lineTo(this.canvas.width - 20, startHeight);
        this.canvasContext.lineTo(this.canvas.width, startHeight);
        this.canvasContext.stroke();
        this.animating = false;
    }
}
