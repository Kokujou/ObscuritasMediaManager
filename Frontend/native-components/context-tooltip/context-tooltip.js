import { LitElementBase } from '../../data/lit-element-base.js';
import { PageRouting } from '../../pages/page-routing/page-routing.js';
import { renderContextTooltipStyles } from './context-tooltip.css.js';
import { renderContextTooltip } from './context-tooltip.html.js';

/**
 * @typedef {Object} ContextTooltipItem
 * @prop {string} text
 */

export class ContextTooltip extends LitElementBase {
    static currentInstance = null;

    static get styles() {
        return renderContextTooltipStyles();
    }

    /**
     * @param {PointerEvent} event
     * @param {ContextTooltipItem[]} items
     */
    static spawn(event, items) {
        var tooltip = new ContextTooltip();
        tooltip.items = items;

        if (ContextTooltip.currentInstance) return;

        ContextTooltip.currentInstance = tooltip;

        var rect = /** @type {HTMLElement} */ (event.currentTarget).getBoundingClientRect();
        var scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
        var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        let tooltipTop = scrollTop + rect.top - 55;
        let tooltipLeft = scrollLeft + rect.left + rect.width / 2;
        tooltip.style.left = tooltipLeft + 'px';
        tooltip.style.top = tooltipTop + 'px';
        tooltip.addEventListener('pointermove', (e) => e.stopPropagation());
        event.currentTarget.addEventListener('pointermove', (e) => e.stopPropagation());

        PageRouting.instance.shadowRoot.appendChild(ContextTooltip.currentInstance);
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

    /** @type {ContextTooltipItem[]} */ items = [];
    /** @type {(any)=>void} */ resolve;

    render() {
        return renderContextTooltip(this);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        ContextTooltip.currentInstance = null;
    }
}
