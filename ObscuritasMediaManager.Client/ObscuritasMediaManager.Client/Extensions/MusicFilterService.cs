using ObscuritasMediaManager.Backend.Data.Music;

public class MusicFilterService
{
    public static List<PlaylistModel> filterPlaylists(IEnumerable<PlaylistModel> playlists, MusicFilterOptions filter)
    {
        if ((filter.showPlaylists == CheckboxState.Forbid) || (filter.showDeleted == CheckboxState.Require)) return new();

        var filteredPlaylists = playlists.ToList();
        ObjectFilterExtensions.applyArrayFilter(filteredPlaylists, filter.genres, x => x.Genres);
        ObjectFilterExtensions.applyPropertyFilter(filteredPlaylists, filter.ratings, x => x.Rating);
        ObjectFilterExtensions.applyMultiPropertySearch(filteredPlaylists, filter.search, x => x.Name, x => x.Author);
        ObjectFilterExtensions.applyValueFilter(filteredPlaylists, filter.showComplete, x => x.Complete);

        var forbiddenMoods = filter.moods.forbidden;
        var requiredMoods = filter.moods.required;
        filteredPlaylists = filteredPlaylists.Where((x) =>
                !x.Tracks
                    .Any((track) =>
                        forbiddenMoods.Contains(
                                        track.Mood1)
                                    || ((track.Mood2 != Mood.Unset) && forbiddenMoods.Contains(
                                            track.Mood2)))
                && requiredMoods.All((mood) => x.Tracks.Any((track) => (track.Mood1 == mood) || (track.Mood2 == mood))))
            .ToList();

        return filteredPlaylists;
    }

    public static List<MusicModel> filterTracks(List<MusicModel> tracks, MusicFilterOptions filter)
    {
        if (filter.showPlaylists == CheckboxState.Require) return new();
        var filteredTracks = tracks.ToList();

        ObjectFilterExtensions.applyArrayFilter(filteredTracks, filter.instrumentTypes, x => x.InstrumentTypes);
        ObjectFilterExtensions.applyArrayFilter(filteredTracks, filter.instruments, x => x.InstrumentNames);
        ObjectFilterExtensions.applyArrayFilter(filteredTracks, filter.genres, x => x.Genres);
        ObjectFilterExtensions.applyPropertyFilter(filteredTracks, filter.instrumentations, x => x.Instrumentation);
        ObjectFilterExtensions.applyPropertyFilter(filteredTracks, filter.languages, x => x.Language);
        ObjectFilterExtensions.applyPropertyFilter(filteredTracks, filter.nations, x => x.Nation);
        ObjectFilterExtensions.applyPropertyFilter(filteredTracks, filter.participants, x => x.Participants);
        ObjectFilterExtensions.applyPropertyFilter(filteredTracks, filter.ratings, x => x.Rating);
        ObjectFilterExtensions.applyMultiPropertySearch(filteredTracks, filter.search, x => x.Name, x => x.Author, x => x.Source);
        ObjectFilterExtensions.applyValueFilter(filteredTracks, filter.showComplete, x => x.Complete);
        ObjectFilterExtensions.applyValueFilter(filteredTracks, filter.showDeleted, x => x.Deleted);
        ObjectFilterExtensions.applyMultiPropertyFilter(filteredTracks, filter.moods, (item) =>
           new List<Mood> { item.Mood1 }.Concat((item.Mood2 != Mood.Unset) ? (new List<Mood> { item.Mood2 }) : (new List<Mood>()))
                .ToList());

        return filteredTracks;
    }
}
