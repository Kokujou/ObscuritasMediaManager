import { css, unsafeCSS } from 'lit-element';
import { InstrumentType } from '../../obscuritas-media-manager-backend-client';
import { unsetIcon } from '../../resources/inline-icons/general/unset-icon.svg';
import { brassIcon } from '../../resources/inline-icons/instrument-icons/brass-icon.svg';
import { electronicIcon } from '../../resources/inline-icons/instrument-icons/electronic-icon.svg';
import { humanBodyIcon } from '../../resources/inline-icons/instrument-icons/human-body-icon.svg';
import { keyboardIcon } from '../../resources/inline-icons/instrument-icons/keyboard-icon.svg';
import { microphoneIcon } from '../../resources/inline-icons/instrument-icons/microphone-icon.svg';
import { miscIcon } from '../../resources/inline-icons/instrument-icons/misc-icon.svg';
import { percussionIcon } from '../../resources/inline-icons/instrument-icons/percussion-icon.svg';
import { stringsIcon } from '../../resources/inline-icons/instrument-icons/string-icon.svg';
import { woodWindIcon } from '../../resources/inline-icons/instrument-icons/wood-wind-icon.svg';
import { renderMaskImage } from '../../services/extensions/style.extensions';

export function renderInstrumentTypeIcons() {
    return css`
        *[instrument-type='${unsafeCSS(InstrumentType.Unset)}'] {
            ${renderMaskImage(unsetIcon())};
        }

        *[instrument-type='${unsafeCSS(InstrumentType.Vocal)}'] {
            ${renderMaskImage(microphoneIcon())};
        }

        *[instrument-type='${unsafeCSS(InstrumentType.Brass)}'] {
            ${renderMaskImage(brassIcon())};
        }

        *[instrument-type='${unsafeCSS(InstrumentType.WoodWind)}'] {
            ${renderMaskImage(woodWindIcon())};
        }

        *[instrument-type='${unsafeCSS(InstrumentType.Keyboard)}'] {
            ${renderMaskImage(keyboardIcon())};
        }

        *[instrument-type='${unsafeCSS(InstrumentType.Electronic)}'] {
            ${renderMaskImage(electronicIcon())};
        }

        *[instrument-type='${unsafeCSS(InstrumentType.Percussion)}'] {
            ${renderMaskImage(percussionIcon())};
        }

        *[instrument-type='${unsafeCSS(InstrumentType.Stringed)}'] {
            ${renderMaskImage(stringsIcon())};
        }

        *[instrument-type='${unsafeCSS(InstrumentType.HumanBody)}'] {
            ${renderMaskImage(humanBodyIcon())};
        }

        *[instrument-type='${unsafeCSS(InstrumentType.Miscellaneous)}'] {
            ${renderMaskImage(miscIcon())};
        }
    `;
}
