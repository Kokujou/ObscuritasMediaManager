
namespace ObscuritasMediaManager.Backend.Extensions;

public static class EnumExtensions
{
    public static T ParseEnumOrDefault<T>(this string value) where T : Enum
    {
        if (Enum.TryParse(typeof(T), value, out var result))
            return (T)result;
        return (T)(object)0;
    }
}
