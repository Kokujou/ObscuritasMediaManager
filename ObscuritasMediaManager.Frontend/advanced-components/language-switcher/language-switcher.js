import { LitElementBase } from '../../data/lit-element-base.js';
import { Language } from '../../obscuritas-media-manager-backend-client.js';
import { renderLanguageSwitcherStyles } from './language-switcher.css.js';
import { renderLanguageSwitcher } from './language-switcher.html.js';

export class LanguageSwitcher extends LitElementBase {
    static get styles() {
        return renderLanguageSwitcherStyles();
    }

    static get properties() {
        return {
            language: { type: String, reflect: true },
        };
    }

    static AllLanguages = Object.values(Language);

    /**
     * @param {Element} parent
     * @param {Language} language
     * @return {Promise<Language>}
     */
    static spawnAt(parent, language) {
        var languageSwitcher = new LanguageSwitcher();
        languageSwitcher.language = language;
        var steps = 360 / this.AllLanguages.length;
        var missingDegrees = 90 % steps;
        languageSwitcher.languageRotationOffset = steps * this.AllLanguages.indexOf(language) + missingDegrees / 2;

        parent.append(languageSwitcher);
        return new Promise((resolve) => {
            languageSwitcher.resolve = resolve;
        });
    }

    constructor() {
        super();
        /** @type {Language} */ this.language = Language.Unset;
        /** @type {number} */ this.languageRotationOffset = 0;

        /** @type {(Nation)=>void} */ this.resolve = () => {};
    }

    connectedCallback() {
        super.connectedCallback();
        document.addEventListener('keyup', (e) => {
            if (e.key == 'Escape') this.destroy();
        });

        document.addEventListener('wheel', (e) => this.scrollWheel(e));
    }

    render() {
        return renderLanguageSwitcher(this);
    }

    /**
     * @param {'up' | 'down'} direction
     */
    move(direction) {
        var currentIndex = LanguageSwitcher.AllLanguages.indexOf(this.language);
        var offset = 0;
        if (direction == 'up') currentIndex++;
        if (direction == 'up') offset += 360 / LanguageSwitcher.AllLanguages.length;
        if (direction == 'down') currentIndex--;
        if (direction == 'down') offset -= 360 / LanguageSwitcher.AllLanguages.length;
        if (currentIndex < 0) currentIndex = LanguageSwitcher.AllLanguages.length - 1;
        if (currentIndex >= LanguageSwitcher.AllLanguages.length) currentIndex = 0;
        this.languageRotationOffset += offset;
        this.language = LanguageSwitcher.AllLanguages[currentIndex];
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
        return this.move(direction);
    }

    confirm() {
        this.resolve(this.language);
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
