using ObscuritasMediaManager.Client.BusinessComponents.MediaFilter;

public class MediaFilterService
{
    public List<MediaModel> filter(List<MediaModel> result, MediaFilter filter)
    {
        /* TODO ObjectFilterExtensions.applyArrayFilter(result, filter.genres, x => x.Genres); */

        result = result.applyPropertyFilter(filter.ratings, x => x.Rating)
            .applyMultiPropertySearch(filter.search ?? string.Empty, x => x.Name, x => x.Description)
            .applyPropertyFilter(filter.status, x => x.Status)
            .applyRangeFilter(filter.release, x => x.Release)
            .applyPropertyFilter(filter.languages, x => x.Language)
            .applyPropertyFilter(filter.category, x => x.Type)
            .applyArrayFilter(filter.contentWarnings, x => x.ContentWarnings)
            .applyPropertyFilter(filter.targetGroups, x => x.TargetGroup, CheckboxState.Ignore)
            .ToList();

        if (filter.sortingPropertyExpression is null) return result;
        if ((filter.sortingDirection is null) || (filter.sortingDirection == SortDirection.Ascending))
            return result.OrderBy(x => filter.sortingPropertyExpression(x)).ToList();
        else
            return result.OrderByDescending(x => filter.sortingPropertyExpression(x)).ToList();
    }
}
