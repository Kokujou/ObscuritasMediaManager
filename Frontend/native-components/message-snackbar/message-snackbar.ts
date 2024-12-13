import { customElement } from 'lit-element/decorators';
import { LitElementBase } from '../../data/lit-element-base';
import { PageRouting } from '../../pages/page-routing/page-routing';
import { renderMessageSnackbarStyles } from './message-snackbar.css';
import { renderMessageSnackbar } from './message-snackbar.html';

type MessageType = 'error' | 'warning' | 'info' | 'success';

@customElement('message-snackbar')
export class MessageSnackbar extends LitElementBase {
    static override get styles() {
        return renderMessageSnackbarStyles();
    }

    static maxInstances = 4;

    static async popup(message: string, messageType: MessageType) {
        var snackbar = new MessageSnackbar();
        snackbar.message = message;
        snackbar.messageType = messageType;
        PageRouting.instance.shadowRoot!.appendChild(snackbar);
        snackbar.requestFullUpdate();
        MessageSnackbar.recalculateHeights();

        setTimeout(() => {
            snackbar.dismiss();
        }, 5000);
    }

    static recalculateHeights() {
        var snackbars = PageRouting.instance.shadowRoot!.querySelectorAll('message-snackbar') as NodeListOf<MessageSnackbar>;

        var previous: MessageSnackbar | null = null;
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

    public declare message: string;
    public declare messageType: string;

    override render() {
        this.style.backgroundColor = this.backgroundColor;
        return renderMessageSnackbar.call(this);
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
