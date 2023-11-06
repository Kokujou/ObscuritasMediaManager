
namespace ObscuritasMediaManager.Backend.Extensions;

public static class LinqExtensions
{
    public static IEnumerable<T> Except<T>(this IEnumerable<T> source, IEnumerable<T> target, Func<T, T, bool> comparer)
    {
        return source.Where(a => !target.Any(b => comparer(a, b)));
    }
}
