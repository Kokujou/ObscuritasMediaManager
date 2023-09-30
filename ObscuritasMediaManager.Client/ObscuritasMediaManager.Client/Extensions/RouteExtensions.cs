using Microsoft.AspNetCore.Components;
using System;
using System.Linq;
using System.Web;

namespace ObscuritasMediaManager.Client.Extensions;

public static class RouteExtensions
{
    public static string? GetQueryParameter(this NavigationManager navigationManager, string param)
    {
        var queries = navigationManager.ToAbsoluteUri(navigationManager.Uri).Query[1..].Split('&');
        var desiredQuery = queries.FirstOrDefault((x) => x.Split('=')[0] == param);

        if (string.IsNullOrEmpty(desiredQuery)) return null;
        return HttpUtility.UrlDecode(desiredQuery.Split('=')[1]);
    }
}
