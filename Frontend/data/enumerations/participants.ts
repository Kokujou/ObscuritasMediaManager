import { css, unsafeCSS } from 'lit-element';
import { renderMaskImage } from '../../extensions/style.extensions';
import { Participants } from '../../obscuritas-media-manager-backend-client';
import { unsetIcon } from '../../resources/inline-icons/general/unset-icon.svg';
import { largeGroupIcon } from '../../resources/inline-icons/participants-icons/large-group.svg';
import { largeOrchestraIcon } from '../../resources/inline-icons/participants-icons/large-orchestra.svg';
import { singlePersonIcon } from '../../resources/inline-icons/participants-icons/single-person.svg';
import { smalLGroupIcon } from '../../resources/inline-icons/participants-icons/small-group.svg';
import { smallOrchestraIcon } from '../../resources/inline-icons/participants-icons/small-orchestra-svg';

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
