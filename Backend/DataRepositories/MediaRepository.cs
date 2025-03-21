﻿using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using ObscuritasMediaManager.Backend.Data;
using ObscuritasMediaManager.Backend.Exceptions;
using ObscuritasMediaManager.Backend.Extensions;
using ObscuritasMediaManager.Backend.Models;
using System.Linq.Expressions;
using System.Text.Json;
using System.Text.Json.Nodes;

namespace ObscuritasMediaManager.Backend.DataRepositories;

public class MediaRepository(DatabaseContext context)
{
    public async Task<KeyValuePair<Guid?, ModelCreationState>> CreateAsync(MediaModel media)
    {
        try
        {
            var existing = await context.Media
                .FirstOrDefaultAsync(
                    x => x.RootFolderPath == media.RootFolderPath
                         || (x.Type == media.Type && x.Language == media.Language &&
                             x.Name.ToLower() == media.Name.ToLower()));

            if (existing is not null && existing.GetNormalizedPath() == media.GetNormalizedPath())
                return new(existing.Id, ModelCreationState.Ignored);

            if (existing is not null)
            {
                await UpdatePropertyAsync(existing.Id, x => x.RootFolderPath, media.GetNormalizedPath());
                return new(existing.Id, ModelCreationState.Updated);
            }

            await context.Media.AddAsync(media);
            foreach (var entry in context.ChangeTracker.Entries<MediaGenreModel>())
                entry.State = EntityState.Unchanged;
            await context.SaveChangesAsync();
            return new(media.Id, ModelCreationState.Success);
        }
        catch (Exception ex) when (ex.InnerException is SqliteException { SqliteExtendedErrorCode: 2067 })
        {
            return new(media.Id, ModelCreationState.Ignored);
        }
        catch (Exception ex)
        {
            Log.Error(ex.ToString());
            return new(media.Id, ModelCreationState.Error);
        }
    }

    public async Task UpdateAsync(Guid id, JsonNode old, JsonNode updated, JsonSerializerOptions serializerOptions)
    {
        var actual = await context.Media.AsTracking().SingleOrDefaultAsync(x => x.Id == id);
        if (actual == default) throw new ModelNotFoundException(id);

        if (updated[nameof(MediaModel.Genres)] is not null)
        {
            var updatedGenres =
                updated[nameof(MusicModel.Genres)].Deserialize<List<MediaGenreModel>>(serializerOptions)!;
            var newGenres = updatedGenres.Except(actual.Genres, (a, b) => a.Id == b.Id).ToList();
            var removedGenres = actual.Genres.Except(updatedGenres, (a, b) => a.Id == b.Id).ToList();
            foreach (var added in newGenres) actual.Genres.Add(added);
            foreach (var removed in removedGenres) actual.Genres.Remove(removed);
            old.AsObject().Remove(nameof(MediaModel.Genres));
            updated.AsObject().Remove(nameof(MediaModel.Genres));
        }

        actual.UpdateFromJson(old, updated, serializerOptions);
        await context.SaveChangesAsync();
    }

    public async Task UpdatePropertyAsync<T>(Guid id, Expression<Func<MediaModel, T>> property, T value)
    {
        await context.Media.IgnoreAutoIncludes().Where(x => x.Id == id)
            .ExecuteUpdateAsync(property.ToSetPropertyCalls(value));
    }

    public async Task<MediaModel> GetAsync(Guid guid, bool asTracking = false)
    {
        var source = asTracking ? context.Media.AsTracking() : context.Media;
        return await source.SingleOrDefaultAsync(x => x.Id == guid) ?? throw new ModelNotFoundException(guid);
    }

    public IQueryable<MediaModel> GetAll()
    {
        return context.Media;
    }

    public async Task DeleteAsync(Guid mediaId)
    {
        await context.Media.IgnoreAutoIncludes().Where(x => x.Id == mediaId).ExecuteDeleteAsync();
    }

    public async Task SetMediaImageAsync(Guid mediaId, string? image)
    {
        await context.Database.ExecuteSqlInterpolatedAsync(
            $"UPDATE Media SET image = {image} WHERE Id = {mediaId} ");
    }

    public async Task<string?> GetMediaImageAsync(Guid mediaId)
    {
        return await context.Database
            .SqlQuery<string?>($"SELECT image as value FROM Media WHERE Id  = {mediaId}")
            .SingleAsync();
    }
}