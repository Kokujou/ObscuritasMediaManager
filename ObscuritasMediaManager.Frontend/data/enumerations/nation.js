import { css, unsafeCSS } from '../../exports.js';
import { Nation } from '../../obscuritas-media-manager-backend-client.js';
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

export function renderLanguageFlags() {
    return css`
        .${unsafeCSS(Nation.Japanese)} {
            ${renderBackgroundImage(japanFlag())};
        }

        .${unsafeCSS(Nation.German)} {
            ${renderBackgroundImage(germanFlag())};
        }

        .${unsafeCSS(Nation.English)} {
            ${renderBackgroundImage(englishFlag())};
        }

        .${unsafeCSS(Nation.Spain)} {
            ${renderBackgroundImage(spainFlag())};
        }

        .${unsafeCSS(Nation.Italian)} {
            ${renderBackgroundImage(italyFlag())};
        }

        .${unsafeCSS(Nation.Chinese)} {
            ${renderBackgroundImage(chinaFlag())};
        }

        .${unsafeCSS(Nation.SouthAmerican)} {
            ${renderBackgroundImage(southAmericaFlag())};
        }

        .${unsafeCSS(Nation.African)} {
            ${renderBackgroundImage(africaFlag())};
        }

        .${unsafeCSS(Nation.Russian)} {
            ${renderBackgroundImage(russiaFlag())};
        }
    `;
}
