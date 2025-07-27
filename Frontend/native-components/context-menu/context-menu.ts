import { customElement } from 'lit-element/decorators';
import { LitElementBase } from '../../data/lit-element-base';
import { getScaleFactorX, getScaleFactorY } from '../../extensions/document.extensions';
import { PageRouting } from '../../pages/page-routing/page-routing';
import { renderContextMenuStyles } from './context-menu.css';
import { renderContextMenu } from './context-menu.html';

export class ContextMenuItem {
    text: string;
    icon?: string;
    image?: string;
    action: () => void;
}

@customElement('context-menu')
export class ContextMenu extends LitElementBase {
    static instance: ContextMenu | null = null;

    static override get styles() {
        return renderContextMenuStyles();
    }

    static popup(items: ContextMenuItem[], pointerEvent: Event | PointerEvent | MouseEvent) {
        if (ContextMenu.instance) ContextMenu.instance.remove();
        var menu = new ContextMenu();
        pointerEvent.stopPropagation();
        menu.items = items;

        var x: number, y: number;
        if (pointerEvent instanceof PointerEvent || pointerEvent instanceof MouseEvent)
            [x, y] = [pointerEvent.pageX, pointerEvent.pageY];
        else {
            var target = pointerEvent.target as HTMLElement;
            var rect = target.getBoundingClientRect();
            [x, y] = [rect.x, rect.y];
        }

        var itemTop = y / getScaleFactorY();
        menu.style.top = itemTop + 'px';
        if (y > screen.height / 2) menu.style.transform = 'translateY(-100%)';

        menu.style.left = x / getScaleFactorX() + 'px';
        if (y > screen.height / 2) menu.style.maxHeight = `${itemTop}px`;
        else menu.style.maxHeight = `calc(100% - ${itemTop}px)`;

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
        window.addEventListener('keydown', (e: Event) => this.remove(), { signal: this.abortController.signal });
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
