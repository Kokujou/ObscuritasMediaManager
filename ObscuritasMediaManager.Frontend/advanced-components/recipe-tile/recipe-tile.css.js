import { renderLanguageFlags } from '../../data/enumerations/nation.js';
import { css } from '../../exports.js';

export function renderRecipeTileStyles() {
    return css`
        #content {
        }

        #image-container {
            position: relative;
            width: 100%;
            height: 100%;
        }

        #image {
            position: absolute;
            inset: 0;
        }

        #rating {
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
        }

        #difficulty {
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
        }

        .icon {
            position: absolute;
            width: 40px;
            height: 40px;
            background: gray;
        }

        #nation-icon {
            top: 10px;
            right: 10px;
        }

        #technique-icon {
            top: 60px;
            right: 10px;
        }
        #ingredient-icon {
            top: 110px;
            right: 10px;
        }
        #course-icon {
            top: 160px;
            right: 10px;
        }

        #total-time {
            position: absolute;
            top: 70px;
            right: 10px;
        }

        #text-container {
            margin-top: 10px;
            font-size: 18px;
            font-weight: normal;
        }

        #recipe-title {
            font-weight: bold;
            font-size: 24px;
        }

        ${renderLanguageFlags()};
    `;
}
