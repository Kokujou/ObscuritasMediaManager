import { Nation } from '../../data/enumerations/nation.js';
import { html } from '../../exports.js';
import { LanguageSwitcher } from './language-switcher.js';

/**
 * @param {LanguageSwitcher} languageSwitcher
 */
export function renderLanguageSwitcher(languageSwitcher) {
    return html`
        <div id="language-switcher-overlay">
            <div id="left-arrow" @click="${() => languageSwitcher.rotateBackward()}"></div>
            <div id="blocked-area">
                ${Object.values(Nation).map(
                    (nation, index) =>
                        html`
                            <div class="language-selector-icon ${nation}" @click="${() => languageSwitcher.changeLanguage(index)}"></div>
                        `
                )}
            </div>

            <div id="selected-language" class="${languageSwitcher.language}"></div>

            <div id="right-arrow" @click="${() => languageSwitcher.rotateForward()}"></div>
        </div>
    `;
}
