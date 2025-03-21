import { customElement, property } from 'lit-element/decorators';
import { LitElementBase } from '../../data/lit-element-base';
import { Language } from '../../obscuritas-media-manager-backend-client';
import { renderLanguageSwitcherStyles } from './language-switcher.css';
import { renderLanguageSwitcher } from './language-switcher.html';

@customElement('language-switcher')
export class LanguageSwitcher extends LitElementBase {
    static override get styles() {
        return renderLanguageSwitcherStyles();
    }

    static AllLanguages = Object.values(Language);

    static spawnAt(parent: Element, language: Language) {
        var languageSwitcher = new LanguageSwitcher();
        languageSwitcher.language = language;
        var steps = 360 / this.AllLanguages.length;
        var missingDegrees = 90 % steps;
        languageSwitcher.languageRotationOffset = steps * this.AllLanguages.indexOf(language) + missingDegrees / 2;

        parent.append(languageSwitcher);
        return new Promise<Language>((resolve) => {
            languageSwitcher.resolve = resolve;
        });
    }

    @property({ reflect: true }) public declare language: Language;

    protected languageRotationOffset = 0;
    protected resolve = (lang: Language) => {};

    constructor() {
        super();
        this.language = Language.Unset;
    }

    override connectedCallback() {
        super.connectedCallback();
        document.addEventListener('keyup', (e: KeyboardEvent) => {
            if (e.key == 'Escape') this.destroy();
        });

        document.addEventListener('wheel', (e: WheelEvent) => this.scrollWheel(e));
    }

    override render() {
        return renderLanguageSwitcher.call(this);
    }

    move(direction: 'up' | 'down') {
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

    scrollWheel(event: WheelEvent) {
        var direction = (event as WheelEvent & { wheelDelta: number }).wheelDelta < 0 ? ('up' as const) : ('down' as const);
        var parentRect = this.shadowRoot?.querySelector('#language-switcher-overlay')?.getBoundingClientRect();
        if (!parentRect) return;
        return this.move(direction);
    }

    confirm() {
        this.resolve(this.language);
        this.destroy();
    }

    destroy() {
        this.resolve(null!);
        this.classList.toggle('destroyed', true);
        setTimeout(() => {
            this.remove();
        }, 500);
    }
}
