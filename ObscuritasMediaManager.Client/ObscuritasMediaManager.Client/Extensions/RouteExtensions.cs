using Microsoft.AspNetCore.Components;
using System;
using System.Linq;
using System.Reflection;
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

    public static void NavigateToQuery(this NavigationManager navigationManager, string query)
    {
        var currentUri = navigationManager.ToAbsoluteUri(navigationManager.Uri);
        navigationManager.NavigateTo($"{currentUri.GetLeftPart(UriPartial.Path)}{query}");
    }

    public static void NavigateToComponent<T>(this NavigationManager navigationManager)
    {
        var routeAttributes = typeof(T).GetCustomAttributes<RouteAttribute>().ToList();
        if (routeAttributes.Count == 0) 
            throw new ArgumentException("Die angegebene Komponente hat keine Route-Daten.", nameof(T));
        var validRoutes = routeAttributes.Where(x => !x.Template.Contains("{")).Select(x => x.Template);
        if (!validRoutes.Any())
            throw new NotImplementedException("Nur Routes mit Parametern wurden gefunden, das ist aktuell nicht unterstützt.");
        navigationManager.NavigateTo(validRoutes.First());
    }
}
