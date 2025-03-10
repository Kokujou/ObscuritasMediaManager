export class AudioVisualizationService {
    static getAnalyzerFromAudio(mediaElement: HTMLMediaElement) {
        if (!mediaElement) return null;

        var audioContext = new AudioContext();

        var analyzer = audioContext.createAnalyser();
        var source = audioContext.createMediaElementSource(mediaElement);

        source.connect(analyzer).connect(audioContext.destination);
        analyzer.fftSize = 2048;
        return analyzer;
    }
}
