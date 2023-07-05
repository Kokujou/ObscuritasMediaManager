import { html } from '../../exports.js';
import { EditableLabel } from './editable-label.js';

/**
 * @param {EditableLabel} editableLabel
 */
export function renderEditableLabel(editableLabel) {
    return html` <div id="editable-label">
        <div
            ?invisible="${!editableLabel.editEnabled}"
            id="value-input"
            contenteditable
            class="value-item"
            tabindex="0"
            @keydown="${(e) => editableLabel.handleLabelInput(e)}"
            @paste="${(e) => editableLabel.handlePaste(e)}"
            .innerText="${editableLabel.value}"
        ></div>
        ${editableLabel.editEnabled ? renderValueInput(editableLabel) : renderValueLabel(editableLabel)}
    </div>`;
}

/**
 * @param {EditableLabel} editableLabel
 */
function renderValueLabel(editableLabel) {
    return html`
        <div id="value-label" class="value-item">${editableLabel.value}</div>
        <div id="edit-icon" class="icon" @click="${() => editableLabel.enableEditing()}"></div>
    `;
}

/**
 * @param {EditableLabel} editableLabel
 */
function renderValueInput(editableLabel) {
    return html`
        <div id="abort-icon" class="icon" @click="${() => editableLabel.revertChanges()}"></div>
        <div id="save-icon" class="icon" @click="${() => editableLabel.saveChanges()}"></div>
    `;
}
