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

export function setFavicon(icon) {
    /** @type {HTMLLinkElement} */ var link = document.querySelector("link[rel~='icon']");
    if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.getElementsByTagName('head')[0].appendChild(link);
    }

    if (!icon) link.href = 'data:image/svg+xml;base64, R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
    else link.href = `data:image/svg+xml;base64, ${btoa(icon)}`;
}
