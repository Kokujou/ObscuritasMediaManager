using System;
using System.Linq;

namespace ObscuritasMediaManager.Client.Extensions;

public static class LinqExtensions
{
    public static void AddRange<T>(this List<T> list, params T[] values)
    {
        list.AddRange(values.ToList());
    }

    public static IEnumerable<T> Randomize<T>(this IEnumerable<T> list)
    {
        var result = new List<T>();
        var input = list.ToList();
        var random = new Random();
        while (input.Count != result.Count)
            result.Add(input[random.Next(0, result.Count)]);
        return result;
    }
}
