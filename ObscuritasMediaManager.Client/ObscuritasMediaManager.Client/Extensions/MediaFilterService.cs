using ObscuritasMediaManager.Client.BusinessComponents.MediaFilter;

public class MediaFilterService
{
    public List<MediaModel> filter(List<MediaModel> result, MediaFilter filter)
    {
        ObjectFilterExtensions.applyPropertyFilter(result, filter.ratings, x => x.Rating);
        /* TODO ObjectFilterExtensions.applyArrayFilter(result, filter.genres, x => x.Genres); */
        ObjectFilterExtensions.applyMultiPropertySearch(result, filter.search ?? string.Empty, x => x.Name, x => x.Description);
        ObjectFilterExtensions.applyPropertyFilter(result, filter.status, x => x.Status);
        ObjectFilterExtensions.applyRangeFilter(result, filter.release, x => x.Release);
        ObjectFilterExtensions.applyPropertyFilter(result, filter.languages, x => x.Language);
        ObjectFilterExtensions.applyPropertyFilter(result, filter.category, x => x.Type);
        ObjectFilterExtensions.applyArrayFilter(result, filter.contentWarnings, x => x.ContentWarnings);
        ObjectFilterExtensions.applyPropertyFilter(result, filter.targetGroups, x => x.TargetGroup, CheckboxState.Ignore);

        if (filter.sortingPropertyExpression is null) return result;
        if ((filter.sortingDirection is null) || (filter.sortingDirection == SortDirection.Ascending))
            return result.OrderBy(x => filter.sortingPropertyExpression(x)).ToList();
        else
            return result.OrderByDescending(x => filter.sortingPropertyExpression(x)).ToList();
    }
}
