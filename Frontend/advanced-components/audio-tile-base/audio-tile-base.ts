import { customElement, property, state } from 'lit-element/decorators.js';
import { LitElementBase } from '../../data/lit-element-base';
import { Observable } from '../../data/observable';
import { Session } from '../../data/session';
import { MusicModel } from '../../obscuritas-media-manager-backend-client';
import { renderAudioTileBaseStyles } from './audio-tile-base.css';
import { renderAudioTileBase } from './audio-tile-base.html';

@customElement('audio-tile-base')
export class AudioTileBase extends LitElementBase {
    static override get styles() {
        return renderAudioTileBaseStyles();
    }

    @property({ type: Boolean, reflect: true }) public declare disabled: boolean;
    @property({ type: Boolean, reflect: true }) public declare paused: boolean;
    @property({ type: Object }) public declare track: MusicModel;
    @property({ type: Object }) public declare visualizationData?: Observable<Float32Array<ArrayBuffer>>;

    @state() protected declare hoveredRating: number;

    protected animating = false;
    protected canvas: HTMLCanvasElement | null = null;
    protected canvasContext: CanvasRenderingContext2D | null = null;

    constructor() {
        super();
        this.track = new MusicModel();
        this.subscriptions.push(Session.instruments.subscribe(() => this.requestFullUpdate()));
    }

    connectedCallback(): void {
        super.connectedCallback();

        if (this.visualizationData)
            this.subscriptions.push(
                this.visualizationData.subscribe(async () => {
                    if (this.paused) return;
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

        const currentData = this.visualizationData?.current();
        if (!currentData) return;

        // Zeichnen Sie die Audiodaten
        this.canvasContext.lineWidth = 2;
        this.canvasContext.strokeStyle = 'white';
        this.canvasContext.beginPath();

        const sliceWidth = Math.floor(this.canvas.width - 40.0) / currentData.length;
        let x = 20;
        this.canvasContext.moveTo(0, startHeight);
        this.canvasContext.lineTo(x, startHeight);

        for (let i = 0; i < currentData.length; i++) {
            let y = startHeight + currentData[i] * startHeight;
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
