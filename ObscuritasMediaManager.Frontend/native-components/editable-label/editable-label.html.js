import { html } from '../../exports.js';
import { EditableLabel } from './editable-label.js';

/**
 * @param {EditableLabel} editableLabel
 */
export function renderEditableLabel(editableLabel) {
    if (editableLabel.editEnabled) return renderValueInput(editableLabel);

    return renderValueLabel(editableLabel);
}

/**
 * @param {EditableLabel} editableLabel
 */
function renderValueLabel(editableLabel) {
    return html` <div id="editable-label">
        <div id="value-label" class="value-item">${editableLabel.value}</div>
        <div id="edit-icon" class="icon" @click="${() => editableLabel.enableEditing()}"></div>
    </div>`;
}

/**
 * @param {EditableLabel} editableLabel
 */
function renderValueInput(editableLabel) {
    return html` <div id="editable-label">
        <div
            id="value-input"
            contenteditable
            class="value-item"
            @keydown="${(e) => editableLabel.handleLabelInput(e)}"
            @paste="${(e) => editableLabel.handlePaste(e)}"
        >
            ${editableLabel.value}
        </div>
        <div id="abort-icon" class="icon" @click="${() => editableLabel.revertChanges()}"></div>
        <div id="save-icon" class="icon" @click="${() => editableLabel.saveChanges()}"></div>
    </div>`;
}
