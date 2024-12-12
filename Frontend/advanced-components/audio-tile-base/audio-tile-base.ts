import { customElement, property } from 'lit-element/decorators.js';
import { LitElementBase } from '../../data/lit-element-base';
import { Session } from '../../data/session';
import { MusicModel } from '../../obscuritas-media-manager-backend-client';
import { AudioService } from '../../services/audio-service';
import { renderAudioTileBaseStyles } from './audio-tile-base.css';
import { renderAudioTileBase } from './audio-tile-base.html';

@customElement('audio-tile-base')
export class AudioTileBase extends LitElementBase {
    static override get styles() {
        return renderAudioTileBaseStyles();
    }

    @property({ type: Boolean }) protected disabled = false;
    @property({ type: Boolean }) protected paused = false;
    @property({ type: Object }) protected track = new MusicModel();
    @property({ type: Number }) protected hoveredRating = 0;

    protected animating = false;
    protected canvas: HTMLCanvasElement | null = null;
    protected canvasContext: CanvasRenderingContext2D | null = null;

    constructor() {
        super();

        this.subscriptions.push(
            Session.instruments.subscribe(() => this.requestFullUpdate()),
            AudioService.visualizationData.subscribe(async () => {
                if (this.paused || AudioService.paused) return;
                await this.updateVisualization();
            })
        );
    }

    override render() {
        return renderAudioTileBase.call(this);
    }

    async updateVisualization() {
        if (this.animating) return;
        this.animating = true;
        this.canvas ??= this.shadowRoot!.querySelector('canvas')!;
        this.canvasContext ??= this.canvas.getContext('2d')!;

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
