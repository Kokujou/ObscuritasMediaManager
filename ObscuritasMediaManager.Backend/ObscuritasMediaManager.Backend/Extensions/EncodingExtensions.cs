using System.Text;
using System.Text.Json;

namespace ObscuritasMediaManager.Backend.Extensions;

public static class EncodingExtensions
{
    public static string ToBase64String(this string input)
    {
        try
        {
            var bytes = Encoding.UTF8.GetBytes(input);
            return Convert.ToBase64String(bytes);
        }
        catch
        {
            return null;
        }
    }

    public static string FromBase64String(this string input)
    {
        try
        {
            var bytes = Convert.FromBase64String(input);
            return Encoding.UTF8.GetString(bytes);
        }
        catch
        {
            return null;
        }
    }

    public static string JsonSerialize<T>(this T target)
    {
        if (target is null) return null;
        return JsonSerializer.Serialize(target, new JsonSerializerOptions { IncludeFields = true });
    }

    public static T JsonDeserialize<T>(this string target) where T : class
    {
        if (string.IsNullOrEmpty(target)) return null;
        return JsonSerializer.Deserialize<T>(target, new JsonSerializerOptions { IncludeFields = true });
    }
}