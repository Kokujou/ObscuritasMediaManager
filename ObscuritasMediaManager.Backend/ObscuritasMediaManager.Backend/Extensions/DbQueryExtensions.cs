using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;
using ObscuritasMediaManager.Backend.DataRepositories;
using ObscuritasMediaManager.Backend.Exceptions;
using System.Linq.Expressions;
using System.Text.Json;

namespace ObscuritasMediaManager.Backend.Extensions;

public static class DbQueryExtensions
{
    public static async Task InsertIfNotExistsAsync<T>(this DatabaseContext context, IEnumerable<T> models)
    {
        var failedModels = new List<T>();
        foreach (var model in models)
            try
            {
                await context.AddAsync(model);
                await context.SaveChangesAsync();
            }
            catch (DbUpdateException e)
            {
                var entries = e.Entries;
                foreach (var entry in entries)
                {
                    entry.State = EntityState.Detached;
                    failedModels.Add(model);
                }
            }

        if (failedModels.Count > 0)
            throw new ModelCreationFailedException<T>(failedModels.ToArray());
    }

    public static Expression<Func<SetPropertyCalls<TSource>, SetPropertyCalls<TSource>>> CreateSetPropertiesExpression<TSource>(
        List<JsonProperty> propertiesToUpdate)
    {
        var parameter = Expression.Parameter(typeof(SetPropertyCalls<TSource>), "x");
        var body = Expression.Block(
            propertiesToUpdate.Select(property =>
                {
                    var propertyName = $"{property.Name[..1].ToUpper()}{property.Name[1..]}";
                    var propertyValue = Expression.Constant(property.Value);
                    var propertyCall = Expression.Call(parameter, nameof(SetPropertyCalls<TSource>.SetProperty),
                                                       new[] { typeof(TSource).GetProperty(propertyName).PropertyType },
                                                       Expression.Constant(propertyName), propertyValue);
                    return propertyCall;
                }));
        var lambda = Expression.Lambda<Func<SetPropertyCalls<TSource>, SetPropertyCalls<TSource>>>(body, parameter);
        return lambda;
    }
}