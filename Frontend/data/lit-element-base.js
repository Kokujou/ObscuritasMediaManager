import { css, LitElement } from '../exports.js';
import { registerContentWarnings } from '../resources/icons/content-warnings/register-content-warnings.js';
import { registerTargetGroups } from '../resources/icons/target-groups/register-target-groups.js';
import { registerIcons } from '../resources/inline-icons/icon-registry.js';
import { renderInstrumentTypeIcons } from './enumerations/instrument-types.js';
import { renderLanguageFlags } from './enumerations/nation.js';
import { renderParticipantCountIcon } from './enumerations/participants.js';
import { Subscription } from './observable.js';

export class LitElementBase extends LitElement {
    static baseStyles = css`
        ${registerIcons()}
        ${renderLanguageFlags()}
    ${renderParticipantCountIcon()}
    ${registerContentWarnings()}
    ${registerTargetGroups()}
    ${renderInstrumentTypeIcons()}
    `.styleSheet;

    constructor() {
        super();
        /** @type {Subscription[]} */ this.subscriptions = [];
        this.abortController = new AbortController();
        /** @type {Element[]} */ this.elementsWithTooltips = [];
        this.shadowRoot.adoptedStyleSheets.push(LitElementBase.baseStyles);
    }

    async requestFullUpdate() {
        //@ts-ignore
        await super.requestUpdate(undefined);
        this.shadowRoot.querySelectorAll('*').forEach((x) => {
            if (x instanceof LitElementBase) x.requestFullUpdate();
        });
    }

    updated(_changedProperties) {
        super.updated(_changedProperties);

        this.attachTooltips();
    }

    /**
     * @param {Event} event
     * @param {HTMLElement} [target]
     */
    redispatchEvent(event, target = null) {
        target ??= this;
        target.dispatchEvent(new Event(event.type, { bubbles: true, composed: true }));
    }

    attachTooltips() {
        var elementsWithTooltips = this.shadowRoot.querySelectorAll('*[tooltip]');
        for (var element of elementsWithTooltips) {
            if (!this.elementsWithTooltips.includes(element)) this.attachTooltip(element);
        }
    }

    /**
     *
     * @param {Element} element
     */
    attachTooltip(element) {
        var CustomTooltip = /** @type {typeof import('../native-components/custom-tooltip/custom-tooltip.js').CustomTooltip} */ (
            window.customElements.get('custom-tooltip')
        );
        element.addEventListener('pointerover', (e) => CustomTooltip.show(element.getAttribute('tooltip'), e));
        this.elementsWithTooltips.push(element);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.abortController.abort();
        this.subscriptions.forEach((x) => x.unsubscribe());
        this.subscriptions = [];
    }
}
