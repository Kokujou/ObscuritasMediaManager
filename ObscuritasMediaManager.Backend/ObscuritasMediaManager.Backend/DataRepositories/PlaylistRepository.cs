using Microsoft.EntityFrameworkCore;
using ObscuritasMediaManager.Backend.Exceptions;
using ObscuritasMediaManager.Backend.Models;

namespace ObscuritasMediaManager.Backend.DataRepositories;

public class PlaylistRepository
{
    private readonly DatabaseContext _context;

    public PlaylistRepository(DatabaseContext context)
    {
        _context = context;
    }

    public IQueryable<PlaylistModel> GetAll()
    {
        return _context.Playlists;
    }

    public async Task<PlaylistModel> GetPlaylistAsync(int playlistId)
    {
        _ = _context.Playlists.Where(x => x.Id == playlistId).ToQueryString();
        return await _context.Playlists.SingleAsync(x => x.Id == playlistId);
    }

    public async Task UpdateAsync(int playlistId, PlaylistModel old, PlaylistModel updated)
    {
        var actual = await _context.Playlists.SingleOrDefaultAsync(x => x.Id == playlistId);
        if (actual == default)
            throw new ModelNotFoundException(updated.Id.ToString());

        if (!string.IsNullOrEmpty(updated.Name) && (old.Name == actual.Name))
            actual.Name = updated.Name;
        if (!string.IsNullOrEmpty(updated.Author) && (old.Author == actual.Author))
            actual.Author = updated.Author;
        if ((updated.Genres != null) && !old.Genres.Except(actual.Genres).Any())
            actual.Genres = updated.Genres;
        if ((updated.Language != default) && (old.Language == actual.Language))
            actual.Language = updated.Language;
        if ((updated.Nation != default) && (old.Nation == actual.Nation))
            actual.Nation = updated.Nation;
        if ((updated.Rating != 0) && (old.Rating == actual.Rating))
            actual.Rating = updated.Rating;
        if ((updated.Image != default) && (old.Image == actual.Image))
            actual.Image = updated.Image;
        actual.Complete = updated.Complete;

        await _context.SaveChangesAsync();
    }
}