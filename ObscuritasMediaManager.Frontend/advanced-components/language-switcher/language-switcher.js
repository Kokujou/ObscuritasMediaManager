import { Nation } from '../../data/enumerations/nation.js';
import { LitElement } from '../../exports.js';
import { Enum } from '../../services/extensions/enum.extensions.js';
import { renderLanguageSwitcherStyles } from './language-switcher.css.js';
import { renderLanguageSwitcher } from './language-switcher.html.js';

export class LanguageSwitcher extends LitElement {
    static get styles() {
        return renderLanguageSwitcherStyles();
    }

    static get properties() {
        return {
            language: { type: String, reflect: true },

            rotationOffset: { type: Number, reflect: false },
        };
    }

    constructor() {
        super();
        /** @type {Nation} */ this.language;
        /** @type {number} */ this.rotationOffset = Object.values(Nation).length;

        this.animationRunning = false;
    }

    /**
     * @param {HTMLElement} parent
     * @param {Nation} language
     */
    static spawnAt(parent, language) {
        var languageSwitcher = new LanguageSwitcher();
        languageSwitcher.language = language;

        parent.append(languageSwitcher);
        return languageSwitcher;
    }

    /**
     * @param {Map<any, any>} _changedProperties
     */
    updated(_changedProperties) {
        super.updated(_changedProperties);

        if (!_changedProperties.has('rotationOffset')) return;

        this.animationRunning = true;
        /** @type {NodeListOf<HTMLElement>} */ var languageIcons = this.shadowRoot.querySelectorAll('.language-selector-icon');
        /** @type {HTMLElement} */ var container;
        languageIcons.forEach((item, index) => {
            var anglePartition = 360.0 / languageIcons.length;
            var targetAngle = anglePartition * index + (360.0 / languageIcons.length) * this.rotationOffset;

            container = item.parentElement;

            item.style.transform = `rotate(${targetAngle}deg) translateY(-${container.offsetHeight / 3}px) rotate(${-targetAngle}deg)`;
        });
        setTimeout(() => {
            this.animationRunning = false;
        }, 500);
    }

    distance(a, b) {
        return Math.abs(a - b);
    }

    /**
     * @param {number} index
     */
    changeLanguage(index) {
        var nations = Object.values(Nation);
        var oldIndex = nations.indexOf(this.language);
        this.language = nations[index];

        if (oldIndex == index) return;

        var clampedTargetOffset = nations.length - index;
        if (index == 0) clampedTargetOffset = 0;
        var clampedRotationOffset = this.rotationOffset % nations.length;
        var backSteps = 0;
        while (true) {
            backSteps--;
            var target = clampedRotationOffset + backSteps;
            if (target < 0) target += nations.length;
            if (target < 0) break;
            if (target === clampedTargetOffset) break;
        }
        backSteps *= -1;

        var foreSteps = 0;
        while (true) {
            foreSteps++;
            var target = clampedRotationOffset + foreSteps;
            if (target >= nations.length) target -= nations.length;
            if (target >= nations.length) break;
            if (target == clampedTargetOffset) break;
        }

        if (foreSteps < backSteps) this.rotationOffset += foreSteps;
        else this.rotationOffset -= backSteps;
    }

    rotateForward() {
        if (this.animationRunning) return;
        if (!this.language) this.language = Nation.Japanese;
        this.language = Enum.previousValue(Nation, this.language, false);
        this.rotationOffset++;
    }

    rotateBackward() {
        if (this.animationRunning) return;
        if (!this.language) this.language = Nation.Japanese;
        this.language = Enum.nextValue(Nation, this.language, false);
        this.rotationOffset--;
    }

    render() {
        return renderLanguageSwitcher(this);
    }

    destroy() {
        this.classList.toggle('destroyed', true);
        setTimeout(() => {
            this.remove();
        }, 1000);
    }
}
