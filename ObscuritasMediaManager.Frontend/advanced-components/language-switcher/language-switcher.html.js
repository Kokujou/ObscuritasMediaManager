import { html } from '../../exports.js';
import { Nation } from '../../obscuritas-media-manager-backend-client.js';
import { IconRegistry } from '../../resources/icons/icon-registry.js';
import { LanguageSwitcher } from './language-switcher.js';

/**
 * @param {LanguageSwitcher} languageSwitcher
 */
export function renderLanguageSwitcher(languageSwitcher) {
    var smallestParentSize = languageSwitcher.parentElement.offsetWidth;
    if (languageSwitcher.parentElement.offsetWidth > languageSwitcher.parentElement.offsetHeight)
        smallestParentSize = languageSwitcher.parentElement.offsetHeight;
    return html`
        <style>
            #language-switcher-overlay {
                width: ${smallestParentSize}px;
                height: ${smallestParentSize}px;
            }
        </style>
        <div id="language-switcher-overlay">
            <div class="${IconRegistry.ArrowIcon}" id="left-arrow" @click="${() => languageSwitcher.rotateBackward()}"></div>
            <div id="blocked-area">
                ${Object.values(Nation).map(
                    (nation, index) =>
                        html`
                            <div
                                class="language-selector-icon ${nation}"
                                @click="${() => languageSwitcher.changeLanguage(index)}"
                            ></div>
                        `
                )}
            </div>

            <div
                id="selected-language"
                class="${languageSwitcher.language}"
                @click="${() => languageSwitcher.notifyLanguageChanged()}"
            ></div>

            <div class="${IconRegistry.ArrowIcon}" id="right-arrow" @click="${() => languageSwitcher.rotateForward()}"></div>
        </div>
    `;
}
