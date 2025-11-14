import { html } from 'lit';
import { DialogBase } from './dialog-base';

export function renderDialogBase(this: DialogBase) {
    return html`
        <div id="dialog-outer">
            <div id="dialog-border" ?invisible="${!this.properties?.showBorder}">
                <div id="dialog-container" tabindex="0" autofocus>
                    <div id="dialog-title">${this.caption}</div>
                    ${this.declineActionText ? html` <div id="x-button" @click="${() => this.decline()}">&times;</div>` : ''}
                    ${this.properties?.content
                        ? html`<div id="dialog-text">${this.properties.content}</div>`
                        : html` <div id="dialog-content"><slot></slot></div>`}

                    <div id="dialog-actions">
                        ${this.declineActionText
                            ? html`<border-button
                                  @click="${() => this.decline()}"
                                  text="${this.declineActionText}"
                              ></border-button>`
                            : ''}
                        ${this.acceptActionText
                            ? html` <border-button
                                  ?disabled="${!this.canAccept}"
                                  @click="${() => this.accept()}"
                                  text="${this.acceptActionText}"
                              ></border-button>`
                            : ''}
                    </div>
                </div>
            </div>
        </div>
    `;
}
