import { MusicFilterOptions } from '../advanced-components/music-filter/music-filter-options.js';
import { CheckboxState } from '../data/enumerations/checkbox-state.js';
import { ExtendedMusicModel } from '../data/music.model.extended.js';
import { Mood, PlaylistModel } from '../obscuritas-media-manager-backend-client.js';
import { ObjectFilterService } from './object-filter.service.js';

export class MusicFilterService {
    /**
     * @param {PlaylistModel[]} playlists
     * @param {MusicFilterOptions} filter
     */
    static filterPlaylists(playlists, filter) {
        if (filter.showPlaylists == CheckboxState.Forbid) return [];

        var filteredPlaylists = [...playlists];
        ObjectFilterService.applyArrayFilter(filteredPlaylists, filter.genres, 'genres');
        ObjectFilterService.applyPropertyFilter(filteredPlaylists, filter.ratings, 'rating');
        ObjectFilterService.applyMultiPropertySearch(filteredPlaylists, filter.search, 'name', 'author');

        var forbiddenMoods = Object.entries(filter.moods.states)
            .filter((x) => x[1] == CheckboxState.Forbid)
            .map((x) => x[0]);
        filteredPlaylists = filteredPlaylists.filter(
            (x) =>
                !x.tracks.some(
                    (track) =>
                        forbiddenMoods.includes(track.mood1) ||
                        (track.mood2 != Mood.Unset && forbiddenMoods.includes(track.mood2))
                )
        );

        if (filter.complete != CheckboxState.Ignore)
            filteredPlaylists = filteredPlaylists.filter((track) => track.complete == (filter.complete == CheckboxState.Allow));

        return filteredPlaylists;
    }

    /**
     * @param {ExtendedMusicModel[]} tracks
     * @param {MusicFilterOptions} filter
     */
    static filterTracks(tracks, filter) {
        if (filter.showPlaylists == CheckboxState.Allow) return [];
        var filteredTracks = [...tracks];

        ObjectFilterService.applyArrayFilter(filteredTracks, filter.instrumentTypes, 'instrumentTypes');
        ObjectFilterService.applyArrayFilter(filteredTracks, filter.instruments, 'instruments');
        ObjectFilterService.applyArrayFilter(filteredTracks, filter.genres, 'genres');
        ObjectFilterService.applyPropertyFilter(filteredTracks, filter.instrumentations, 'instrumentation');
        ObjectFilterService.applyPropertyFilter(filteredTracks, filter.languages, 'language');
        ObjectFilterService.applyPropertyFilter(filteredTracks, filter.nations, 'nation');
        ObjectFilterService.applyPropertyFilter(filteredTracks, filter.participants, 'participants');
        ObjectFilterService.applyPropertyFilter(filteredTracks, filter.ratings, 'rating');
        ObjectFilterService.applyMultiPropertySearch(filteredTracks, filter.search, 'name', 'author', 'source');
        ObjectFilterService.applyMultiPropertyFilter(filteredTracks, filter.moods, (item) =>
            [item.mood1].concat(item.mood2 == Mood.Unset ? [] : item.mood2)
        );

        if (filter.complete != CheckboxState.Ignore)
            filteredTracks = filteredTracks.filter((track) => track.complete == (filter.complete == CheckboxState.Allow));

        return filteredTracks;
    }
}
