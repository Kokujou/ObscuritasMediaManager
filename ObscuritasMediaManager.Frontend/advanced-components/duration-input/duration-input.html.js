import { TimeSpan } from '../../data/timespan.js';
import { html } from '../../exports.js';
import { DurationInput } from './duration-input.js';

/**
 * @param { DurationInput } durationInput
 */
export function renderDurationInput(durationInput) {
    return html`
        ${renderBoundInput(durationInput, 'days', 99)}d
        <!-- -->
        ${renderBoundInput(durationInput, 'hours', 24)}h
        <!-- -->
        ${renderBoundInput(durationInput, 'minutes', 59)}m
        <!-- -->
        ${renderBoundInput(durationInput, 'seconds', 59)}s
    `;
}

/**
 * @param { DurationInput} durationInput
 * @param {keyof TimeSpan} property
 * @param {Number} max
 */
function renderBoundInput(durationInput, property, max) {
    return html`<input
        type="text"
        maxlength="2"
        max="${max}"
        size="2"
        value="${`${durationInput.timespan[property] ?? '00'}`.padStart(2, '0')}"
        onclick="javascript:this.select()"
        onfocus="javascript:this.select()"
        @keydown="${(e) => durationInput.handleKeyDown(e)}"
        oninput="javascript:this.dispatchEvent(new Event('change'))"
        onchange="javascript: if(Number.parseInt(this.value) > Number.parseInt(this.max)) this.value = this.max;
         this.value = this.value.toString().padStart(2,'0');
         this.dispatchEvent(new CustomEvent('valueChanged'))"
        @valueChanged="${(e) => durationInput.handleValueChange(property, e.target)}"
    />`;
}
