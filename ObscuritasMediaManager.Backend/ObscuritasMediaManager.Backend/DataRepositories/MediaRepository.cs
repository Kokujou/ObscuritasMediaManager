using Microsoft.EntityFrameworkCore;
using ObscuritasMediaManager.Backend.Exceptions;
using ObscuritasMediaManager.Backend.Extensions;
using ObscuritasMediaManager.Backend.Models;

namespace ObscuritasMediaManager.Backend.DataRepositories;

public class MediaRepository
{
    private readonly DatabaseContext _context;

    public MediaRepository(DatabaseContext context)
    {
        _context = context;
    }

    public async Task UpdateMediaAsync(MediaModel updated)
    {
        var current = await _context.Media.AsTracking().SingleOrDefaultAsync(x => x.Id == updated.Id);

        if (current == default)
            throw new ModelNotFoundException(updated.Id);

        if (current.Hash != updated.Hash)   
            throw new ArgumentException(nameof(updated), "The object has been modified");

        _context.Entry(current).CurrentValues.SetValues(updated);
        await _context.SaveChangesAsync();
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
        var response = await _context.Media.SingleOrDefaultAsync(x => x.Id == guid);
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