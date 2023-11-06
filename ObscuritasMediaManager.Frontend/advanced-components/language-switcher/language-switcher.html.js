import { html } from '../../exports.js';
import { Nation } from '../../obscuritas-media-manager-backend-client.js';
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
        <div id="language-switcher-overlay" @wheel="${languageSwitcher.scrollWheel}">
            ${renderLanguageWheel(languageSwitcher, smallestParentSize)}
            ${renderNationWheel(languageSwitcher, smallestParentSize)}
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
    var allLanguages = Object.keys(Nation);
    var selectedIndex = Object.keys(Nation).indexOf(languageSwitcher.language);
    return html` <div id="language-part" class="part">
        ${allLanguages.map((targetLangauge, index) => {
            var rotation = (360 / allLanguages.length) * index - languageSwitcher.languageRotationOffset;
            var styles = `transform: rotate(${rotation}deg) `;
            styles += `translateX(${size / 4}px) `;
            if (index == selectedIndex) styles += 'scale(2)';
            styles += `translateX(${size / 8 - 20}px) `;
            styles += `rotate(${-rotation}deg) `;
            return html`<div
                language="${targetLangauge}"
                class="icon"
                ?main="${targetLangauge == languageSwitcher.language}"
                .style="${styles}"
            ></div>`;
        })}
    </div>`;
}

/**
 * @param {LanguageSwitcher} languageSwitcher
 * @param {number} size
 */
function renderNationWheel(languageSwitcher, size) {
    var allLanguages = Object.keys(Nation);
    var selectedIndex = Object.keys(Nation).indexOf(languageSwitcher.nation);
    return html` <div id="nation-part" class="part">
        ${allLanguages.map((targetLangauge, index) => {
            var rotation = (360 / allLanguages.length) * index - languageSwitcher.nationRotationOffset;
            var styles = `transform: rotate(${rotation}deg) `;
            styles += `translateX(${size / 4}px)`;
            if (index == selectedIndex) styles += 'scale(2)';
            styles += `translateX(${size / 8 - 20}px)`;
            styles += `rotate(${-rotation}deg) scaleX(-1) `;
            return html`<div
                language="${targetLangauge}"
                class="icon"
                ?main="${targetLangauge == languageSwitcher.nation}"
                .style="${styles}"
            ></div>`;
        })}
    </div>`;
}
