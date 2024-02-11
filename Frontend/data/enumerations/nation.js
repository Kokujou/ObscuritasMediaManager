import { css, unsafeCSS } from '../../exports.js';
import { Language } from '../../obscuritas-media-manager-backend-client.js';
import { africaFlag } from '../../resources/inline-icons/language-icons/africa-flag.svg.js';
import { chinaFlag } from '../../resources/inline-icons/language-icons/china-flag.svg.js';
import { englishFlag } from '../../resources/inline-icons/language-icons/english-flag.svg.js';
import { germanFlag } from '../../resources/inline-icons/language-icons/german-flag.svg.js';
import { italyFlag } from '../../resources/inline-icons/language-icons/italy-flag.svg.js';
import { japanFlag } from '../../resources/inline-icons/language-icons/japan-flag.svg.js';
import { koreaFlag } from '../../resources/inline-icons/language-icons/korea-flag.svg.js';
import { noLanguageIcon } from '../../resources/inline-icons/language-icons/no-language.svg.js';
import { russiaFlag } from '../../resources/inline-icons/language-icons/russia-flag.svg.js';
import { southAmericaFlag } from '../../resources/inline-icons/language-icons/south-america-flag.svg.js';
import { spainFlag } from '../../resources/inline-icons/language-icons/spain-flag.svg.js';
import { renderBackgroundImage } from '../../services/extensions/style.extensions.js';

export function renderLanguageFlags() {
    return css`
        [language=${unsafeCSS(Language.Japanese)}],[nation=${unsafeCSS(Language.Japanese)}] {
            ${renderBackgroundImage(japanFlag())};
        }

        [language=${unsafeCSS(Language.German)}] ,[nation=${unsafeCSS(Language.German)}] {
            ${renderBackgroundImage(germanFlag())};
        }

        [language=${unsafeCSS(Language.English)}],[nation=${unsafeCSS(Language.English)}] {
            ${renderBackgroundImage(englishFlag())};
        }

        [language=${unsafeCSS(Language.Spain)}],[nation=${unsafeCSS(Language.Spain)}] {
            ${renderBackgroundImage(spainFlag())};
        }

        [language=${unsafeCSS(Language.Italian)}] ,[nation=${unsafeCSS(Language.Italian)}] {
            ${renderBackgroundImage(italyFlag())};
        }

        [language=${unsafeCSS(Language.Chinese)}] ,[nation=${unsafeCSS(Language.Chinese)}] {
            ${renderBackgroundImage(chinaFlag())};
        }

        [language=${unsafeCSS(Language.SouthAmerican)}],[nation=${unsafeCSS(Language.SouthAmerican)}] {
            ${renderBackgroundImage(southAmericaFlag())};
        }

        [language=${unsafeCSS(Language.African)}] ,[nation=${unsafeCSS(Language.African)}] {
            ${renderBackgroundImage(africaFlag())};
        }

        [language=${unsafeCSS(Language.Russian)}] ,[nation=${unsafeCSS(Language.Russian)}] {
            ${renderBackgroundImage(russiaFlag())};
        }

        [language=${unsafeCSS(Language.Unset)}] ,[nation=${unsafeCSS(Language.Unset)}] {
            ${renderBackgroundImage(noLanguageIcon())};
        }

        [language=${unsafeCSS(Language.Korean)}] ,[nation=${unsafeCSS(Language.Korean)}] {
            ${renderBackgroundImage(koreaFlag())};
        }
    `;
}
