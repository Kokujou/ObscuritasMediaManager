import { unsafeCSS } from '../../../exports.js';
import { TargetGroup } from '../../../obscuritas-media-manager-backend-client.js';
import { renderMaskImage } from '../../../services/extensions/style.extensions.js';
import { crossIcon } from '../../inline-icons/general/cross-icon.svg.js';

export function registerTargetGroups() {
    return unsafeCSS(`
        *[target-group] {
            ${renderMaskImage(crossIcon())};
        }

        ${Object.values(TargetGroup).map(
            (group) => `
                *[target-group='${group}'] {
                    mask: url('${getTargetGroupIconPath(group)}') 100% 100% / 100% 100%;
                }
            `
        )}
    `);
}

/**
 * @param {TargetGroup} group
 */
function getTargetGroupIconPath(group) {
    switch (group) {
        case TargetGroup.Children:
            return '/resources/icons/target-groups/children.png';
        case TargetGroup.Adolescents:
            return '/resources/icons/target-groups/adolescents.png';
        case TargetGroup.Adults:
            return '/resources/icons/target-groups/adults.png';
        case TargetGroup.Families:
            return '/resources/icons/target-groups/family.png';
        case TargetGroup.Men:
            return '/resources/icons/target-groups/male.png';
        case TargetGroup.Women:
            return '/resources/icons/target-groups/female.png';
    }
}
