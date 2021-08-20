import { css, unsafeCSS } from '../../exports.js';
import { unsetIcon } from '../../resources/icons/general/unset-icon.svg.js';
import { brassIcon } from '../../resources/icons/instrument-icons/brass-icon.svg.js';
import { electronicIcon } from '../../resources/icons/instrument-icons/electronic-icon.svg.js';
import { humanBodyIcon } from '../../resources/icons/instrument-icons/human-body-icon.svg.js';
import { keyboardIcon } from '../../resources/icons/instrument-icons/keyboard-icon.svg.js';
import { microphoneIcon } from '../../resources/icons/instrument-icons/microphone-icon.svg.js';
import { miscIcon } from '../../resources/icons/instrument-icons/misc-icon.svg.js';
import { percussionIcon } from '../../resources/icons/instrument-icons/percussion-icon.svg.js';
import { stringsIcon } from '../../resources/icons/instrument-icons/string-icon.svg.js';
import { woodWindIcon } from '../../resources/icons/instrument-icons/wood-wind-icon.svg.js';
import { renderMaskImage } from '../../services/extensions/style.extensions.js';

/** @enum {string} */
export const InstrumentTypes = {
    Unset: 'unset',
    Vocal: 'vocal',
    WoodWind: 'woodWind',
    Brass: 'brass',
    Percussion: 'percussion',
    Stringed: 'stringed',
    Keyboard: 'keyboard',
    Electronic: 'electronic',
    HumanBody: 'humanBody',
    Miscellaneous: 'miscellaneous',
};

export function renderInstrumentTypeIcons(parentSelector) {
    return css`
        ${unsafeCSS(parentSelector)}.${unsafeCSS(InstrumentTypes.Unset)} {
            ${renderMaskImage(unsetIcon())};
        }

        ${unsafeCSS(parentSelector)}.${unsafeCSS(InstrumentTypes.Vocal)} {
            ${renderMaskImage(microphoneIcon())};
        }

        ${unsafeCSS(parentSelector)}.${unsafeCSS(InstrumentTypes.Brass)} {
            ${renderMaskImage(brassIcon())};
        }

        ${unsafeCSS(parentSelector)}.${unsafeCSS(InstrumentTypes.WoodWind)} {
            ${renderMaskImage(woodWindIcon())};
        }

        ${unsafeCSS(parentSelector)}.${unsafeCSS(InstrumentTypes.Keyboard)} {
            ${renderMaskImage(keyboardIcon())};
        }

        ${unsafeCSS(parentSelector)}.${unsafeCSS(InstrumentTypes.Electronic)} {
            ${renderMaskImage(electronicIcon())};
        }

        ${unsafeCSS(parentSelector)}.${unsafeCSS(InstrumentTypes.Percussion)} {
            ${renderMaskImage(percussionIcon())};
        }

        ${unsafeCSS(parentSelector)}.${unsafeCSS(InstrumentTypes.Stringed)} {
            ${renderMaskImage(stringsIcon())};
        }

        ${unsafeCSS(parentSelector)}.${unsafeCSS(InstrumentTypes.HumanBody)} {
            ${renderMaskImage(humanBodyIcon())};
        }

        ${unsafeCSS(parentSelector)}.${unsafeCSS(InstrumentTypes.Miscellaneous)} {
            ${renderMaskImage(miscIcon())};
        }
    `;
}
