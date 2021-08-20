import { css } from '../../exports.js';
import { africaFlag } from '../../resources/icons/language-icons/africa-flag.svg.js';
import { chinaFlag } from '../../resources/icons/language-icons/china-flag.svg.js';
import { englishFlag } from '../../resources/icons/language-icons/english-flag.svg.js';
import { germanFlag } from '../../resources/icons/language-icons/german-flag.svg.js';
import { italyFlag } from '../../resources/icons/language-icons/italy-flag.svg.js';
import { japanFlag } from '../../resources/icons/language-icons/japan-flag.svg.js';
import { russiaFlag } from '../../resources/icons/language-icons/russia-flag.svg.js';
import { southAmericaFlag } from '../../resources/icons/language-icons/south-america-flag.svg.js';
import { spainFlag } from '../../resources/icons/language-icons/spain-flag.svg.js';
import { renderBackgroundImage } from '../../services/extensions/style.extensions.js';

/** @enum {string} */
export const Nation = {
    Japanese: 'japanese',
    English: 'english',
    German: 'german',
    Spain: 'spain',
    Chinese: 'chinese',
    Italian: 'italian',
    Russian: 'russian',
    SouthAmerican: 'southAmerican',
    African: 'african',
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

        .spain {
            ${renderBackgroundImage(spainFlag())};
        }

        .italian {
            ${renderBackgroundImage(italyFlag())};
        }

        .chinese {
            ${renderBackgroundImage(chinaFlag())};
        }

        .southAmerican {
            ${renderBackgroundImage(southAmericaFlag())};
        }

        .african {
            ${renderBackgroundImage(africaFlag())};
        }

        .russian {
            ${renderBackgroundImage(russiaFlag())};
        }
    `;
}
