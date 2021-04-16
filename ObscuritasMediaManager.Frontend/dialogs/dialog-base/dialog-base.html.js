import { html } from '../../exports.js';
import { DialogBase } from './dialog-base.js';

/**
 * @param {DialogBase} dialogBase
 */
export function renderDialogBase(dialogBase) {
    return html`
        <div class="dialog-outer">
            <div class="dialog-border">
                <div class="dialog-container">
                    <div class="dialog-title">${dialogBase.caption}</div>
                    <div class="dialog-content"><slot></slot></div>
                    <div class="dialog-actions">
                        <border-button @click="${() => dialogBase.decline()}" text="Abbrechen"></border-button>
                        <border-button @click="${() => dialogBase.accept()}" text="Ok"></border-button>
                    </div>
                </div>
            </div>
        </div>
    `;
}
