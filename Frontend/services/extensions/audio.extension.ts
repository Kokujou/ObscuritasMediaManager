export function playAudio(audioElement: HTMLAudioElement) {
    return new Promise<void>(async (resolve) => {
        var controller = new AbortController();

        var playFunction = async () => {
            await audioElement.play();
            controller.abort();
            resolve();
        };

        if (audioElement.currentTime > 0) await playFunction();

        audioElement.addEventListener('canplay', playFunction, { signal: controller.signal });
    });
}
