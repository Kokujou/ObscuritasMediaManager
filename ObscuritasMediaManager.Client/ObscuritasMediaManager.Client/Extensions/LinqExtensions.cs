using System;
using System.Linq;

namespace ObscuritasMediaManager.Client.Extensions;

public static class LinqExtensions
{
    public static void AddRange<T>(this List<T> list, params T[] values)
    {
        list.AddRange(values.ToList());
    }
}
