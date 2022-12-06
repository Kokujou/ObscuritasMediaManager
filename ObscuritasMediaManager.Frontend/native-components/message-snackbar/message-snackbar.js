import { LitElement } from '../../exports.js';
import { PageRouting } from '../../pages/page-routing/page-routing.js';
import { renderMessageSnackbarStyles } from './message-snackbar.css.js';
import { renderMessageSnackbar } from './message-snackbar.html.js';

/** @typedef {'error' | 'warning' | 'info' | 'success'} MessageType */

export class MessageSnackbar extends LitElement {
    static get styles() {
        return renderMessageSnackbarStyles();
    }

    static get properties() {
        return { messageType: { type: String, reflect: true } };
    }

    static maxInstances = 4;

    /**
     * @param {string} message
     * @param {MessageType} messageType
     */
    static async popup(message, messageType) {
        var snackbar = new MessageSnackbar();
        snackbar.message = message;
        snackbar.messageType = messageType;
        PageRouting.instance.shadowRoot.appendChild(snackbar);
        snackbar.requestUpdate(undefined);
        MessageSnackbar.recalculateHeights();

        setTimeout(() => {
            snackbar.dismiss();
        }, 5000);
    }

    static recalculateHeights() {
        /** @type {NodeListOf<MessageSnackbar>} */ var snackbars =
            PageRouting.instance.shadowRoot.querySelectorAll('message-snackbar');

        /** @type {MessageSnackbar} */ var previous = null;
        for (var snackbar of snackbars) {
            if (!previous) snackbar.style.top = '20px';
            else snackbar.style.top = `${previous.top + previous.getBoundingClientRect().height + 20}px`;

            previous = snackbar;
        }

        if (snackbars.length >= MessageSnackbar.maxInstances) snackbars[0].dismiss();
    }

    get top() {
        return Number.parseInt(this.style.top.slice(0, -'px'.length));
    }

    get backgroundColor() {
        switch (this.messageType) {
            case 'error':
                return 'red';
            case 'success':
                return 'green';
            case 'info':
                return 'lightblue';
            case 'warning':
                return 'yellow';
            default:
                throw Error('not implemented');
        }
    }

    constructor() {
        super();

        /** @type {string} */ this.message;
        /** @type {MessageType} */ this.messageType;
    }

    render() {
        this.style.backgroundColor = this.backgroundColor;
        return renderMessageSnackbar(this);
    }

    dismiss() {
        var animation = this.animate(
            [
                { opacity: 1, pointerEvents: 'none' },
                { opacity: 0, pointerEvents: 'none' },
            ],
            { duration: 200, fill: 'forwards' }
        );

        animation.onfinish = () => {
            this.remove();
            MessageSnackbar.recalculateHeights();
        };
    }
}
