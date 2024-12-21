import { LitElement } from 'lit-element';
import { registerContentWarnings } from '../resources/icons/content-warnings/register-content-warnings';
import { registerTargetGroups } from '../resources/icons/target-groups/register-target-groups';
import { registerIcons } from '../resources/inline-icons/icon-registry';
import { renderInstrumentTypeIcons } from './enumerations/instrument-types';
import { renderLanguageFlags } from './enumerations/nation';
import { renderParticipantCountIcon } from './enumerations/participants';
import { Subscription } from './observable';

export class LitElementBase extends LitElement {
    static baseStyles = [
        registerIcons().styleSheet!,
        renderLanguageFlags().styleSheet!,
        renderParticipantCountIcon().styleSheet!,
        registerContentWarnings().styleSheet!,
        registerTargetGroups().styleSheet!,
        renderInstrumentTypeIcons().styleSheet!,
    ];

    protected subscriptions: Subscription[] = [];
    abortController = new AbortController();
    protected elementsWithTooltips: Element[] = [];

    override connectedCallback() {
        super.connectedCallback();

        if (this.shadowRoot?.adoptedStyleSheets)
            this.shadowRoot.adoptedStyleSheets = LitElementBase.baseStyles.concat(this.shadowRoot.adoptedStyleSheets);
    }

    async requestFullUpdate() {
        //@ts-ignore
        await super.requestUpdate(undefined);
        this.shadowRoot?.querySelectorAll('*').forEach((x) => {
            if (x instanceof LitElementBase) x.requestFullUpdate();
        });
    }

    override updated(_changedProperties: Map<any, any>) {
        super.updated(_changedProperties);

        if ('pageName' in this.constructor) document.title = `${this.constructor.pageName}`;
        this.attachTooltips();
    }

    protected override render(): unknown | null {
        return null;
    }

    redispatchEvent(event: Event, target: HTMLElement | null = null) {
        target ??= this;
        target.dispatchEvent(new Event(event.type, { bubbles: true, composed: true }));
    }

    attachTooltips() {
        (this.shadowRoot ?? this).querySelectorAll('*[tooltip]')!.forEach((element) => {
            if (!this.elementsWithTooltips.includes(element)) this.attachTooltip(element);
        });
    }

    attachTooltip(element: Element) {
        var CustomTooltip = window.customElements.get(
            'custom-tooltip'
        ) as typeof import('../native-components/custom-tooltip/custom-tooltip').CustomTooltip;
        element.addEventListener('pointerover', (e: Event) =>
            CustomTooltip.show(element.getAttribute('tooltip'), e, (element.getAttribute('anchor') as any) ?? 'top')
        );
        this.elementsWithTooltips.push(element);
    }

    override disconnectedCallback() {
        super.disconnectedCallback();
        this.abortController.abort();
        this.subscriptions.forEach((x) => x.unsubscribe());
        this.subscriptions = [];
    }
}
