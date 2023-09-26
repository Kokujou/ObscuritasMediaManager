using ObscuritasMediaManager.Client.Attributes;
using System;
using System.Linq;
using System.Reflection;

namespace ObscuritasMediaManager.Client.Extensions;

public static class  IconExtensions
{
    public static string GetIconUrl<T>(this T enumValue) where T : Enum
    {
        return typeof(T).GetMember(enumValue.ToString()).First().GetCustomAttribute<IconUrlAttribute>()?.Url ?? string.Empty;
    }
}
