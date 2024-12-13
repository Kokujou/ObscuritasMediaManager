import { unsafeCSS } from 'lit-element';
import { TargetGroup } from '../../../obscuritas-media-manager-backend-client';
import { renderMaskImage } from '../../../services/extensions/style.extensions';
import { crossIcon } from '../../inline-icons/general/cross-icon.svg';

export function registerTargetGroups() {
    return unsafeCSS(`
        *[target-group] {
            ${renderMaskImage(crossIcon())}
        }

        ${Object.values(TargetGroup)
            .map(
                (group) => `
                *[target-group="${group}"] {
                    mask: url('${getTargetGroupIconPath(group)}') 100% 100% / 100% 100%;
                }
            `
            )
            .join('\n\n')}
    `);
}

function getTargetGroupIconPath(group: TargetGroup) {
    switch (group) {
        case TargetGroup.Children:
            return './resources/icons/target-groups/children.png';
        case TargetGroup.Adolescents:
            return './resources/icons/target-groups/adolescents.png';
        case TargetGroup.Adults:
            return './resources/icons/target-groups/adults.png';
        case TargetGroup.Families:
            return './resources/icons/target-groups/family.png';
        case TargetGroup.Men:
            return './resources/icons/target-groups/male.png';
        case TargetGroup.Women:
            return './resources/icons/target-groups/female.png';
    }
}
