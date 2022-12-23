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

const focusableElements = ['a', 'input', 'button'];

/**
 * @param {Element} currentElement
 */
export function getNextFocusableElement(currentElement) {
    var allElements = getAllElementsRecurse(document.body);
    var elementChildren = [
        ...(currentElement.querySelectorAll('*') ?? []),
        ...(currentElement.shadowRoot.querySelectorAll('*') ?? []),
    ];
    var nextElements = allElements
        .slice(allElements.indexOf(/** @type {HTMLElement} */ (currentElement)) + 1)
        .filter((x) => !elementChildren.includes(x));
    return nextElements.find((x) => focusableElements.includes(x.tagName) || x.hasAttribute('tabindex'));
}

/**
 * @param {HTMLElement} start
 * @param {HTMLElement[]} array
 */
export function getAllElementsRecurse(start, array = []) {
    array.push(start);
    var children = [...(start.children ?? []), ...(start.shadowRoot?.children ?? [])];
    for (var child of children) getAllElementsRecurse(/** @type {HTMLElement} */ (child), array);
    return array;
}
