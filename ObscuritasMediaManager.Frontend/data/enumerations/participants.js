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
    Solo: 'solo',
    SmallGroup: 'small-group',
    LargeGroup: 'large-group',
    SmallOrchestra: 'small-orchestra',
    LargeOrchestra: 'large-orchestra',
};

export function renderParticipantCountIcon(parentSelector) {
    return css`
        ${unsafeCSS(parentSelector)}.unset {
            ${renderMaskImage(unsetIcon())};
        }

        ${unsafeCSS(parentSelector)}.solo {
            ${renderMaskImage(singlePersonIcon())};
        }
        ${unsafeCSS(parentSelector)}.small-group {
            ${renderMaskImage(smalLGroupIcon())};
        }
        ${unsafeCSS(parentSelector)}.large-group {
            ${renderMaskImage(largeGroupIcon())};
        }
        ${unsafeCSS(parentSelector)}.small-orchestra {
            ${renderMaskImage(smallOrchestraIcon())};
        }
        ${unsafeCSS(parentSelector)}.large-orchestra {
            ${renderMaskImage(largeOrchestraIcon())};
        }
    `;
}
