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
