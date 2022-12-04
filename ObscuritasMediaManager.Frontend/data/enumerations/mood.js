import { css, unsafeCSS } from '../../exports.js';
import { Mood } from '../../obscuritas-media-manager-backend-client.js';

export const MoodColors = {
    Aggressive: '#a33000',
    Calm: '#773311',
    Dramatic: '#333333',
    Epic: '#773399',
    Funny: '#a0a000',
    Happy: '#008000',
    Monotonuous: '#999999',
    Passionate: '#bb6622',
    Romantic: '#dd6677',
    Sad: '#0335a0',
    Cool: '#00aaee',
    Unset: '#dddddd',
};

export function renderMoodStyles(parentSelector) {
    return css`
        ${unsafeCSS(parentSelector)} {
            --primary-color: #dddddd;
            --font-color: black;
        }

        ${unsafeCSS(parentSelector)}.${unsafeCSS(Mood.Monotonuous)} {
            --font-color: black !important;
        }

        ${unsafeCSS(parentSelector)}.${unsafeCSS(Mood.Unset)} {
            --font-color: black !important;
        }

        ${unsafeCSS(
            Object.values(Mood).reduce(
                (prev, mood) => `
                        ${unsafeCSS(prev)}

                        ${unsafeCSS(parentSelector)}.${unsafeCSS(mood)} {
                            --primary-color: ${unsafeCSS(MoodColors[mood])};
                            --font-color: white;
                        }
                    `,
                ''
            )
        )}
    `;
}
