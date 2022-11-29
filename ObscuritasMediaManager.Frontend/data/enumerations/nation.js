import { css, unsafeCSS } from '../../exports.js';
import { Nation } from '../../obscuritas-media-manager-backend-client.js';
import { africaFlag } from '../../resources/icons/language-icons/africa-flag.svg.js';
import { chinaFlag } from '../../resources/icons/language-icons/china-flag.svg.js';
import { englishFlag } from '../../resources/icons/language-icons/english-flag.svg.js';
import { germanFlag } from '../../resources/icons/language-icons/german-flag.svg.js';
import { italyFlag } from '../../resources/icons/language-icons/italy-flag.svg.js';
import { japanFlag } from '../../resources/icons/language-icons/japan-flag.svg.js';
import { noLanguageIcon } from '../../resources/icons/language-icons/no-language.svg.js';
import { russiaFlag } from '../../resources/icons/language-icons/russia-flag.svg.js';
import { southAmericaFlag } from '../../resources/icons/language-icons/south-america-flag.svg.js';
import { spainFlag } from '../../resources/icons/language-icons/spain-flag.svg.js';
import { renderBackgroundImage } from '../../services/extensions/style.extensions.js';

export function renderLanguageFlags() {
    return css`
        [language=${unsafeCSS(Nation.Japanese)}],[nation=${unsafeCSS(Nation.Japanese)}] {
            ${renderBackgroundImage(japanFlag())};
        }

        [language=${unsafeCSS(Nation.German)}] ,[nation=${unsafeCSS(Nation.German)}] {
            ${renderBackgroundImage(germanFlag())};
        }

        [language=${unsafeCSS(Nation.English)}],[nation=${unsafeCSS(Nation.English)}] {
            ${renderBackgroundImage(englishFlag())};
        }

        [language=${unsafeCSS(Nation.Spain)}],[nation=${unsafeCSS(Nation.Spain)}] {
            ${renderBackgroundImage(spainFlag())};
        }

        [language=${unsafeCSS(Nation.Italian)}] ,[nation=${unsafeCSS(Nation.Italian)}] {
            ${renderBackgroundImage(italyFlag())};
        }

        [language=${unsafeCSS(Nation.Chinese)}] ,[nation=${unsafeCSS(Nation.Chinese)}] {
            ${renderBackgroundImage(chinaFlag())};
        }

        [language=${unsafeCSS(Nation.SouthAmerican)}],[nation=${unsafeCSS(Nation.SouthAmerican)}] {
            ${renderBackgroundImage(southAmericaFlag())};
        }

        [language=${unsafeCSS(Nation.African)}] ,[nation=${unsafeCSS(Nation.African)}] {
            ${renderBackgroundImage(africaFlag())};
        }

        [language=${unsafeCSS(Nation.Russian)}] ,[nation=${unsafeCSS(Nation.Russian)}] {
            ${renderBackgroundImage(russiaFlag())};
        }

        [language=${unsafeCSS(Nation.Unset)}] ,[nation=${unsafeCSS(Nation.Unset)}] {
            ${renderBackgroundImage(noLanguageIcon())};
        }
    `;
}
