import { unsafeCSS } from 'lit-element';

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
export function setFavicon(icon: string, mode: 'icon' | 'image' | 'url' = 'icon') {
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

export function rgbHexToHsv(color) {
    // Remove # from the color code
    const hex = color.slice(1);

    // Convert hex to RGB
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;

    var max = Math.max(r, g, b),
        min = Math.min(r, g, b);
    var h,
        s,
        v = max;

    var d = max - min;
    s = max == 0 ? 0 : d / max;

    if (max == min) {
        h = 0; // achromatic
    } else {
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }

        h /= 6;
    }
    h ??= 0;
    s ??= 0;
    v ??= 0;

    return { h, s, v };
}
