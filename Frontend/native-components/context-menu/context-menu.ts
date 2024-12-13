import { customElement } from 'lit-element/decorators';
import { LitElementBase } from '../../data/lit-element-base';
import { PageRouting } from '../../pages/page-routing/page-routing';
import { getScaleFactorX, getScaleFactorY } from '../../services/extensions/document.extensions';
import { renderContextMenuStyles } from './context-menu.css';
import { renderContextMenu } from './context-menu.html';

export class ContextMenuItem {
    text: string;
    icon: string;
    action: () => void;
}

@customElement('context-menu')
export class ContextMenu extends LitElementBase {
    static instance: ContextMenu | null = null;

    static override get styles() {
        return renderContextMenuStyles();
    }

    static popup(items: ContextMenuItem[], pointerEvent: PointerEvent | MouseEvent) {
        if (ContextMenu.instance) ContextMenu.instance.remove();
        var menu = new ContextMenu();
        pointerEvent.stopPropagation();
        menu.items = items;
        menu.style.top = pointerEvent.pageY / getScaleFactorY() + 'px';
        menu.style.left = pointerEvent.pageX / getScaleFactorX() + 'px';

        PageRouting.container!.append(menu);
        ContextMenu.instance = menu;
        menu.requestFullUpdate();
    }

    items: ContextMenuItem[] = [];

    override connectedCallback() {
        super.connectedCallback();

        document.addEventListener(
            'wheel',
            (e: Event) => {
                e.preventDefault();
                e.stopPropagation();
            },
            { signal: this.abortController.signal, passive: false }
        );

        window.addEventListener('click', (e: Event) => this.remove(), { signal: this.abortController.signal });
        window.addEventListener('contextmenu', (e: Event) => this.remove(), { signal: this.abortController.signal });
    }

    override render() {
        return renderContextMenu(this);
    }

    triggerAction(item: ContextMenuItem) {
        item.action();
        this.remove();
    }

    override disconnectedCallback() {
        super.disconnectedCallback();
        ContextMenu.instance = null;
    }
}
