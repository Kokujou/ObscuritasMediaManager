import { css, unsafeCSS } from '../../exports.js';

/** @enum {string} */
export const Mood = {
    Epic: 'epic',
    Sad: 'sad',
    Happy: 'happy',
    Funny: 'funny',
    Passionate: 'passionate',
    Calm: 'calm',
    Aggressive: 'aggressive',
    Romantic: 'romantic',
    Dramatic: 'dramatic',
    Monotonuous: 'monotonuous',
    Unset: 'unset',
};

export const MoodColors = {
    aggressive: '#a33000',
    calm: '#773311',
    dramatic: '#333333',
    epic: '#773399',
    funny: '#a0a000',
    happy: '#008000',
    monotonuous: '#999999',
    passionate: '#bb6622',
    romantic: '#dd6677',
    sad: '#0055a0',
    unset: '#dddddd',
};

export function renderMoodStyles(parentSelector) {
    return css`
        ${Object.values(Mood).map(
            (mood) => css`
                ${unsafeCSS(parentSelector)}.${unsafeCSS(mood)} {
                    --primary-color: ${MoodColors[mood]};
                    --font-color: white;
                }
            `
        )}

        ${unsafeCSS(parentSelector)} {
            --primary-color: #dddddd;
            --font-color: black;
        }

        ${unsafeCSS(parentSelector)}.monotonuous {
            --font-color: black;
        }
    `;
}
