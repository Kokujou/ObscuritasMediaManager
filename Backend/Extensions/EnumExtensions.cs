
namespace ObscuritasMediaManager.Backend.Extensions;

public static class EnumExtensions
{
    public static T ParseEnumOrDefault<T>(this string value) where T : Enum
    {
        if (Enum.TryParse(typeof(T), value, out var result))
            return (T)result;
        return (T)(object)0;
    }

    public static T NextValue<T>(this T value) where T : struct, Enum
    {
        var values = Enum.GetValues<T>().ToList();
        var currentIndex = values.IndexOf(value);
        currentIndex++;
        if (currentIndex >= values.Count) currentIndex = 0;
        return values[currentIndex];
    }
}
