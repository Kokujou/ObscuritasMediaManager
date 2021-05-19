import { unsafeCSS } from '../../exports.js';

export function renderMaskImage(image) {
    return unsafeCSS(`
            mask: url('data:image/svg+xml;base64, ${btoa(image)}') no-repeat center center / 100% 100%;
            -webkit-mask: url('data:image/svg+xml;base64, ${btoa(image)}') no-repeat center center / 100% 100%;
    `);
}
