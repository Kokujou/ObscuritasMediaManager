import { CheckboxState } from '../data/enumerations/checkbox-state.js';
import { MusicFilterOptions } from '../data/music-filter-options.js';
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

        var moodStates = filter.moods.states;
        var forbiddenValues = /** @type {Mood[]} */ (
            Object.keys(moodStates).filter((value) => moodStates[value] == CheckboxState.Forbid)
        );
        filteredTracks = filteredTracks.filter((item) => {
            var mood2 = item.mood2 == Mood.Unset ? item.mood1 : item.mood2;
            if (forbiddenValues.includes(item.mood1) || forbiddenValues.includes(mood2)) return false;
            return true;
        });

        if (filter.complete != CheckboxState.Ignore)
            filteredTracks = filteredTracks.filter((track) => track.complete == (filter.complete == CheckboxState.Allow));

        return tracks;
    }
}
