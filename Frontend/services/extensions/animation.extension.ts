export function waitForSeconds(seconds) {
    return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

export function waitForAnimation() {
    return new Promise(requestAnimationFrame);
}

/**
 * @param {number} duration
 * @param {()=> void} action
 * @param {AbortSignal} signal
 */
export function setAbortableInterval(duration, action, signal) {
    let interval = setInterval(action, duration);
    signal.onabort = () => clearInterval(interval);
}
