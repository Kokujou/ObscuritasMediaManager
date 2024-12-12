import { customElement } from 'lit-element/decorators';
import { LitElementBase } from '../../data/lit-element-base';
import { PageRouting } from '../../pages/page-routing/page-routing';
import { getScaleFactorX, getScaleFactorY } from '../../services/extensions/document.extensions';
import { renderContextMenuStyles } from './context-menu.css';
import { renderContextMenu } from './context-menu.html';

@customElement('context-menu')
export class ContextMenuItem {
    /** @type {string} */ text;
    /** @type {string} */ icon;
    /** @type {()=>void} */ action;
}

export class ContextMenu extends LitElementBase {
    /** @type {ContextMenu} */ static instance = null;

    static override get styles() {
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
        menu.requestFullUpdate();
    }

    constructor() {
        super();

        /** @type {ContextMenuItem[]} */ this.items = [];
    }

    override connectedCallback() {
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

    override render() {
        return renderContextMenu(this);
    }

    /**
     * @param {ContextMenuItem} item
     */
    triggerAction(item) {
        item.action();
        this.remove();
    }

    disoverride connectedCallback() {
        super.disconnectedCallback();
        ContextMenu.instance = null;
    }
}
