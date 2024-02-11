import { html } from '../../exports.js';
import { Language } from '../../obscuritas-media-manager-backend-client.js';
import { Icons } from '../../resources/inline-icons/icon-registry.js';
import { LanguageSwitcher } from './language-switcher.js';

/**
 * @param {LanguageSwitcher} languageSwitcher
 */
export function renderLanguageSwitcher(languageSwitcher) {
    var smallestParentSize = languageSwitcher.parentElement?.offsetWidth ?? 0;
    if (
        languageSwitcher.parentElement &&
        languageSwitcher.parentElement.offsetWidth > languageSwitcher.parentElement.offsetHeight
    )
        smallestParentSize = languageSwitcher.parentElement.offsetHeight;
    return html`
        <style>
            #language-switcher-overlay {
                width: ${smallestParentSize}px;
                height: ${smallestParentSize}px;
            }
        </style>
        <div id="language-switcher-overlay">
            ${renderLanguageWheel(languageSwitcher, smallestParentSize)}
            <div id="confirm-button" @click="${languageSwitcher.confirm}">
                <div id="confirm-icon" icon="${Icons.SaveTick}"></div>
            </div>
            <div id="close-button" @click="${languageSwitcher.destroy}">&times;</div>
        </div>
    `;
}

/**
 * @param {LanguageSwitcher} languageSwitcher
 * @param {number} size
 */
function renderLanguageWheel(languageSwitcher, size) {
    var allLanguages = Object.keys(Language);
    var selectedIndex = Object.keys(Language).indexOf(languageSwitcher.language);
    return html`
        ${allLanguages.map((targetLangauge, index) => {
            var rotation = (360 / allLanguages.length) * index - languageSwitcher.languageRotationOffset;
            var styles = `transform: rotateY(${rotation}deg) `;
            styles += `translate3d(100%, -50%, ${size / 2}px) `;
            if (index == selectedIndex) styles += 'scale(2)';
            return html`<div
                language="${targetLangauge}"
                class="icon"
                ?main="${targetLangauge == languageSwitcher.language}"
                .style="${styles}"
            ></div>`;
        })}
    `;
}
