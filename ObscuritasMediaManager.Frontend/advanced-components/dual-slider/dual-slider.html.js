import { html } from '../../exports.js';
import { DualSlider } from './dual-slider.js';

/**
 * @param {DualSlider} dualSlider
 */
export function renderDualSlider(dualSlider) {
    return html`
        <style>
            .slider-container {
                left: ${dualSlider.leftValue}%;
                width: ${dualSlider.rightValue - dualSlider.leftValue}%;
            }
        </style>
        <div class="dual-slider">
            <div class="slider-line">
                <div class="slider-container">
                    <div id="left-slider" @pointerdown="${(e) => dualSlider.startDrag(e.target)}" class="slider"></div>
                    <div id="right-slider" @pointerdown="${(e) => dualSlider.startDrag(e.target)}" class="slider"></div>
                </div>
            </div>
        </div>
    `;
}
