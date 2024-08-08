using Microsoft.EntityFrameworkCore;
using ObscuritasMediaManager.Backend.DataRepositories;
using ObscuritasMediaManager.Backend.Exceptions;

namespace ObscuritasMediaManager.Backend.Extensions;

public static class DbQueryExtensions
{
    public static async Task InsertIfNotExistsAsync<T>(this DatabaseContext context, IEnumerable<T> models)
        where T : notnull
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
}