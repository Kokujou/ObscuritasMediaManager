import { MoodColors } from '../../data/enumerations/mood.js';
import { LitElementBase } from '../../data/lit-element-base.js';
import { ContextMenu } from '../../native-components/context-menu/context-menu.js';
import { Mood, PlaylistModel } from '../../obscuritas-media-manager-backend-client.js';
import { trashIcon } from '../../pages/media-detail-page/images/trash-icon.svg.js';
import { downloadPlaylistIcon } from '../../resources/inline-icons/playlist-icons/download-playlist-icon.svg.js';
import { rgbHexToHsv } from '../../services/extensions/style.extensions.js';
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

    get moods() {
        return this.playlist.tracks
            .map((x) => x.mood1)
            .concat(this.playlist.tracks.map((x) => x.mood2).filter((x) => x != Mood.Unset));
    }

    get conicColorArray() {
        var allMoodColors = this.moods.filter((x) => !MoodColors.HasNoHue(x));
        if (allMoodColors.length == 0) allMoodColors = this.moods;
        if (allMoodColors.length == 0) allMoodColors = [Mood.Unset];

        var distinctMoods = new Array(...new Set(allMoodColors)).sort((a, b) => {
            const hsvA = rgbHexToHsv(MoodColors[a]);
            const hsvB = rgbHexToHsv(MoodColors[b]);

            return hsvA.h * 10 + hsvA.v - (hsvB.h * 10 + hsvB.v);
        });

        if (distinctMoods.length == 1) return [distinctMoods[0], distinctMoods[0]].map((x) => MoodColors[x]);

        var portionsInDeg = distinctMoods.map((x) => this.getPercentage(x) * 3.6);

        portionsInDeg[0] = portionsInDeg[0] / 2;
        portionsInDeg.push(portionsInDeg[0] / 2);
        distinctMoods.push(distinctMoods[0]);

        return distinctMoods.map((mood, index) => {
            var lastDegree = portionsInDeg.slice(0, index).reduce((a, b) => a + b, 0);
            return `${MoodColors[mood]} ${lastDegree + portionsInDeg[index] / 2}deg`;
        });
    }

    get radialColorString() {
        if (this.moods.every((x) => MoodColors.HasNoHue(x)) || !this.moods.some((x) => MoodColors.HasNoHue(x)))
            return 'transparent, transparent';

        var dict = {};
        dict[Mood.Dramatic] = ` 0 ${this.getPercentage(Mood.Dramatic) / 2}%`;
        dict[Mood.Monotonuous] = `${100 - this.getPercentage(Mood.Unset) / 2 - this.getPercentage(Mood.Monotonuous) / 2}%`;
        dict[Mood.Unset] = `${100 - this.getPercentage(Mood.Unset) / 2}% 100%`;

        return (
            Object.entries(dict)
                .filter((x) => this.moods.find((mood) => x[0] == mood))
                .map((x) => MoodColors[x[0]] + ' ' + x[1])
                .join(',transparent,') + ', transparent'
        );
    }

    constructor() {
        super();

        /** @type {PlaylistModel} */ this.playlist;
        /** @type {number} */ this.hoveredRating;
    }

    connectedCallback() {
        super.connectedCallback();

        this.addEventListener(
            'contextmenu',
            (e) => {
                e.preventDefault();
                ContextMenu.popup(
                    [
                        {
                            iconString: downloadPlaylistIcon(),
                            text: 'Lokal Exportieren',
                            action: () => this.dispatchEvent(new CustomEvent('local-export')),
                        },
                        {
                            iconString: downloadPlaylistIcon(),
                            text: 'Global Exportieren',
                            action: () => this.dispatchEvent(new CustomEvent('global-export')),
                        },
                        {
                            iconString: trashIcon(),
                            text: 'Entfernen',
                            action: () => this.dispatchEvent(new CustomEvent('remove')),
                        },
                    ],
                    e
                );
            },
            { signal: this.abortController.signal }
        );
    }

    render() {
        return renderPlaylistTile(this);
    }

    /**
     * @param {Mood} mood
     */
    getPercentage(mood) {
        return (this.moods.filter((x) => x == mood).length / this.moods.length) * 100;
    }
}
