public static class ObjectFilterExtensions
{
    public static IEnumerable<T> applyArrayFilter<T, U>(this IEnumerable<T> list, FilterEntry<U> filter,
        Func<T, IEnumerable<U>> propertyExpression)
        where U : notnull
    {
        return list.Where((item) =>
            {
                var itemPropertyValues = propertyExpression(item);
                return filter.required
                    .All(
                        (
                            allowedItem) => itemPropertyValues.Any(
                                    (anotherItem) => anotherItem.Equals(allowedItem))
                                && itemPropertyValues.All(
                                    (value) => !filter.forbidden.Any((forbiddenItem) => forbiddenItem.Equals(value))));
            });
    }

    public static IEnumerable<T> applyMultiPropertyFilter<T, U>(this IEnumerable<T> list, FilterEntry<U> filter,
        Func<T, IEnumerable<U>> selector)
        where U : notnull
    {
        return list.Where((item) =>
            {
                var array = selector(item);
                if (array.Any((prop) => filter.forbidden.Contains(prop))) return false;
                if (!filter.required.All((prop) => array.Contains(prop))) return false;
                return true;
            });
    }

    public static IEnumerable<T> applyMultiPropertySearch<T, U>(this IEnumerable<T> list, string search,
        params Func<T, U?>[] propertyExpressions)
        where U : notnull
    {
        return list.Where((item) =>
            propertyExpressions.Any((expr) => (expr(item)?.ToString() ?? string.Empty).ToLower().Contains(search.ToLower())));
    }

    public static IEnumerable<T> applyPropertyFilter<T, U>(this IEnumerable<T> list, FilterEntry<U> filter,
        Func<T, U> propertyExpression, CheckboxState ignoreState = CheckboxState.Require)
        where U : notnull
    {
        var results = filterForbidden(list, filter, propertyExpression);
        if (ignoreState != CheckboxState.Require) results = filterNotForced(results, filter, propertyExpression);
        return results;
    }

    public static IEnumerable<T> applyRangeFilter<T>(this IEnumerable<T> list, (int? min, int? max) filter,
        Func<T, int> propertyExpression)
    {
        return list.Where((x) => ((filter.min is null) || (propertyExpression(x) >= filter.min))
            && ((filter.max is null) || (propertyExpression(x) <= filter.max)));
    }

    public static IEnumerable<T> applyValueFilter<T>(this IEnumerable<T> list, CheckboxState state,
        Func<T, bool> propertyExpression)
    {
        if (state == CheckboxState.Ignore) return list;
        return list.Where((x) => propertyExpression(x) == (state == CheckboxState.Require));
    }

    public static IEnumerable<T>  filterForbidden<T, U>(this IEnumerable<T> list, FilterEntry<U> filter,
        Func<T, U> propertyExpression)
        where U : notnull
    {
        if (filter.forbidden.Count() == 0) return list;

        return list.Where((item) => (propertyExpression(item) is null) || !filter.forbidden.Contains(propertyExpression(item)));
    }

    public static IEnumerable<T> filterNotForced<T, U>(this IEnumerable<T> list, FilterEntry<U> filter,
        Func<T, U> propertyExpression)
        where U : notnull
    {
        var forcedValues = filter.required.ToList();
        if (forcedValues.Count == 0) return list;

        return list.Where((item) => forcedValues.Contains(propertyExpression(item)));
    }
}
