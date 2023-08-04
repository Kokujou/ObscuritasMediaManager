using Microsoft.Extensions.Primitives;
using System.Web;

namespace ObscuritasMediaManager.Backend.Extensions;

public static class CookieExtensions
{
    public static string GetCookie(this StringValues cookies, string name)
    {
        var cookie = cookies.FirstOrDefault(x => $"{x.ToLower()}=".StartsWith(name.ToLower()));

        return HttpUtility.UrlDecode(cookie?[$"{name.ToLower()}=".Length..]);
    }
}