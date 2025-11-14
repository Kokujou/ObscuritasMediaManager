import { PageRouting } from '../pages/page-routing/page-routing';

export function scrollIntoParentViewX(element: HTMLElement, elementContainer: HTMLElement, parent: HTMLElement) {
    if (!element || !elementContainer || !parent) return;
    var targetLeft = element.offsetLeft + elementContainer.offsetLeft - parent.offsetWidth / 2 - element.offsetWidth / 2;
    elementContainer.style.transform = `translateX(${-targetLeft}px)`;
}

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

export function getTargetScrollPosition(element: HTMLElement, elementContainer: HTMLElement, parent: HTMLElement) {
    var targetLeft = element.offsetLeft + elementContainer.offsetLeft - parent.offsetWidth / 2 - element.offsetWidth / 2;
    var targetTop = element.offsetTop + elementContainer.offsetTop - parent.offsetHeight / 2 + element.offsetHeight / 2;
    return { left: -targetLeft, top: -targetTop };
}

export function openFileDialog(selectFolders: boolean = false) {
    return new Promise<File[]>((resolve) => {
        var fileInput = document.createElement('input');
        fileInput.type = 'file';
        if (selectFolders) fileInput.setAttribute('webkitdirectory', '');
        fileInput.onchange = () => resolve(Array.from(fileInput.files!));
        fileInput.click();
        fileInput.focus();
    });
}

const focusableElements = ['a', 'input', 'button'];

export function getNextFocusableElement(currentElement: Element) {
    var allElements = getAllElementsRecurse(document.body);
    var elementChildren = [
        ...(currentElement.querySelectorAll('*') ?? []),
        ...(currentElement.shadowRoot!.querySelectorAll('*') ?? []),
    ];
    var nextElements = allElements
        .slice(allElements.indexOf(currentElement as HTMLElement) + 1)
        .filter((x) => !elementChildren.includes(x));
    return nextElements.find((x) => focusableElements.includes(x.tagName) || x.hasAttribute('tabindex'));
}

export function getAllElementsRecurse(start: HTMLElement, array: HTMLElement[] = []) {
    array.push(start);
    var children = [...(start.children ?? []), ...(start.shadowRoot?.children ?? [])];
    for (var child of children) getAllElementsRecurse(child as HTMLElement, array);
    return array;
}

export function cloneElementAsFixed(element: HTMLElement) {
    var clonedElement = element.cloneNode(true) as HTMLElement;
    var elementBoundingRect = element.getBoundingClientRect();

    clonedElement.style.left = elementBoundingRect.left + 'px';
    clonedElement.style.top = elementBoundingRect.top + 5 + 'px';
    clonedElement.style.position = 'fixed';
    clonedElement.style.pointerEvents = 'none';

    return clonedElement;
}

export function findElementIndexMatchingCursorY(cursorY: number, elements: NodeListOf<Element>) {
    for (const [index, element] of elements.entries()) {
        var boundingRect = element.getBoundingClientRect();
        if (index == 0 && cursorY < boundingRect.top) return 0;
        if (cursorY > boundingRect.top && cursorY < boundingRect.bottom) return index;
    }
    return elements.length - 1;
}

export function dimLight() {
    PageRouting.instance.setAttribute('dimmed', '');
}

export function undimLight() {
    PageRouting.instance.removeAttribute('dimmed');
}
