/**
 * @param {HTMLElement} child
 */
function scrollToTop(scrollContainer) {
    scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * @param {HTMLElement} scrollContainer
 * @param {HTMLElement} child
 */
function scrollToChild(scrollContainer, child) {
    scrollContainer.scrollTo({ top: child.offsetTop + child.offsetHeight - scrollContainer.offsetHeight });
}

/**
 * @param {HTMLElement} scrollContainer
 * @param {number} scrollTopThreshold
 */
function attachScrollListener(component, scrollContainer, scrollTopThreshold) {
    scrollContainer.onscroll = (e) => {
        var scrollMax = scrollContainer.scrollHeight - scrollContainer.offsetHeight;
        var notScrollable = scrollContainer.scrollHeight <= scrollContainer.clientHeight;
        var scrolledToBottom = scrollContainer.scrollTop >= scrollMax - scrollTopThreshold

        if (notScrollable || scrolledToBottom)
            component.invokeMethodAsync('NotifyScrolledToBottomAsync');

    }
}
