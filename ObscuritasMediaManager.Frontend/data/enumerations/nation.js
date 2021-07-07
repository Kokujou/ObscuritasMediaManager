import { css } from '../../exports.js';
import { englishFlag } from '../../resources/icons/language-icons/english-flag.svg.js';
import { germanFlag } from '../../resources/icons/language-icons/german-flag.svg.js';
import { japanFlag } from '../../resources/icons/language-icons/japan-flag.svg.js';
import { renderBackgroundImage } from '../../services/extensions/style.extensions.js';

/** @enum {string} */
export const Nation = {
    Japanese: 'japanese',
    English: 'english',
    German: 'german',
};

export function renderLanguageFlags() {
    return css`
        .japanese {
            ${renderBackgroundImage(japanFlag())};
        }

        .german {
            ${renderBackgroundImage(germanFlag())};
        }

        .english {
            ${renderBackgroundImage(englishFlag())};
        }
    `;
}
