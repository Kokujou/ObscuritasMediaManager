using Microsoft.EntityFrameworkCore;
using ObscuritasMediaManager.Backend.Models;
using System.Text.Json;

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

    public static void UpdateFromJson<T>(this T actual, JsonElement old, JsonElement updated,
        JsonSerializerOptions serializerOptions)
    {
        var actualJson = JsonDocument.Parse(JsonSerializer.Serialize(actual, serializerOptions)).RootElement;
        var concurrencyProblems = old.EnumerateObject()
                                     .Where(property => actualJson.GetProperty(property.Name).ToString() 
                                         != old.GetProperty(property.Name).ToString());
        if (concurrencyProblems.Any())
            throw new DbUpdateConcurrencyException("At least one property has changed since your request.");

        var updatedModel = JsonSerializer.Deserialize<MusicModel>(updated, serializerOptions);

        foreach (var property in updated.EnumerateObject())
            try
            {
                var propertyName = $"{property.Name[..1].ToUpper()}{property.Name[1..]}";
                actual.SetPropertyValue(propertyName, updatedModel.GetPropertyValue(propertyName));
            }
            catch { }
    }
}
