export function getScaleFactorX() {
    if (outerWidth - innerWidth > 100) return (outerWidth - 20) / viewportWidth;
    else return (innerWidth - 20) / viewportWidth;
}
export function getScaleFactorY() {
    if (outerHeight - innerHeight > 200) return (outerHeight - 140) / viewportHeight;

    return (innerHeight - 20) / viewportHeight;
}

export const viewportWidth = 1920;
export const viewportHeight = 900;

/**
 * @param {HTMLElement} element
 * @param {HTMLElement} parent
 * @param {HTMLElement} elementContainer
 */
export function scrollIntoParentViewX(element: HTMLElement, elementContainer: HTMLElement, parent: HTMLElement) {
    var targetLeft = element.offsetLeft + elementContainer.offsetLeft - parent.offsetWidth / 2 - element.offsetWidth / 2;
    elementContainer.style.transform = `translateX(${-targetLeft}px)`;
}

/**
 * @param {HTMLElement} element
 * @param {HTMLElement} parent
 * @param {HTMLElement} elementContainer
 */
export function scrollIntoParentViewY(
    element: HTMLElement,
    elementContainer: HTMLElement,
    parent: HTMLElement,
    max = null,
    min = null
) {
    var targetTop = element.offsetTop + elementContainer.offsetTop - parent.offsetHeight / 2 + element.offsetHeight / 2;
    elementContainer.style.transform = `translateY(${-targetTop}px)`;
}

/**
 * @param {HTMLElement} element
 * @param {HTMLElement} parent
 * @param {HTMLElement} elementContainer
 */
export function getTargetScrollPosition(element: HTMLElement, elementContainer: HTMLElement, parent: HTMLElement) {
    var targetLeft = element.offsetLeft + elementContainer.offsetLeft - parent.offsetWidth / 2 - element.offsetWidth / 2;
    var targetTop = element.offsetTop + elementContainer.offsetTop - parent.offsetHeight / 2 + element.offsetHeight / 2;
    return { left: -targetLeft, top: -targetTop };
}

/**
 * @param {boolean} selectFolders
 * @returns {Promise<File[]>}
 */
export function openFileDialog(selectFolders: boolean = false) {
    return new Promise((resolve) => {
        /** @type {HTMLInputElement} */ var fileInput = document.createElement('input');
        fileInput.type = 'file';
        if (selectFolders) fileInput.setAttribute('webkitdirectory', '');
        fileInput.onchange = (e: Event) => {
            resolve(Array.from(fileInput.files));
        };
        fileInput.click();
        fileInput.focus();
    });
}

const focusableElements = ['a', 'input', 'button'];

/**
 * @param {Element} currentElement
 */
export function getNextFocusableElement(currentElement: Element) {
    var allElements = getAllElementsRecurse(document.body);
    var elementChildren = [
        ...(currentElement.querySelectorAll('*') ?? []),
        ...(currentElement.shadowRoot!.querySelectorAll('*') ?? []),
    ];
    var nextElements = allElements
        .slice(allElements.indexOf(/** @type {HTMLElement} */ currentElement) + 1)
        .filter((x) => !elementChildren.includes(x));
    return nextElements.find((x) => focusableElements.includes(x.tagName) || x.hasAttribute('tabindex'));
}

/**
 * @param {HTMLElement} start
 * @param {HTMLElement[]} array
 */
export function getAllElementsRecurse(start: HTMLElement, array: HTMLElement[] = []) {
    array.push(start);
    var children = [...(start.children ?? []), ...(start.shadowRoot?.children ?? [])];
    for (var child of children) getAllElementsRecurse(/** @type {HTMLElement} */ child, array);
    return array;
}

/**
 * @param {HTMLElement} element
 */
export function cloneElementAsFixed(element: HTMLElement) {
    var clonedElement = /** @type {HTMLElement} */ element.cloneNode(true);
    var elementBoundingRect = element.getBoundingClientRect();

    clonedElement.style.left = elementBoundingRect.left + 'px';
    clonedElement.style.top = elementBoundingRect.top + 5 + 'px';
    clonedElement.style.position = 'fixed';
    clonedElement.style.pointerEvents = 'none';

    return clonedElement;
}

/**
 * @param {number} cursorY
 * @param {NodeListOf<Element>} elements
 */
export function findElementIndexMatchingCursorY(cursorY: number, elements: NodeListOf<Element>) {
    for (const [index, element] of elements.entries()) {
        var boundingRect = element.getBoundingClientRect();
        if (index == 0 && cursorY < boundingRect.top) return 0;
        if (cursorY > boundingRect.top && cursorY < boundingRect.bottom) return index;
    }
    return elements.length - 1;
}
