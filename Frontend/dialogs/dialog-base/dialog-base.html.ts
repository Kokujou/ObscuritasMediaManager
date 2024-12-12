import { html } from 'lit-element';
import { DialogBase } from './dialog-base';

/**
 * @param {DialogBase} dialog
 */
export function renderDialogBase(dialog) {
    return html`
        <div id="dialog-outer">
            <div id="dialog-border" ?invisible="${!dialog.properties?.showBorder}">
                <div id="dialog-container" tabindex="0" autofocus>
                    <div id="dialog-title">${dialog.caption}</div>
                    ${dialog.declineActionText ? html` <div id="x-button" @click="${() => dialog.decline()}">&times;</div>` : ''}
                    ${dialog.properties?.content
                        ? html`<div id="dialog-text">${dialog.properties.content}</div>`
                        : html` <div id="dialog-content"><slot></slot></div>`}

                    <div id="dialog-actions">
                        ${dialog.declineActionText
                            ? html`<border-button
                                  @click="${() => dialog.decline()}"
                                  text="${dialog.declineActionText}"
                              ></border-button>`
                            : ''}
                        ${dialog.acceptActionText
                            ? html` <border-button
                                  ?disabled="${!dialog.canAccept}"
                                  @click="${() => dialog.accept()}"
                                  text="${dialog.acceptActionText}"
                              ></border-button>`
                            : ''}
                    </div>
                </div>
            </div>
        </div>
    `;
}
