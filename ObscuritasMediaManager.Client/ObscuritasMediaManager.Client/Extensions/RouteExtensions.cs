using Microsoft.AspNetCore.Components;
using System;
using System.Linq;
using System.Reflection;
using System.Text.RegularExpressions;
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

    public static void NavigateToComponent<T>(this NavigationManager navigationManager,
        Dictionary<string, object?>? parameters = null)
    {
        var routeAttributes = typeof(T).GetCustomAttributes<RouteAttribute>().ToList();
        if (routeAttributes.Count == 0) 
            throw new ArgumentException("Die angegebene Komponente hat keine Route-Daten.", nameof(T));

        var firstRoute = routeAttributes.First();
        var route = FillRouteParams(firstRoute.Template, parameters);

        if (parameters is null)
        {
            navigationManager.NavigateTo(route);
            return;
        }

        var suppliedQueries = typeof(T).GetProperties(BindingFlags.Instance | BindingFlags.Public)
            .Select(
                x => (x.GetCustomAttribute<SupplyParameterFromQueryAttribute>() is SupplyParameterFromQueryAttribute queryParam)
                    ? (queryParam.Name ?? x.Name)
                    : null)
            .Where(x => x is not null)
            .Where(x => parameters.ContainsKey(x!));

        if (!suppliedQueries.Any())
        {
            navigationManager.NavigateTo(route);
            return;
        }

        route += $"?{string.Join("&", suppliedQueries.Select(x => $"{x}={parameters[x!]}"))}";
        navigationManager.NavigateTo(route);
    }

    private static string FillRouteParams(string template, Dictionary<string, object?>? parameters = null)
    {
        if (!template.Contains("{")) return template;

        var routeParams = template
            .Split("/")
            .Where(x => x.StartsWith("{"))
            .Select(x => x.Replace("{", string.Empty).Replace("}", string.Empty));
        var groupedRouteParams = routeParams.GroupBy(x => x.Contains("?"));
        var optionalParams = groupedRouteParams.First(x => x.Key == true).ToHashSet();
        var mandatoryParams = groupedRouteParams.First(x => x.Key == false).ToHashSet();

        if ((mandatoryParams.Count > 0) && (parameters is not { Count: > 0 }))
            throw new ArgumentException("Die Route-Parameter für die angegebene Route konnten nicht aufgelöst werden.");

        if (!mandatoryParams.All(x => parameters!.Keys.Contains(x)))
            throw new ArgumentException("Die Route-Parameter für die angegebene Route konnten nicht aufgelöst werden.");

        foreach (var parameter in routeParams)
            new Regex($"\\{{{parameter}:.*\\}}").Replace(template, parameters![parameter]?.ToString() ?? string.Empty);

        return template;
    }
}
