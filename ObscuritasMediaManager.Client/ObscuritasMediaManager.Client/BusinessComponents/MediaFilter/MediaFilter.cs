using ObscuritasMediaManager.Backend.Data.Media;
using ObscuritasMediaManager.Backend.Data.Music;
using System;
using System.Linq;

namespace ObscuritasMediaManager.Client.BusinessComponents.MediaFilter;

public class MediaFilter
{
    public FilterEntry<MediaCategory> category = new(Enum.GetValues<MediaCategory>(), CheckboxState.Ignore);
    public FilterEntry<ContentWarning> contentWarnings = new(Enum.GetValues<ContentWarning>(), CheckboxState.Ignore);
    public FilterEntry<GenreModel> genres;
    public FilterEntry<Nation> languages = new(Enum.GetValues<Nation>(), CheckboxState.Require);
    public FilterEntry<int> ratings = new(new[] { 1, 2, 3, 4, 5 }, CheckboxState.Require);
    public (int? min, int? max) release = ( min: null, max: null );
    public string search = string.Empty;
    public SortDirection? sortingDirection = SortDirection.Ascending;
    public Func<MediaModel, object>? sortingPropertyExpression = null;
    public FilterEntry<MediaStatus> status = new(Enum.GetValues<MediaStatus>(), CheckboxState.Ignore);
    public FilterEntry<TargetGroup> targetGroups = new(Enum.GetValues<TargetGroup>(), CheckboxState.Ignore);

    public MediaFilter(IEnumerable<GenreModel> genreIds)
    {
        genres = new(genreIds, CheckboxState.Ignore);
    }
}
