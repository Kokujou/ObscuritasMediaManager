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

    HasNoHue: (mood) => mood == Mood.Unset || mood == Mood.Monotonuous || mood == Mood.Dramatic,
};

/** @param {Mood} mood */
export function getMoodFontColor(mood) {
    if (mood == Mood.Monotonuous || mood == Mood.Unset || !Object.values(Mood).includes(mood)) return 'black';
    return 'white';
}
