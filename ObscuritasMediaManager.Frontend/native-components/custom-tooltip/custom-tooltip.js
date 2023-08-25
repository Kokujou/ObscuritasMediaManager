import { LitElementBase } from '../../data/lit-element-base.js';
import { DialogBase } from '../../dialogs/dialog-base/dialog-base.js';
import { PageRouting } from '../../pages/page-routing/page-routing.js';
import { renderTooltipStyles } from './custom-tooltip.css.js';
import { renderTooltip } from './custom-tooltip.html.js';

export class CustomTooltip extends LitElementBase {
    static timeout;
    /** @access private @type {CustomTooltip}*/ static currentInstance;

    static get styles() {
        return renderTooltipStyles();
    }

    static get properties() {
        return {
            text: { type: String, reflect: true },
            scope: { type: String, reflect: true },
            anchor: { type: String, reflect: true },
        };
    }

    /**
     * @param {string} text
     * @param {PointerEvent} pointerEvent
     * @param { 'top' | 'bottom' | 'right' | 'left'  } anchor
     */
    static show(text, pointerEvent, anchor = 'top') {
        if (!text || text.length < 2) return;
        text = text[0].toUpperCase() + text.substring(1);
        if (CustomTooltip.currentInstance && CustomTooltip.currentInstance.target == pointerEvent.target) {
            clearTimeout(CustomTooltip.timeout);
            return;
        } else if (CustomTooltip.currentInstance) {
            CustomTooltip.currentInstance.remove();
            clearTimeout(CustomTooltip.timeout);
        }

        var tooltip = new CustomTooltip();
        tooltip.text = text;
        tooltip.target = /** @type {HTMLElement} */ (pointerEvent.currentTarget);
        tooltip.anchor = anchor;

        CustomTooltip.currentInstance = tooltip;
        PageRouting.instance.shadowRoot.appendChild(CustomTooltip.currentInstance);

        if (DialogBase.instantiated > 0) tooltip.setAttribute('scope', 'dialog');
        else tooltip.setAttribute('scope', 'default');

        var rect = /** @type {HTMLElement} */ (tooltip.target).getBoundingClientRect();
        var scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
        var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        let tooltipTop = scrollTop;
        let tooltipLeft = scrollLeft;

        switch (anchor) {
            case 'top':
                tooltipTop += rect.top - 5;
                tooltipLeft += rect.left + rect.width / 2;
                break;
            case 'bottom':
                tooltipTop += rect.top + rect.height + 5;
                tooltipLeft += rect.left + rect.width / 2;
                break;
            case 'right':
                tooltipTop += rect.top + rect.height / 2;
                tooltipLeft += rect.left + rect.width + 5;
                break;
            case 'left':
                tooltipTop += rect.top + rect.height / 2;
                tooltipLeft += rect.left - 5;
                break;
        }
        tooltip.style.left = tooltipLeft + 'px';
        tooltip.style.top = tooltipTop + 'px';
        window.addEventListener('wheel', () => tooltip.remove(), { signal: tooltip.abortController.signal });
        window.addEventListener('click', () => tooltip.remove(), { signal: tooltip.abortController.signal });
        pointerEvent.target.addEventListener('pointerout', () => tooltip?.remove(), {
            signal: tooltip.abortController.signal,
        });
    }

    static remove() {
        if (!CustomTooltip.currentInstance) return;
        CustomTooltip.currentInstance.remove();
    }

    constructor() {
        super();

        /** @type {string} */ this.text;
        /** @type {HTMLElement} */ this.target;
        /** @type {'top' | 'bottom' | 'right' | 'left'} */ this.anchor = 'top';
    }

    render() {
        return renderTooltip(this);
    }

    remove() {
        this.toggleAttribute('removed', true);
        CustomTooltip.timeout = setTimeout(() => {
            this.remove();
            CustomTooltip.currentInstance = null;
        }, 250);
    }
}
