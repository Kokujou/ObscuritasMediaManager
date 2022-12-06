using System.Text;

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
}