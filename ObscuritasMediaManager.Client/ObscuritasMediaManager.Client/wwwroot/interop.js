/**
 * 
 * @param {HTMLElement} element
 */
function getElementHeight(element) {
    if (!element instanceof HTMLElement) return;
    return element.getBoundingClientRect().height;
}