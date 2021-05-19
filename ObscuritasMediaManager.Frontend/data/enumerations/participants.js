import { css } from '../../exports.js';
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

export function renderParticipantCountIcon() {
    return css`
        .solo {
            ${renderMaskImage(singlePersonIcon())};
        }
        .small-group {
            ${renderMaskImage(smalLGroupIcon())};
        }
        .large-group {
            ${renderMaskImage(largeGroupIcon())};
        }
        .small-orchestra {
            ${renderMaskImage(smallOrchestraIcon())};
        }
        .large-orchestra {
            ${renderMaskImage(largeOrchestraIcon())};
        }
    `;
}
