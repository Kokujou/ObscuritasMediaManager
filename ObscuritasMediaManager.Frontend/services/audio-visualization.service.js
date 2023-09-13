export class AudioVisualizationService {
    /**
     * @param {HTMLMediaElement} mediaElement
     */
    static getAnalyzerFromAudio(mediaElement) {
        if (!mediaElement) return null;
        var audioContext = new AudioContext();

        var analyzer = audioContext.createAnalyser();
        var source = audioContext.createMediaElementSource(mediaElement);
        const gainNode = audioContext.createGain();
        gainNode.gain.value = 0.3;

        source.connect(analyzer).connect(gainNode).connect(audioContext.destination);

        analyzer.fftSize = 2048;

        return analyzer;
    }
}
