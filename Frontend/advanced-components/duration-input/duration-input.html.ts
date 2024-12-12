import { html } from 'lit-element';
import { TimeSpan } from '../../data/timespan';
import { DurationInput } from './duration-input';

export function renderDurationInput(this: DurationInput) {
    return html`
        ${renderBoundInput.call(this, 'days', 99)}d
        <!-- -->
        ${renderBoundInput.call(this, 'hours', 24)}h
        <!-- -->
        ${renderBoundInput.call(this, 'minutes', 59)}m
        <!-- -->
        ${renderBoundInput.call(this, 'seconds', 59)}s
    `;
}

function renderBoundInput(this: DurationInput, property: keyof TimeSpan, max: Number) {
    return html`<input
        type="text"
        maxlength="2"
        max="${max}"
        size="2"
        value="${`${this.timespan[property] ?? '00'}`.padStart(2, '0')}"
        onclick="javascript:this.select()"
        onfocus="javascript:this.select()"
        @keydown="${this.handleKeyDown}"
        oninput="javascript:this.dispatchEvent(new Event('change'))"
        onchange="javascript: if(Number.parseInt(this.value) > Number.parseInt(this.max)) this.value = this.max;
         this.value = this.value.toString().padStart(2,'0');
         this.dispatchEvent(new CustomEvent('valueChanged'))"
        @valueChanged="${(e: Event) => this.handleValueChange(property, e.target as HTMLInputElement)}"
    />`;
}
