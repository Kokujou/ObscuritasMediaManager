import { html } from '../../exports.js';
import { DialogBase } from './dialog-base.js';

/**
 * @param {DialogBase} dialogBase
 */
export function renderDialogBase(dialogBase) {
    return html`
        <div id="dialog-outer">
            <div id="dialog-border">
                <div id="dialog-container">
                    <div id="dialog-title">${dialogBase.caption}</div>
                    <div id="dialog-content"><slot></slot></div>
                    <div id="dialog-actions">
                        <border-button @click="${() => dialogBase.decline()}" text="Abbrechen"></border-button>
                        <border-button @click="${() => dialogBase.accept()}" text="Ok"></border-button>
                    </div>
                </div>
            </div>
        </div>
    `;
}
