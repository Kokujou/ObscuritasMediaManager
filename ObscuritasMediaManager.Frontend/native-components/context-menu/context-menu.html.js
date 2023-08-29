import { html } from '../../exports.js';
import { renderMaskImage } from '../../services/extensions/style.extensions.js';
import { ContextMenu } from './context-menu.js';

/**
 * @param { ContextMenu } contextMenu
 */
export function renderContextMenu(contextMenu) {
    return contextMenu.items.map(
        (item) => html`<div class="item-wrapper" @click="${() => contextMenu.triggerAction(item)}">
            <div class="item-icon" style=" ${renderMaskImage(item.iconString)}"></div>
            <div class="item-text">${item.text}</div>
        </div>`
    );
}
