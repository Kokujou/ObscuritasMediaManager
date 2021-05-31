import { css, unsafeCSS } from '../../exports.js';
import { unsetIcon } from '../../resources/icons/general/unset-icon.svg.js';
import { brassIcon } from '../../resources/icons/instrument-icons/brass-icon.svg.js';
import { electronicIcon } from '../../resources/icons/instrument-icons/electronic-icon.svg.js';
import { keyboardIcon } from '../../resources/icons/instrument-icons/keyboard-icon.svg.js';
import { microphoneIcon } from '../../resources/icons/instrument-icons/microphone-icon.svg.js';
import { percussionIcon } from '../../resources/icons/instrument-icons/percussion-icon.svg.js';
import { stringsIcon } from '../../resources/icons/instrument-icons/string-icon.svg.js';
import { woodWindIcon } from '../../resources/icons/instrument-icons/wood-wind-icon.svg.js';
import { renderMaskImage } from '../../services/extensions/style.extensions.js';

/** @enum {string} */
export const InstrumentTypes = {
    Unset: 'unset',
    Vocal: 'vocal',
    WoodWind: 'wood-wind',
    Brass: 'brass',
    Percussion: 'percussion',
    Stringed: 'stringed',
    Keyboard: 'keyboard',
    Electronic: 'electronic',
};

export function renderInstrumentTypeIcons(parentSelector) {
    return css`
        ${unsafeCSS(parentSelector)}.unset {
            ${renderMaskImage(unsetIcon())};
        }

        ${unsafeCSS(parentSelector)}.vocal {
            ${renderMaskImage(microphoneIcon())};
        }

        ${unsafeCSS(parentSelector)}.brass {
            ${renderMaskImage(brassIcon())};
        }

        ${unsafeCSS(parentSelector)}.wood-wind {
            ${renderMaskImage(woodWindIcon())};
        }

        ${unsafeCSS(parentSelector)}.keyboard {
            ${renderMaskImage(keyboardIcon())};
        }

        ${unsafeCSS(parentSelector)}.electronic {
            ${renderMaskImage(electronicIcon())};
        }

        ${unsafeCSS(parentSelector)}.percussion {
            ${renderMaskImage(percussionIcon())};
        }

        ${unsafeCSS(parentSelector)}.stringed {
            ${renderMaskImage(stringsIcon())};
        }
    `;
}
