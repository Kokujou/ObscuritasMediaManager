using ObscuritasMediaManager.Client.BusinessComponents.MediaFilter;

public class MediaFilterService
{
    public List<MediaModel> filter(List<MediaModel> result, MediaFilter filter)
    {
        /* TODO ObjectFilterExtensions.applyArrayFilter(result, filter.genres, x => x.Genres); */

        result = result.applyPropertyFilter(filter.Ratings, x => x.Rating)
            .applyMultiPropertySearch(filter.Search ?? string.Empty, x => x.Name, x => x.Description)
            .applyPropertyFilter(filter.Status, x => x.Status)
            .applyRangeFilter(filter.Release, x => x.Release)
            .applyPropertyFilter(filter.Languages, x => x.Language)
            .applyPropertyFilter(filter.Category, x => x.Type)
            .applyArrayFilter(filter.ContentWarnings, x => x.ContentWarnings)
            .applyPropertyFilter(filter.TargetGroups, x => x.TargetGroup, CheckboxState.Ignore)
            .ToList();

        if (filter.SortingPropertyExpression is null) return result;
        if ((filter.SortingDirection is null) || (filter.SortingDirection == SortDirection.Ascending))
            return result.OrderBy(x => filter.SortingPropertyExpression.Compile()(x)).ToList();
        else
            return result.OrderByDescending(x => filter.SortingPropertyExpression.Compile()(x)).ToList();
    }
}
