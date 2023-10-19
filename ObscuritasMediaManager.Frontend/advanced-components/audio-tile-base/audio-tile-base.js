import { LitElementBase } from '../../data/lit-element-base.js';
import { Session } from '../../data/session.js';
import { MusicModel } from '../../obscuritas-media-manager-backend-client.js';
import { renderAudioTileBaseStyles } from './audio-tile-base.css.js';
import { renderAudioTileBase } from './audio-tile-base.html.js';

export class AudioTileBase extends LitElementBase {
    static get styles() {
        return renderAudioTileBaseStyles();
    }

    static get properties() {
        return {
            track: { type: Object, reflect: true },
            visualizationData: { type: Object, reflect: true },
            hoveredRating: { type: Number, reflect: true },
            paused: { type: Boolean, reflect: true },
            disabled: { type: Boolean, reflect: true },
        };
    }

    constructor() {
        super();

        /** @type {boolean} */ this.disabled = false;
        /** @type {MusicModel} */ this.track = new MusicModel();
        /** @type {Float32Array} */ this.visualizationData = new Float32Array();
        /** @type {Number} */ this.hoveredRating = 0;

        /** @type {HTMLCanvasElement} */ this.canvas = null;
        /** @type {CanvasRenderingContext2D} */ this.canvasContext = null;

        Session.instruments.subscribe(() => this.requestFullUpdate());
    }

    updated(_changedProperties) {
        super.updated(_changedProperties);
        this.updateVisualization();
    }

    render() {
        return renderAudioTileBase(this);
    }

    updateVisualization() {
        this.canvas ??= this.shadowRoot.querySelector('canvas');
        this.canvasContext ??= this.canvas.getContext('2d');

        this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);

        if (!this.visualizationData) return;

        // Zeichnen Sie die Audiodaten
        this.canvasContext.lineWidth = 2;
        this.canvasContext.strokeStyle = 'white';
        this.canvasContext.beginPath();

        const sliceWidth = (this.canvas.width - 40.0) / this.visualizationData.length;
        let x = 20;
        this.canvasContext.moveTo(0, this.canvas.height / 2);
        this.canvasContext.lineTo(x, this.canvas.height / 2);

        for (let i = 0; i < this.visualizationData.length; i++) {
            const y = this.canvas.height / 2 + this.visualizationData[i] * this.canvas.height;
            this.canvasContext.lineTo(x, y);
            x += sliceWidth;
        }
        this.canvasContext.lineTo(this.canvas.width - 20, this.canvas.height / 2);
        this.canvasContext.lineTo(this.canvas.width, this.canvas.height / 2);
        this.canvasContext.stroke();
    }
}
