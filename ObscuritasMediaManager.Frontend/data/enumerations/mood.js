import { css, unsafeCSS } from '../../exports.js';

/** @enum {string} */
export const Mood = {
    Unset: 'unset',
    Happy: 'happy',
    Aggressive: 'aggressive',
    Sad: 'sad',
    Calm: 'calm',
    Romantic: 'romantic',
    Dramatic: 'dramatic',
    Epic: 'epic',
    Funny: 'funny',
    Passionate: 'passionate',
    Monotonuous: 'monotonuous',
};

export function renderMoodStyles(parentSelector) {
    return css`
        ${unsafeCSS(parentSelector)} {
            --primary-color: #dddddd;
            --font-color: black;
        }
        ${unsafeCSS(parentSelector)}.happy {
            --primary-color: #008000;
            --font-color: white;
        }
        ${unsafeCSS(parentSelector)}.aggressive {
            --primary-color: #a33000;
            --font-color: white;
        }
        ${unsafeCSS(parentSelector)}.sad {
            --primary-color: #0055a0;
            --font-color: white;
        }
        ${unsafeCSS(parentSelector)}.calm {
            --primary-color: #662200;
            --font-color: white;
        }
        ${unsafeCSS(parentSelector)}.romantic {
            --primary-color: #dd6677;
            --font-color: white;
        }
        ${unsafeCSS(parentSelector)}.dramatic {
            --primary-color: #333333;
            --font-color: white;
        }
        ${unsafeCSS(parentSelector)}.epic {
            --primary-color: #773399;
            --font-color: white;
        }
        ${unsafeCSS(parentSelector)}.funny {
            --primary-color: #a0a000;
            --font-color: white;
        }
        ${unsafeCSS(parentSelector)}.passionate {
            --primary-color: #bb6622;
            --font-color: white;
        }
        ${unsafeCSS(parentSelector)}.monotonuous {
            --primary-color: #999999;
            --font-color: black;
        }
    `;
}
