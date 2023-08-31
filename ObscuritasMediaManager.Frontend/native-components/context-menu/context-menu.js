import { LitElementBase } from '../../data/lit-element-base.js';
import { PageRouting } from '../../pages/page-routing/page-routing.js';
import { getScaleFactorX, getScaleFactorY } from '../../services/extensions/document.extensions.js';
import { renderContextMenuStyles } from './context-menu.css.js';
import { renderContextMenu } from './context-menu.html.js';

export class ContextMenuItem {
    /** @type {string} */ text;
    /** @type {string} */ iconString;
    /** @type {()=>void} */ action;
}

export class ContextMenu extends LitElementBase {
    /** @type {ContextMenu} */ static instance = null;

    static get styles() {
        return renderContextMenuStyles();
    }

    /**
     * @param {ContextMenuItem[]} items
     * @param {PointerEvent | MouseEvent} pointerEvent
     */
    static popup(items, pointerEvent) {
        if (ContextMenu.instance) ContextMenu.instance.remove();
        var menu = new ContextMenu();
        pointerEvent.stopPropagation();
        menu.items = items;
        menu.style.top = pointerEvent.pageY / getScaleFactorY() + 'px';
        menu.style.left = pointerEvent.pageX / getScaleFactorX() + 'px';

        PageRouting.container.append(menu);
        ContextMenu.instance = menu;
        menu.requestUpdate(undefined);
    }

    constructor() {
        super();

        /** @type {ContextMenuItem[]} */ this.items = [];
    }

    connectedCallback() {
        super.connectedCallback();

        document.addEventListener(
            'wheel',
            (e) => {
                e.preventDefault();
                e.stopPropagation();
            },
            { signal: this.abortController.signal, passive: false }
        );

        window.addEventListener('click', (e) => this.remove(), { signal: this.abortController.signal });
        window.addEventListener('contextmenu', (e) => this.remove(), { signal: this.abortController.signal });
    }

    render() {
        return renderContextMenu(this);
    }

    /**
     * @param {ContextMenuItem} item
     */
    triggerAction(item) {
        item.action();
        this.remove();
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        ContextMenu.instance = null;
    }
}
