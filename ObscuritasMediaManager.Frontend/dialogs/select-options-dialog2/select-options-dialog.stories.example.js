// @ts-ignore
import { html } from '@open-wc/demoing-storybook';
import { object } from 'storybook-prebuilt/addon-knobs';
import { SelectOptionsDialog } from './select-options-dialog.js';

var options = object('options', {
    identifier1: 'displayName1',
    identifier2: 'displayName2',
    identifier3: 'displayName3',
    identifier4: 'displayName4',
});
function showDialog() {
    var dialog = SelectOptionsDialog.show(options);
    dialog.addEventListener('decline', () => dialog.remove());
    dialog.addEventListener('accept', (e) => {
        var event = /** @type {CustomEvent} */ (e);
        console.log(event.detail);
        dialog.remove();
    });
}

export const SelectOptionsDialogExample = () =>
    html`<page-routing> <button @click="${() => showDialog()}">open dialog</button></page-routing>`;
