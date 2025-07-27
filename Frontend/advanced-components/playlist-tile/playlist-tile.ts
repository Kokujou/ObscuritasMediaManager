import { customElement, property } from 'lit-element/decorators';
import { MoodColors } from '../../data/enumerations/mood';
import { LitElementBase } from '../../data/lit-element-base';
import { rgbHexToHsv } from '../../extensions/style.extensions';
import { ContextMenu } from '../../native-components/context-menu/context-menu';
import { Mood, PlaylistModel } from '../../obscuritas-media-manager-backend-client';
import { Icons } from '../../resources/inline-icons/icon-registry';
import { renderPlaylistTileStyles } from './playlist-tile.css';
import { renderPlaylistTile } from './playlist-tile.html';

@customElement('playlist-tile')
export class PlaylistTile extends LitElementBase {
    static override get styles() {
        return renderPlaylistTileStyles();
    }

    get moods() {
        return this.playlist.tracks
            .map((x) => x.mood1)
            .concat(this.playlist.tracks.map((x) => x.mood2).filter((x) => x != Mood.Unset));
    }

    get conicColorArray() {
        var allMoodColors = this.moods.filter((x) => !MoodColors.HasNoHue(x)) as Mood[];
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

        var dict = {} as any;
        dict[Mood.Dramatic] = ` 0 ${this.getPercentage(Mood.Dramatic) / 2}%`;
        dict[Mood.Monotonuous] = `${100 - this.getPercentage(Mood.Unset) / 2 - this.getPercentage(Mood.Monotonuous) / 2}%`;
        dict[Mood.Unset] = `${100 - this.getPercentage(Mood.Unset) / 2}% 100%`;

        return (
            Object.entries(dict)
                .filter((x) => this.moods.find((mood) => x[0] == mood))
                .map((x) => MoodColors[x[0] as Mood] + ' ' + x[1])
                .join(',transparent,') + ', transparent'
        );
    }

    @property({ type: Object }) public declare playlist: PlaylistModel;
    @property({ type: Number }) public declare hoveredRating: number;

    override connectedCallback() {
        super.connectedCallback();

        this.addEventListener(
            'contextmenu',
            (e) => {
                e.preventDefault();
                ContextMenu.popup(
                    [
                        {
                            icon: Icons.DownloadPlaylist,
                            text: 'Lokal Exportieren',
                            action: () => this.dispatchEvent(new CustomEvent('local-export')),
                        },
                        {
                            icon: Icons.DownloadPlaylist,
                            text: 'Global Exportieren',
                            action: () => this.dispatchEvent(new CustomEvent('global-export')),
                        },
                        {
                            icon: Icons.Trash,
                            text: 'Endgültig Löschen',
                            action: () => this.dispatchEvent(new CustomEvent('remove')),
                        },
                    ],
                    e
                );
            },
            { signal: this.abortController.signal }
        );
    }

    override render() {
        return renderPlaylistTile.call(this);
    }

    getPercentage(mood: Mood) {
        return (this.moods.filter((x) => x == mood).length / this.moods.length) * 100;
    }
}
