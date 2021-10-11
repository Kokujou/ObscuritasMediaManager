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

/**
 * @param {keyof Mood} mood
 */
export function getMoodColor(mood) {
    switch (mood) {
        case 'Aggressive':
            return ' #a33000';
        case 'Calm':
            return ' #773311';
        case 'Dramatic':
            return ' #333333';
        case 'Epic':
            return '#773399';
        case 'Funny':
            return '#a0a000';
        case 'Happy':
            return '#008000';
        case 'Monotonuous':
            return '#999999';
        case 'Passionate':
            return '#a33000';
        case 'Romantic':
            return '#dd6677';
        case 'Sad':
            return '#0055a0';
        default:
            return '#dddddd';
    }
}

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
            --primary-color: #773311;
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
