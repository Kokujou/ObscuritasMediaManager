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
    scrollContainer.scrollTo({top: child.offsetTop + child.offsetHeight - scrollContainer.offsetHeight});
}

/**
 * @param {HTMLElement} scrollContainer
 * @param {number} scrollTopThreshold
 */
function isScrolledToBottom(scrollContainer, scrollTopThreshold) {
    var scrollMax = scrollContainer.scrollHeight - scrollContainer.offsetHeight;
    if (scrollContainer.scrollHeight <= scrollContainer.clientHeight) return true;
    if (scrollContainer.scrollTop >= scrollMax - scrollTopThreshold) return true;
    return false;
}