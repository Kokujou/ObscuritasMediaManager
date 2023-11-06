import { html } from '../../exports.js';
import { ContextMenu } from './context-menu.js';

/**
 * @param { ContextMenu } contextMenu
 */
export function renderContextMenu(contextMenu) {
    return contextMenu.items.map(
        (item) => html`<div class="item-wrapper" @click="${() => contextMenu.triggerAction(item)}">
            <div class="item-icon" icon="${item.icon}"></div>
            <div class="item-text">${item.text}</div>
        </div>`
    );
}
