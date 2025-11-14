import { html } from 'lit';
import { TimeSpan } from '../../data/timespan';
import { DurationInput } from './duration-input';

export function renderDurationInput(this: DurationInput) {
    return html`
        ${this.compact ? '' : html` ${renderBoundInput.call(this, 'days', 99)}d`}
        <!-- -->
        ${renderBoundInput.call(this, 'hours', this.compact ? 999 : 24)}h
        <!-- -->
        ${renderBoundInput.call(this, 'minutes', 59)}m
        <!-- -->
        ${this.compact ? '' : html` ${renderBoundInput.call(this, 'seconds', 99)}s`}
    `;
}

function renderBoundInput(this: DurationInput, property: keyof TimeSpan, max: number) {
    return html`<input
        type="text"
        value="${`${this.timespan[property] ?? '00'}`.padStart(2, '0')}"
        oninput="javascript:this.dispatchEvent(new Event('change'))"
        @change="${(e: Event) => this.handleValueChange(property, e.target as HTMLInputElement, max)}"
    />`;
}
