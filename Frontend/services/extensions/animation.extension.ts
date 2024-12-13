export function waitForSeconds(seconds: number) {
    return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

export function waitForAnimation() {
    return new Promise(requestAnimationFrame);
}

export function setAbortableInterval(duration: number, action: () => void, signal: AbortSignal) {
    let interval = setInterval(action, duration);
    signal.onabort = () => clearInterval(interval);
}
