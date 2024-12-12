/** @param {HTMLAudioElement} audioElement */
export function playAudio(audioElement) {
    return new Promise(async (resolve) => {
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
