import { unsafeCSS } from '../../exports.js';

export function renderMaskImage(image) {
    return unsafeCSS(`
            mask: url('data:image/svg+xml;base64, ${btoa(image)}') no-repeat center center / 100% 100%;
            -webkit-mask: url('data:image/svg+xml;base64, ${btoa(image)}') no-repeat center center / 100% 100%;
    `);
}

export function renderBackgroundImage(image) {
    return unsafeCSS(`
    background: url('data:image/svg+xml;base64, ${btoa(image)}') no-repeat center center / 100% 100%;
`);
}

/**
 * @param {string} icon
 * @param {'icon' | 'image' | 'url'} mode
 */
export function setFavicon(icon, mode = 'icon') {
    /** @type {HTMLLinkElement} */ var link = document.querySelector("link[rel~='icon']");

    if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
    }

    link.href = 'data:image/svg+xml;base64, R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
    if (!icon) return;

    switch (mode) {
        case 'icon':
            return (link.href = `data:image/svg+xml;base64, ${btoa(icon)}`);
        case 'image':
            return (link.href = `data:image/png;baes64, ${icon}`);
        case 'url':
            return (link.href = icon);
        default:
            throw new Error('no mode specified for setting favicon');
    }
}
