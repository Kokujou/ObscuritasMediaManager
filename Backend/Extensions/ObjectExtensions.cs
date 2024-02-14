using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using System.Text.Json.Nodes;

namespace ObscuritasMediaManager.Backend.Extensions;

public static class ObjectExtensions
{
    public static object GetPropertyValue<T>(this T target, string name)
    {
        return typeof(T).GetProperty(name).GetValue(target);
    }

    public static void SetPropertyValue<T>(this T target, string name, object value)
    {
        typeof(T).GetProperty(name).SetValue(target, value);
    }

    public static void UpdateFromJson<T>(this T actual, JsonNode old, JsonNode updated, JsonSerializerOptions serializerOptions)
    {
        var actualJson = JsonNode.Parse(JsonSerializer.Serialize(actual, serializerOptions));
        var concurrencyProblems = old.AsObject()
            .Where(
                property => actualJson[property.Key]?.ToString() 
                                         != old[property.Key]?.ToString());
        if (concurrencyProblems.Any())
            throw new DbUpdateConcurrencyException("At least one property has changed since your request.");

        var updatedModel = JsonSerializer.Deserialize<T>(updated, serializerOptions);

        foreach (var property in updated.AsObject())
            try
            {
                var propertyName = $"{property.Key[..1].ToUpper()}{property.Key[1..]}";
                actual.SetPropertyValue(propertyName, updatedModel.GetPropertyValue(propertyName));
            }
            catch { }
    }
}
