import { css } from '../../exports.js';
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
    Vocal: 'vocal',
    WoodWind: 'wood-wind',
    Brass: 'brass',
    Percussion: 'percussion',
    Stringed: 'stringed',
    Keyboard: 'keyboard',
    Electronic: 'electronic',
};

export function renderInstrumentTypeIcons() {
    return css`
        .vocal {
            ${renderMaskImage(microphoneIcon())};
        }

        .brass {
            ${renderMaskImage(brassIcon())};
        }

        .wood-wind {
            ${renderMaskImage(woodWindIcon())};
        }

        .keyboard {
            ${renderMaskImage(keyboardIcon())};
        }

        .electronic {
            ${renderMaskImage(electronicIcon())};
        }

        .percussion {
            ${renderMaskImage(percussionIcon())};
        }

        .stringed {
            ${renderMaskImage(stringsIcon())};
        }
    `;
}
