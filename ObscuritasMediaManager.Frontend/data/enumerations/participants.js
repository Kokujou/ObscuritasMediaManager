import { css, unsafeCSS } from '../../exports.js';
import { unsetIcon } from '../../resources/icons/general/unset-icon.svg.js';
import { largeGroupIcon } from '../../resources/icons/participants-icons/large-group.svg.js';
import { largeOrchestraIcon } from '../../resources/icons/participants-icons/large-orchestra.svg.js';
import { singlePersonIcon } from '../../resources/icons/participants-icons/single-person.svg.js';
import { smalLGroupIcon } from '../../resources/icons/participants-icons/small-group.svg.js';
import { smallOrchestraIcon } from '../../resources/icons/participants-icons/small-orchestra-svg.js';
import { renderMaskImage } from '../../services/extensions/style.extensions.js';

/** @enum {string} */
export const Participants = {
    Unset: 'unset',
    Solo: 'solo',
    SmallGroup: 'smallGroup',
    LargeGroup: 'largeGroup',
    SmallOrchestra: 'smallOrchestra',
    LargeOrchestra: 'largeOrchestra',
};

export function renderParticipantCountIcon(parentSelector) {
    return css`
        ${unsafeCSS(parentSelector)}.${unsafeCSS(Participants.Unset)} {
            ${renderMaskImage(unsetIcon())};
        }

        ${unsafeCSS(parentSelector)}.${unsafeCSS(Participants.Solo)} {
            ${renderMaskImage(singlePersonIcon())};
        }
        ${unsafeCSS(parentSelector)}.${unsafeCSS(Participants.SmallGroup)} {
            ${renderMaskImage(smalLGroupIcon())};
        }
        ${unsafeCSS(parentSelector)}.${unsafeCSS(Participants.LargeGroup)} {
            ${renderMaskImage(largeGroupIcon())};
        }
        ${unsafeCSS(parentSelector)}.${unsafeCSS(Participants.SmallOrchestra)} {
            ${renderMaskImage(smallOrchestraIcon())};
        }
        ${unsafeCSS(parentSelector)}.${unsafeCSS(Participants.LargeOrchestra)} {
            ${renderMaskImage(largeOrchestraIcon())};
        }
    `;
}
