import { LitElementBase } from '../../data/lit-element-base.js';
import { Session } from '../../data/session.js';
import { PageRouting } from '../../pages/page-routing/page-routing.js';
import { renderDialogBaseStyles } from './dialog-base.css.js';
import { renderDialogBase } from './dialog-base.html.js';

/**
 * @typedef {Object} DialogProperties
 * @prop {string} content
 * @prop {string} acceptActionText
 * @prop {string} declineActionText
 * @prop {number} width
 * @prop {number} height
 * @prop {boolean} showBorder
 * @prop {boolean} noImplicitAccept
 * @prop {boolean} noImplicitDecline
 */

export class DialogBase extends LitElementBase {
    static instantiated = 0;

    static get styles() {
        return renderDialogBaseStyles();
    }

    static get properties() {
        return {
            caption: { type: String, reflect: true },
            acceptActionText: { type: String, reflect: true },
            declineActionText: { type: String, reflect: true },
            canAccept: { type: Boolean, reflect: true },
            showBorder: { type: Boolean, reflect: true },
        };
    }

    /**
     * @param {string} caption
     * @param {Partial<DialogProperties>} properties
     * @returns {Promise<boolean>}
     */
    static show(caption, properties) {
        var dialog = new DialogBase();
        dialog.caption = caption;
        dialog.acceptActionText = properties?.acceptActionText;
        dialog.declineActionText = properties?.declineActionText;
        dialog.canAccept = true;
        dialog.properties = properties;

        PageRouting.container.appendChild(dialog);
        dialog.requestFullUpdate();

        return new Promise((resolve) => {
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

    constructor() {
        super();

        /** @type {string} */ this.caption;
        /** @type {string} */ this.acceptActionText;
        /** @type {string} */ this.declineActionText;
        /** @type {Partial<DialogProperties>} */ this.properties;
        /** @type {Boolean} */ this.canAccept;
        DialogBase.instantiated++;
    }

    connectedCallback() {
        super.connectedCallback();

        this.tabIndex = 0;
        this.focus();
        this.addEventListener(
            'keyup',
            (e) => {
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

    render() {
        return renderDialogBase(this);
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
