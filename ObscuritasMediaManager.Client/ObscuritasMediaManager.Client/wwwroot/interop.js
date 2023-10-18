/**
 * @param {HTMLElement} element
 */
function getElementHeight(element) {
    if (!element instanceof HTMLElement) return;
    return element.getBoundingClientRect().height;
}

/**
 * @param {HTMLElement} element
 */
function getElementRect(element) {
    if (!element instanceof HTMLElement) return null;
    return element.getBoundingClientRect();
}

async function requestAnimationFrameAsync() {
    await new Promise((resolve) => {
        requestAnimationFrame(resolve)
    });
}