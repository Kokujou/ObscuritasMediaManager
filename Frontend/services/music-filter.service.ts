import { MusicFilterOptions } from '../advanced-components/music-filter/music-filter-options';
import { CheckboxState } from '../data/enumerations/checkbox-state';
import { Mood, MusicModel, PlaylistModel } from '../obscuritas-media-manager-backend-client';
import { ObjectFilterService } from './object-filter.service';

export class MusicFilterService {
    static filterPlaylists(playlists: PlaylistModel[], filter: MusicFilterOptions) {
        if (filter.showPlaylists == CheckboxState.Forbid || filter.showDeleted == CheckboxState.Require) return [];

        var filteredPlaylists = [...playlists];
        ObjectFilterService.applyArrayFilter(filteredPlaylists, filter.genres, 'genres');
        ObjectFilterService.applyPropertyFilter(filteredPlaylists, filter.ratings, 'rating');
        ObjectFilterService.applyMultiPropertySearch(filteredPlaylists, filter.search, 'name', 'author');
        ObjectFilterService.applyValueFilter(filteredPlaylists, filter.showComplete, 'complete');

        var forbiddenMoods = filter.moods.forbidden;
        var requiredMoods = filter.moods.required;
        filteredPlaylists = filteredPlaylists.filter(
            (x) =>
                !x.tracks.some(
                    (track) =>
                        forbiddenMoods.includes(track.mood1) ||
                        (track.mood2 != Mood.Unset && forbiddenMoods.includes(track.mood2))
                ) && requiredMoods.every((mood) => x.tracks.some((track) => track.mood1 == mood || track.mood2 == mood))
        );

        return filteredPlaylists;
    }

    static filterTracks(tracks: MusicModel[], filter: MusicFilterOptions) {
        if (filter.showPlaylists == CheckboxState.Require) return [];
        var filteredTracks = [...tracks];

        if (filter.search)
            ObjectFilterService.applyMultiPropertySearch(filteredTracks, filter.search ?? '', 'name', 'author', 'source', 'path');
        ObjectFilterService.applyArrayFilter(filteredTracks, filter.instrumentTypes, 'instrumentTypes');
        ObjectFilterService.applyArrayFilter(filteredTracks, filter.instruments, 'instruments', (x) => x.name);
        ObjectFilterService.applyArrayFilter(filteredTracks, filter.genres, 'genres');
        ObjectFilterService.applyPropertyFilter(filteredTracks, filter.instrumentations, 'instrumentation');
        ObjectFilterService.applyPropertyFilter(filteredTracks, filter.languages, 'language');
        ObjectFilterService.applyPropertyFilter(filteredTracks, filter.participants, 'participants');
        ObjectFilterService.applyPropertyFilter(filteredTracks, filter.ratings, 'rating');
        ObjectFilterService.applyValueFilter(filteredTracks, filter.showComplete, 'complete');
        ObjectFilterService.applyValueFilter(filteredTracks, filter.showDeleted, 'deleted');
        ObjectFilterService.applyMultiPropertyFilter(filteredTracks, filter.moods, (item) =>
            [item.mood1].concat(item.mood2 == Mood.Unset ? [] : item.mood2)
        );

        return filteredTracks;
    }

    static search(list: MusicModel[], search: string) {
        ObjectFilterService.applyMultiPropertySearch(list, search, 'name', 'author', 'source', 'path');
        return list;
    }
}
