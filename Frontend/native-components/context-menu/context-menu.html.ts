import { html } from 'lit';
import { renderBackgroundImage } from '../../extensions/style.extensions';
import { ContextMenu } from './context-menu';

export function renderContextMenu(contextMenu: ContextMenu) {
    return contextMenu.items.map(
        (item) => html`<div class="item-wrapper" @click="${() => contextMenu.triggerAction(item)}">
            ${item.icon
                ? html` <div class="item-icon" icon="${item.icon}"></div> `
                : html` <div class="item-icon" style="${renderBackgroundImage(item.image!)} "></div> `}
            <div class="item-text">${item.text}</div>
        </div>`
    );
}
