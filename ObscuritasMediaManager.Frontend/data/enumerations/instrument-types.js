import { css, unsafeCSS } from '../../exports.js';
import { InstrumentType } from '../../obscuritas-media-manager-backend-client.js';
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

export function renderInstrumentTypeIcons(parentSelector) {
    return css`
        ${unsafeCSS(parentSelector)}.${unsafeCSS(InstrumentType.Unset)} {
            ${renderMaskImage(unsetIcon())};
        }

        ${unsafeCSS(parentSelector)}.${unsafeCSS(InstrumentType.Vocal)} {
            ${renderMaskImage(microphoneIcon())};
        }

        ${unsafeCSS(parentSelector)}.${unsafeCSS(InstrumentType.Brass)} {
            ${renderMaskImage(brassIcon())};
        }

        ${unsafeCSS(parentSelector)}.${unsafeCSS(InstrumentType.WoodWind)} {
            ${renderMaskImage(woodWindIcon())};
        }

        ${unsafeCSS(parentSelector)}.${unsafeCSS(InstrumentType.Keyboard)} {
            ${renderMaskImage(keyboardIcon())};
        }

        ${unsafeCSS(parentSelector)}.${unsafeCSS(InstrumentType.Electronic)} {
            ${renderMaskImage(electronicIcon())};
        }

        ${unsafeCSS(parentSelector)}.${unsafeCSS(InstrumentType.Percussion)} {
            ${renderMaskImage(percussionIcon())};
        }

        ${unsafeCSS(parentSelector)}.${unsafeCSS(InstrumentType.Stringed)} {
            ${renderMaskImage(stringsIcon())};
        }

        ${unsafeCSS(parentSelector)}.${unsafeCSS(InstrumentType.HumanBody)} {
            ${renderMaskImage(humanBodyIcon())};
        }

        ${unsafeCSS(parentSelector)}.${unsafeCSS(InstrumentType.Miscellaneous)} {
            ${renderMaskImage(miscIcon())};
        }
    `;
}
