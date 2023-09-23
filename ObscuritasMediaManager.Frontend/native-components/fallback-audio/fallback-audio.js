import { MusicModel } from '../../obscuritas-media-manager-backend-client.js';
import { AudioVisualizationService } from '../../services/audio-visualization.service.js';

export class FallbackAudio extends Audio {
    get visualizationData() {
        if (this.paused) return null;

        var dataArray = new Float32Array(this.audioAnalyzer.frequencyBinCount);
        this.audioAnalyzer.getFloatTimeDomainData(dataArray);

        if (this.volume <= 0) return [];

        for (var i = 0; i < dataArray.length; i++) dataArray[i] *= 0.5 / this.volume;
        return dataArray;
    }

    constructor() {
        super();

        /** @type {string} */ this.fallbackSource;
        this.audioAnalyzer = AudioVisualizationService.getAnalyzerFromAudio(this);
        super.controls = true;
        super.preload = 'auto';
        super.onerror = this.initiateFallback;
    }

    /**
     * @param {MusicModel} track
     */
    changeTrack(track) {
        var newSource = `/ObscuritasMediaManager/api/file/audio?audioPath=${encodeURIComponent(track.path)}`;
        this.src = newSource;
        this.fallbackSource = newSource + '&highCompatibility=true';
    }

    /**
     * @param {ErrorEvent} event
     */
    async initiateFallback(event) {
        console.error(event.error);
        console.error(`an error occured while playing the audio file: 
        code: ${this.error.code}
        message: ${this.error.message}`);

        if (!this.fallbackSource || super.src == this.fallbackSource) return;

        this.src = this.fallbackSource;
        await this.play();
    }

    reset() {
        this.pause();
        this.currentTime = 0;
    }
}
