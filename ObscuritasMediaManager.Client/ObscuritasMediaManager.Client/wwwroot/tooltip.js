

class CustomTooltip extends HTMLElement {

    static timeout;
    /** @access private @type {CustomTooltip}*/ static currentInstance;


    /**
     * @param {string} text
     * @param {Event} pointerEvent
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
        tooltip.setAttribute("anchor", anchor)

        CustomTooltip.currentInstance = tooltip;
        document.body.appendChild(CustomTooltip.currentInstance);

        //if (DialogBase.instantiated > 0) tooltip.setAttribute('scope', 'dialog');
        //else 
        tooltip.setAttribute('scope', 'default');

        var rect = /** @type {HTMLElement} */ (tooltip.target).getBoundingClientRect();
        console.log(tooltip.target)
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

        this.abortController = new AbortController();
        /** @type {string} */ this.text;
        /** @type {HTMLElement} */ this.target;
        /** @type {'top' | 'bottom' | 'right' | 'left'} */ this.anchor = 'top';
    }

    connectedCallback() {

        var shadow = this.attachShadow({ mode: "open" });
        shadow.innerHTML = `
        <style>
          :host {
            position: fixed;
            padding: 5px 7px;
            border-radius: 5px;

            display: flex;
            z-index: 5000;
            white-space: pre;
            pointer-events: none;
            /* white-space: nowrap; */
            font: inherit;
        }

        :host([anchor='top']) {
            transform: translate(-50%, -100%);
        }

        :host([anchor='bottom']) {
            transform: translate(-50%, 0);
        }

        :host([anchor='left']) {
            transform: translate(-100%, -50%);
        }

        :host([anchor='right']) {
            transform: translate(0, -50%);
        }

        :host([scope='dialog']) {
            background-color: var(--dialog-tooltip-background, #555);
            color: var(--dialog-tooltip-font-color, white);
        }

        :host([scope='default']) {
            background-color: var(--tooltip-background, #555);
            color: var(--tooltip-font-color, white);
        }

        :host([removed]) {
            opacity: 0;
        }
        </style>
        <div id="tooltip">${this.text}</div>`
    }

    remove() {
        this.toggleAttribute('removed', true);
        CustomTooltip.timeout = setTimeout(() => {
            super.remove();
            CustomTooltip.currentInstance = null;
        }, 250);
    }
}



var observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      /** @type {NodeListOf<HTMLElement> */ var elementsWithTooltips = document.body.querySelectorAll('*[tooltip]');
        for (var element of elementsWithTooltips) {
            const tooltip = element.getAttribute('tooltip');
            element.onpointerover = (e) => CustomTooltip.show(tooltip, e, "top");
        }
    });
});

document.addEventListener("DOMContentLoaded", () =>
    observer.observe(document.body, { attributes: true, childList: true, subtree: true }));

window.customElements.define("custom-tooltip", CustomTooltip)
