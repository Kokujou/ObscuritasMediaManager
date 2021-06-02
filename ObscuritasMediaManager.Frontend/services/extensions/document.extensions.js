export function getScaleFactorX() {
    return (outerWidth - 20) / viewportWidth;
}
export function getScaleFactorY() {
    return (outerHeight - 140) / viewportHeight;
}

export const viewportWidth = 1920;
export const viewportHeight = 900;

/**
 * @param {HTMLElement} element
 * @param {HTMLElement} parent
 */
export function scrollIntoParentView(element, parent) {
    console.log(element);
    var targetLeft = element.offsetLeft - parent.offsetWidth / 2;
    var targetTop = element.offsetTop - parent.offsetHeight / 2 + element.offsetHeight / 2;
    parent.scrollTo({ left: targetLeft, top: targetTop, behavior: 'smooth' });
}
