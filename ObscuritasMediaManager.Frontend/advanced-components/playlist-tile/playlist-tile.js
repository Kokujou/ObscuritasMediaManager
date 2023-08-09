import { MoodColors } from '../../data/enumerations/mood.js';
import { LitElementBase } from '../../data/lit-element-base.js';
import { Mood, PlaylistModel } from '../../obscuritas-media-manager-backend-client.js';
import { renderPlaylistTileStyles } from './playlist-tile.css.js';
import { renderPlaylistTile } from './playlist-tile.html.js';

export class PlaylistTile extends LitElementBase {
    static get styles() {
        return renderPlaylistTileStyles();
    }

    static get properties() {
        return {
            playlist: { type: Object, reflect: true },
            hoveredRating: { type: Number, reflect: false },
        };
    }

    get playlistColors() {
        function getColorHue(color) {
            // Remove # from the color code
            const hex = color.slice(1);

            // Convert hex to RGB
            const r = parseInt(hex.substring(0, 2), 16) / 255;
            const g = parseInt(hex.substring(2, 4), 16) / 255;
            const b = parseInt(hex.substring(4, 6), 16) / 255;

            var max = Math.max(r, g, b),
                min = Math.min(r, g, b);
            var h,
                s,
                v = max;

            var d = max - min;
            s = max == 0 ? 0 : d / max;

            if (max == min) {
                h = 0; // achromatic
            } else {
                switch (max) {
                    case r:
                        h = (g - b) / d + (g < b ? 6 : 0);
                        break;
                    case g:
                        h = (b - r) / d + 2;
                        break;
                    case b:
                        h = (r - g) / d + 4;
                        break;
                }

                h /= 6;
            }
            return h;
        }

        function getColorValue(color) {
            const hex = color.slice(1);
            const r = parseInt(hex.substring(0, 2), 16);
            const g = parseInt(hex.substring(2, 4), 16);
            const b = parseInt(hex.substring(4, 6), 16);

            const max = Math.max(r, g, b);
            const value = max / 255;

            return value;
        }

        var allMoodColors = this.playlist.tracks
            .map((x) => [x.mood1, x.mood2])
            .flatMap((x) => x)
            .filter((x) => x != Mood.Unset)
            .map((x) => MoodColors[x]);
        var distinctMoods = new Array(...new Set(allMoodColors)).sort(function (a, b) {
            const hueA = getColorHue(a);
            const hueB = getColorHue(b);

            // Compare by hue
            if (hueA !== hueB) {
                return hueA - hueB;
            }

            const valueA = getColorValue(a);
            const valueB = getColorValue(b);

            return valueA - valueB;
        });

        var percentages = distinctMoods.reduce(
            (prev, curr) => {
                var lastItem = (prev.at(-1) || [])[1];
                if (!lastItem) lastItem = 0;

                return prev.concat([
                    [lastItem, lastItem + (allMoodColors.filter((x) => x == curr).length / allMoodColors.length) * 100],
                ]);
            },
            /** @type {[number,number][]} */ []
        );

        return distinctMoods.map((color, index) => `${color} ${percentages[index][0]}%`);
    }

    constructor() {
        super();

        /** @type {PlaylistModel} */ this.playlist;
        /** @type {number} */ this.hoveredRating;
    }

    render() {
        return renderPlaylistTile(this);
    }
}
