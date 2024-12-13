import { customElement, property } from 'lit-element/decorators';
import { LitElementBase } from '../../data/lit-element-base';
import { Session } from '../../data/session';
import { PageRouting } from '../../pages/page-routing/page-routing';
import { renderDialogBaseStyles } from './dialog-base.css';
import { renderDialogBase } from './dialog-base.html';

export class DialogProperties {
    content: string;
    acceptActionText: string;
    declineActionText: string;
    width: number;
    height: number;
    showBorder: boolean;
    noImplicitAccept: boolean;
    noImplicitDecline: boolean;
}

@customElement('dialog-base')
export class DialogBase extends LitElementBase {
    static instantiated = 0;

    static override get styles() {
        return renderDialogBaseStyles();
    }

    static show(caption: string, properties: Partial<DialogProperties>) {
        var dialog = new DialogBase();
        dialog.caption = caption;
        dialog.acceptActionText = properties?.acceptActionText;
        dialog.declineActionText = properties?.declineActionText;
        dialog.canAccept = true;
        dialog.properties = properties;

        PageRouting.container!.appendChild(dialog);
        dialog.requestFullUpdate();

        return new Promise<boolean>((resolve) => {
            dialog.addEventListener('accept', () => {
                dialog.remove();
                resolve(true);
            });

            dialog.addEventListener('decline', () => {
                dialog.remove();
                resolve(false);
            });
        });
    }

    @property() caption: string;
    @property() acceptActionText?: string;
    @property() declineActionText?: string;
    @property() properties: Partial<DialogProperties>;
    @property() canAccept: boolean;

    constructor() {
        super();
        DialogBase.instantiated++;
    }

    override connectedCallback() {
        super.connectedCallback();

        this.tabIndex = 0;
        this.focus();
        this.addEventListener(
            'keyup',
            (e: KeyboardEvent) => {
                if (e.key == 'Escape' && !this.properties?.noImplicitDecline) this.decline();
                if (e.key == 'Enter' && !this.properties?.noImplicitAccept) this.accept();
            },
            { signal: this.abortController.signal }
        );
        this.subscriptions.push(
            Session.currentPage.subscribe((oldValue, newValue) => {
                if (oldValue != newValue) this.decline();
            })
        );
    }

    override render() {
        return renderDialogBase.call(this);
    }

    accept() {
        if (!this.canAccept || !this.acceptActionText) return;
        this.dispatchEvent(new CustomEvent('accept', { composed: true, bubbles: true }));
    }

    decline() {
        if (!this.declineActionText) return;
        this.dispatchEvent(new CustomEvent('decline', { composed: true, bubbles: true }));
    }
}
