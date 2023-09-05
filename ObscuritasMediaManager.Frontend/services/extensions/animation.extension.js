export function waitForSeconds(seconds) {
    return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

export function waitForAnimation() {
    return new Promise(requestAnimationFrame);
}
