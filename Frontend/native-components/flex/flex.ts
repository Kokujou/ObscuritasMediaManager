import { css } from 'lit-element';
import { customElement } from 'lit-element/decorators';
import { html } from 'lit-html';
import { LitElementBase } from '../../data/lit-element-base';

@customElement('flex-column')
export class FlexColumn extends LitElementBase {
    static override get styles() {
        return css`
            :host {
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                gap: var(--default-flex-gap);
            }

            :host([center]) {
                align-items: center;
            }
        `;
    }

    override render() {
        return html`<slot></slot>`;
    }
}

@customElement('flex-row')
export class FlexRow extends LitElementBase {
    static override get styles() {
        return css`
            :host {
                display: flex;
                flex-direction: row;
                gap: var(--default-flex-gap);
                width: 100%;
            }

            :host([center]) {
                align-items: center;
            }
        `;
    }

    override render() {
        return html`<slot></slot>`;
    }
}

@customElement('flex-space')
export class FlexSpace extends LitElementBase {
    static override get styles() {
        return css`
            :host {
                flex: auto;
            }
        `;
    }

    override render() {
        return html`<slot></slot>`;
    }
}
