import { LitElementBase } from '../../data/lit-element-base.js';
import { Nation } from '../../obscuritas-media-manager-backend-client.js';
import { renderLanguageSwitcherStyles } from './language-switcher.css.js';
import { renderLanguageSwitcher } from './language-switcher.html.js';

/** @typedef {'nation' | 'language'} SwitcherProperty */

export class LanguageSwitcher extends LitElementBase {
    static get styles() {
        return renderLanguageSwitcherStyles();
    }

    static get properties() {
        return {
            language: { type: String, reflect: true },
            nation: { type: String, reflect: true },
        };
    }

    static AllLanguages = Object.values(Nation);

    /**
     * @param {Element} parent
     * @param {Nation} language
     * @param {Nation} nation
     * @return {Promise<{language:Nation, nation:Nation}>}
     */
    static spawnAt(parent, language, nation) {
        var languageSwitcher = new LanguageSwitcher();
        languageSwitcher.language = language;
        languageSwitcher.nation = nation;
        var steps = 360 / this.AllLanguages.length;
        var missingDegrees = 90 % steps;
        languageSwitcher.languageRotationOffset = steps * this.AllLanguages.indexOf(language) + missingDegrees / 2;
        languageSwitcher.nationRotationOffset = steps * this.AllLanguages.indexOf(nation) + missingDegrees / 2;

        parent.append(languageSwitcher);
        return new Promise((resolve) => {
            languageSwitcher.resolve = resolve;
        });
    }

    constructor() {
        super();
        /** @type {Nation} */ this.language = Nation.Unset;
        /** @type {Nation} */ this.nation = Nation.Unset;
        /** @type {number} */ this.languageRotationOffset = 0;
        /** @type {number} */ this.nationRotationOffset = 0;

        /** @type {(Nation)=>void} */ this.resolve = () => {};
    }

    connectedCallback() {
        super.connectedCallback();
        document.addEventListener('keyup', (e) => {
            if (e.key == 'Escape') this.destroy();
        });
    }

    render() {
        return renderLanguageSwitcher(this);
    }

    /**
     * @param {SwitcherProperty} property
     * @param {'up' | 'down'} direction
     */
    moveProperty(property, direction) {
        var currentIndex = LanguageSwitcher.AllLanguages.indexOf(this[property]);
        var offset = 0;
        if (direction == 'up') currentIndex++;
        if (direction == 'up') offset += 360 / LanguageSwitcher.AllLanguages.length;
        if (direction == 'down') currentIndex--;
        if (direction == 'down') offset -= 360 / LanguageSwitcher.AllLanguages.length;
        if (currentIndex < 0) currentIndex = LanguageSwitcher.AllLanguages.length - 1;
        if (currentIndex >= LanguageSwitcher.AllLanguages.length) currentIndex = 0;
        if (property == 'nation') this.nationRotationOffset += offset;
        if (property == 'language') this.languageRotationOffset += offset;
        this[property] = LanguageSwitcher.AllLanguages[currentIndex];
        this.requestFullUpdate();
    }

    /**
     * @param {WheelEvent & {wheelDelta: number}} event
     */
    scrollWheel(event) {
        /** @type {'up' | 'down'} */ var direction = event.wheelDelta < 0 ? 'up' : 'down';
        var parentRect = this.shadowRoot?.querySelector('#language-switcher-overlay')?.getBoundingClientRect();
        if (!parentRect) return;
        var left = event.clientX - parentRect.left;
        var parentCenterX = parentRect.width / 2;
        if (left < parentCenterX) return this.moveProperty('language', direction);
        if (left >= parentCenterX) return this.moveProperty('nation', direction);
    }

    confirm() {
        this.resolve({ language: this.language, nation: this.nation });
        this.destroy();
    }

    destroy() {
        this.resolve(null);
        this.classList.toggle('destroyed', true);
        setTimeout(() => {
            this.remove();
        }, 500);
    }
}
