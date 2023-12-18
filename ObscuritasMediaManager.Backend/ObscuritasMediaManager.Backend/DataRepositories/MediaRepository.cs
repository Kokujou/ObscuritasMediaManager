using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using ObscuritasMediaManager.Backend.Data;
using ObscuritasMediaManager.Backend.Exceptions;
using ObscuritasMediaManager.Backend.Extensions;

using ObscuritasMediaManager.Backend.Models;
using System.Linq;
using System.Linq.Expressions;
using System.Text.Json;
using System.Text.Json.Nodes;

namespace ObscuritasMediaManager.Backend.DataRepositories;

public class MediaRepository
{
    private readonly DatabaseContext _context;

    public MediaRepository(DatabaseContext context)
    {
        _context = context;
    }

    public async Task<KeyValuePair<Guid?, ModelCreationState>> CreateAsync(MediaModel media)
    {
        try
        {
            var existing = await _context.Media
                .FirstOrDefaultAsync(
                    x => (x.RootFolderPath == media.RootFolderPath)
                        || ((x.Type == media.Type) && (x.Language == media.Language) && (x.Name.ToLower() == media.Name.ToLower())));

            if ((existing is not null) && (existing.GetNormalizedPath() == media.GetNormalizedPath()))
                return new(existing.Id, ModelCreationState.Ignored);

            if (existing is not null)
            {
                await UpdatePropertyAsync(existing.Id, x => x.RootFolderPath, media.GetNormalizedPath());
                return new(existing.Id, ModelCreationState.Updated);
            }

            await _context.Media.AddAsync(media);
            await _context.SaveChangesAsync();
            return new(media.Id, ModelCreationState.Success);
        }
        catch (Exception ex) when (ex.InnerException is SqliteException inner and { SqliteExtendedErrorCode: 2067 })
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
        var actual = await _context.Media.IgnoreAutoIncludes().AsTracking().SingleOrDefaultAsync(x => x.Id == id);
        if (actual == default) throw new ModelNotFoundException(id);

        if (updated[nameof(MediaModel.Genres)] is not null)
        {
            var updatedGenres = updated[nameof(MusicModel.Genres)].Deserialize<List<MediaGenreModel>>(serializerOptions);
            var newGenres = updatedGenres.Except(actual.Genres, (a, b) => a.Id == b.Id).ToList();
            var removedGenres = actual.Genres.Except(updatedGenres, (a, b) => a.Id == b.Id).ToList();
            foreach (var added in newGenres) actual.Genres.Add(added);
            foreach (var removed in removedGenres) actual.Genres.Remove(removed);
            old.AsObject().Remove(nameof(MediaModel.Genres));
            updated.AsObject().Remove(nameof(MediaModel.Genres));
        }

        actual.UpdateFromJson(old, updated, serializerOptions);
        await _context.SaveChangesAsync();
    }

    public async Task UpdatePropertyAsync<T>(Guid id, Expression<Func<MediaModel, T>> property, T value)
    {
        await _context.Media.IgnoreAutoIncludes().Where(x => x.Id == id).ExecuteUpdateAsync(property.ToSetPropertyCalls(value));
    }

    public async Task<MediaModel> GetAsync(Guid guid)
    {
        var response = await _context.Media.SingleOrDefaultAsync(x => x.Id == guid);
        if (response == default)
            throw new ModelNotFoundException(guid);
        return response;
    }

    public  IQueryable<MediaModel> GetAll()
    {
        return  _context.Media;
    }

    public async Task DeleteAsync(Guid mediaId)
    {
        await _context.Media.IgnoreAutoIncludes().Where(x => x.Id == mediaId).ExecuteDeleteAsync();
    }

    public async ValueTask DisposeAsync()
    {
        await _context.DisposeAsync();
    }
}