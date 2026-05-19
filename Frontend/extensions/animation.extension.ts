export function waitForSeconds(seconds: number, signal?: AbortSignal) {
    return new Promise((resolve) => {
        let timeout = setTimeout(resolve, seconds * 1000, { signal });
        signal?.addEventListener('abort', () => clearTimeout(timeout));
    });
}

export function waitForAnimation() {
    return new Promise(requestAnimationFrame);
}

export function setAbortableInterval(duration: number, action: () => void, signal: AbortSignal) {
    let interval = setInterval(action, duration);
    signal.onabort = () => clearInterval(interval);
}

export function waitForProperty<T extends object>(object: T, property: keyof T, maxSeconds = 1): Promise<void> {
    return new Promise(async (resolve, reject) => {
        let timeout = false;
        var waitPromise = waitForSeconds(maxSeconds).then(() => (timeout = true));
        while (!object[property] && !timeout) {
            await Promise.resolve();
        }

        if (timeout) reject();
        else resolve();
    });
}
