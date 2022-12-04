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
 * @param {HTMLElement} elementContainer
 */
export function scrollIntoParentViewX(element, elementContainer, parent) {
    var targetLeft = element.offsetLeft + elementContainer.offsetLeft - parent.offsetWidth / 2 - element.offsetWidth / 2;
    elementContainer.style.transform = `translateX(${-targetLeft}px)`;
}

/**
 * @param {HTMLElement} element
 * @param {HTMLElement} parent
 * @param {HTMLElement} elementContainer
 */
export function scrollIntoParentViewY(element, elementContainer, parent, max = null, min = null) {
    var targetTop = element.offsetTop + elementContainer.offsetTop - parent.offsetHeight / 2 + element.offsetHeight / 2;
    elementContainer.style.transform = `translateY(${-targetTop}px)`;
}

/**
 * @param {HTMLElement} element
 * @param {HTMLElement} parent
 * @param {HTMLElement} elementContainer
 */
export function getTargetScrollPosition(element, elementContainer, parent) {
    var targetLeft = element.offsetLeft + elementContainer.offsetLeft - parent.offsetWidth / 2 - element.offsetWidth / 2;
    var targetTop = element.offsetTop + elementContainer.offsetTop - parent.offsetHeight / 2 + element.offsetHeight / 2;
    return { left: -targetLeft, top: -targetTop };
}

/**
 * @param {boolean} selectFolders
 * @returns {Promise<FileList>}
 */
export function openFileDialog(selectFolders = false) {
    return new Promise((resolve) => {
        /** @type {HTMLInputElement} */ var fileInput = document.createElement('input');
        fileInput.type = 'file';
        if (selectFolders) fileInput.setAttribute('webkitdirectory', '');
        fileInput.onchange = (e) => {
            resolve(fileInput.files);
        };
        fileInput.click();
        fileInput.focus();
    });
}
