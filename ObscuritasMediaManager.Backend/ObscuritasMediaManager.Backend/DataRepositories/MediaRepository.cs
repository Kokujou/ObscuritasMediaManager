using Microsoft.EntityFrameworkCore;
using ObscuritasMediaManager.Backend.Exceptions;
using ObscuritasMediaManager.Backend.Extensions;

using ObscuritasMediaManager.Backend.Models;
using System.Linq.Expressions;
using System.Text.Json;

namespace ObscuritasMediaManager.Backend.DataRepositories;

public class MediaRepository
{
    private readonly DatabaseContext _context;

    public MediaRepository(DatabaseContext context)
    {
        _context = context;
    }

    public async Task UpdateAsync(Guid id, JsonElement old, JsonElement updated, JsonSerializerOptions serializerOptions)
    {
        var actual = await _context.Media.AsTracking().SingleOrDefaultAsync(x => x.Id == id);
        if (actual == default) throw new ModelNotFoundException(id);

        actual.UpdateFromJson(old, updated, serializerOptions);
        await _context.SaveChangesAsync();
    }

    public async Task UpdatePropertyAsync<T>(Guid id, Expression<Func<MediaModel, T>> property, T value)
    {
        await _context.Media.IgnoreAutoIncludes().Where(x => x.Id == id).ExecuteUpdateAsync(property.ToSetPropertyCalls(value));
    }

    public async Task AddMediaImageAsync(Guid guid, string mediaImage)
    {
        var item = await _context.Media.SingleOrDefaultAsync(x => x.Id == guid);
        if (item == default)
            throw new ModelNotFoundException(guid);
        item.Image = mediaImage;
        await _context.SaveChangesAsync();
    }

    public async Task RemoveMediaImageAsync(Guid guid)
    {
        var item = await _context.Media.SingleOrDefaultAsync(x => x.Id == guid);
        if (item == default)
            throw new ModelNotFoundException(guid);
        item.Image = null;
        await _context.SaveChangesAsync();
    }

    public async Task<MediaModel> GetAsync(Guid guid)
    {
        var response = await _context.Media.Include(x => x.StreamingEntries).SingleOrDefaultAsync(x => x.Id == guid);
        if (response == default)
            throw new ModelNotFoundException(guid);
        return response;
    }

    public  IQueryable<MediaModel> GetAll()
    {
        return  _context.Media;
    }

    public async Task BatchCreateMediaAsync(IEnumerable<MediaModel> media)
    {
        await _context.InsertIfNotExistsAsync(media);
    }

    public async ValueTask DisposeAsync()
    {
        await _context.DisposeAsync();
    }
}