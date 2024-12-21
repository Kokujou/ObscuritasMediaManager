import { customElement } from 'lit-element/decorators';
import { LitElementBase } from '../../data/lit-element-base';
import { PageRouting } from '../../pages/page-routing/page-routing';
import { Icons } from '../../resources/inline-icons/icon-registry';
import { getScaleFactorX, getScaleFactorY } from '../../services/extensions/document.extensions';
import { renderContextMenuStyles } from './context-menu.css';
import { renderContextMenu } from './context-menu.html';

export class ContextMenuItem {
    text: string;
    icon: keyof typeof Icons;
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
        var itemTop = pointerEvent.pageY / getScaleFactorY();
        menu.style.top = itemTop + 'px';
        if (pointerEvent.pageY > screen.height / 2) menu.style.transform = 'translateY(-100%)';

        menu.style.left = pointerEvent.pageX / getScaleFactorX() + 'px';
        if (pointerEvent.pageY > screen.height / 2) menu.style.maxHeight = `${itemTop}px`;
        else menu.style.maxHeight = `calc(100% - ${itemTop}px)`;
        console.log(itemTop);

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

        this.addEventListener('wheel', (e) => e.stopPropagation());

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
