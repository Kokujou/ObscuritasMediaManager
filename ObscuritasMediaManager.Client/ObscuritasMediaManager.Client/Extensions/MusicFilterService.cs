using ObscuritasMediaManager.Backend.Data.Music;

public class MusicFilterService
{
    public static List<PlaylistModel> filterPlaylists(IEnumerable<PlaylistModel> playlists, MusicFilter filter)
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
                                    || ((track.Mood2 != Mood.Unset)
                                        && forbiddenMoods.Contains(
                                            track.Mood2)))
                && requiredMoods.All((mood) => x.Tracks.Any((track) => (track.Mood1 == mood) || (track.Mood2 == mood))))
            .ToList();

        return filteredPlaylists;
    }

    public static List<MusicModel> filterTracks(List<MusicModel> tracks, MusicFilter filter)
    {
        if (filter.showPlaylists == CheckboxState.Require) return new();
        var filteredTracks = tracks.ToList();

        return filteredTracks
            .applyArrayFilter(filter.instrumentTypes, x => x.InstrumentTypes)
            .applyArrayFilter(filter.instruments, x => x.InstrumentNames)
            .applyArrayFilter(filter.genres, x => x.Genres)
            .applyPropertyFilter(filter.instrumentations, x => x.Instrumentation)
            .applyPropertyFilter(filter.languages, x => x.Language)
            .applyPropertyFilter(filter.nations, x => x.Nation)
            .applyPropertyFilter(filter.participants, x => x.Participants)
            .applyPropertyFilter(filter.ratings, x => x.Rating)
            .applyMultiPropertySearch(filter.search, x => x.Name, x => x.Author, x => x.Source)
            .applyValueFilter(filter.showComplete, x => x.Complete)
            .applyValueFilter(filter.showDeleted, x => x.Deleted)
            .applyMultiPropertyFilter(filter.moods, (item) =>
           new List<Mood> { item.Mood1 }.Concat((item.Mood2 != Mood.Unset) ? (new List<Mood> { item.Mood2 }) : (new List<Mood>()))
                    .ToList())
            .ToList();
    }
}
