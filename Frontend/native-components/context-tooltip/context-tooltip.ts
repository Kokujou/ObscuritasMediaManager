import { customElement } from 'lit-element/decorators';
import { LitElementBase } from '../../data/lit-element-base';
import { PageRouting } from '../../pages/page-routing/page-routing';
import { renderContextTooltipStyles } from './context-tooltip.css';
import { renderContextTooltip } from './context-tooltip.html';

type ContextTooltipItem = { text: string };

@customElement('context-tooltip')
export class ContextTooltip extends LitElementBase {
    static currentInstance: ContextTooltip | null = null;

    static override get styles() {
        return renderContextTooltipStyles();
    }

    static spawn(event: PointerEvent, items: ContextTooltipItem[]) {
        var tooltip = new ContextTooltip();
        tooltip.items = items;

        if (ContextTooltip.currentInstance) return;

        ContextTooltip.currentInstance = tooltip;

        var rect = (event.currentTarget as HTMLElement)!.getBoundingClientRect();
        var scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
        var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        let tooltipTop = scrollTop + rect.top - 55;
        let tooltipLeft = scrollLeft + rect.left + rect.width / 2;
        tooltip.style.left = tooltipLeft + 'px';
        tooltip.style.top = tooltipTop + 'px';
        tooltip.addEventListener('pointermove', (e: Event) => e.stopPropagation());
        event.currentTarget!.addEventListener('pointermove', (e: Event) => e.stopPropagation());

        PageRouting.container!.appendChild(ContextTooltip.currentInstance);
        tooltip.requestFullUpdate();

        return new Promise((resolve) => {
            tooltip.resolve = (item) => {
                tooltip.remove();
                resolve(item);
            };

            window.addEventListener('pointermove', () => tooltip?.remove(), {
                signal: tooltip.abortController.signal,
            });
        });
    }

    items: ContextTooltipItem[] = [];
    resolve: (item: any) => void;

    override render() {
        return renderContextTooltip.call(this);
    }

    override disconnectedCallback() {
        super.disconnectedCallback();
        ContextTooltip.currentInstance = null;
    }
}
