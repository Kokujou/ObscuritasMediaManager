import { css, unsafeCSS } from '../../exports.js';
import { Participants } from '../../obscuritas-media-manager-backend-client.js';
import { unsetIcon } from '../../resources/inline-icons/general/unset-icon.svg.js';
import { largeGroupIcon } from '../../resources/inline-icons/participants-icons/large-group.svg.js';
import { largeOrchestraIcon } from '../../resources/inline-icons/participants-icons/large-orchestra.svg.js';
import { singlePersonIcon } from '../../resources/inline-icons/participants-icons/single-person.svg.js';
import { smalLGroupIcon } from '../../resources/inline-icons/participants-icons/small-group.svg.js';
import { smallOrchestraIcon } from '../../resources/inline-icons/participants-icons/small-orchestra-svg.js';
import { renderMaskImage } from '../../services/extensions/style.extensions.js';

export function renderParticipantCountIcon() {
    return css`
        [participants='${unsafeCSS(Participants.Unset)}'] {
            ${renderMaskImage(unsetIcon())};
        }
        [participants='${unsafeCSS(Participants.Solo)}'] {
            ${renderMaskImage(singlePersonIcon())};
        }
        [participants='${unsafeCSS(Participants.SmallGroup)}'] {
            ${renderMaskImage(smalLGroupIcon())};
        }
        [participants='${unsafeCSS(Participants.LargeGroup)}'] {
            ${renderMaskImage(largeGroupIcon())};
        }
        [participants='${unsafeCSS(Participants.SmallOrchestra)}'] {
            ${renderMaskImage(smallOrchestraIcon())};
        }
        [participants='${unsafeCSS(Participants.LargeOrchestra)}'] {
            ${renderMaskImage(largeOrchestraIcon())};
        }
    `;
}
