import { html } from 'lit-element';
import { Language } from '../../obscuritas-media-manager-backend-client';
import { Icons } from '../../resources/inline-icons/icon-registry';
import { LanguageSwitcher } from './language-switcher';

export function renderLanguageSwitcher(this: LanguageSwitcher) {
    var smallestParentSize = this.parentElement?.offsetWidth ?? 0;
    if (this.parentElement && this.parentElement.offsetWidth > this.parentElement.offsetHeight)
        smallestParentSize = this.parentElement.offsetHeight;
    return html`
        <style>
            #language-switcher-overlay {
                width: ${smallestParentSize}px;
                height: ${smallestParentSize}px;
            }
        </style>
        <div id="language-switcher-overlay">
            ${renderLanguageWheel.call(this, smallestParentSize)}
            <div id="confirm-button" @click="${this.confirm}">
                <div id="confirm-icon" icon="${Icons.SaveTick}"></div>
            </div>
            <div id="close-button" @click="${this.destroy}">&times;</div>
        </div>
    `;
}

function renderLanguageWheel(this: LanguageSwitcher, size: number) {
    var allLanguages = Object.keys(Language);
    var selectedIndex = Object.keys(Language).indexOf(this.language);
    return html`
        ${allLanguages.map((targetLangauge, index) => {
            var rotation = (360 / allLanguages.length) * index - this.languageRotationOffset;
            var styles = `transform: rotateY(${rotation}deg) `;
            styles += `translate3d(100%, -50%, ${size / 2}px) `;
            if (index == selectedIndex) styles += 'scale(2)';
            return html`<div
                language="${targetLangauge}"
                class="icon"
                ?main="${targetLangauge == this.language}"
                .style="${styles}"
            ></div>`;
        })}
    `;
}
