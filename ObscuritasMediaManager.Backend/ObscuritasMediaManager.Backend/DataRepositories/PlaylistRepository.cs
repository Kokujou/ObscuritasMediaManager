using Microsoft.EntityFrameworkCore;
using ObscuritasMediaManager.Backend.Models;

namespace ObscuritasMediaManager.Backend.DataRepositories;

public class PlaylistRepository
{
    private readonly DatabaseContext _context;

    public PlaylistRepository(DatabaseContext context)
    {
        _context = context;
    }


    public async Task<List<MusicModel>> GetTracksAsync(Guid playlistId)
    {
        return await _context.PlaylistEntries.Where(x => x.PlaylistId == playlistId)
            .Join(_context.Music, x => x.TrackHash, x => x.Hash, (_, music) => music).ToListAsync();
    }

    public async Task CreateAsync(string name, IEnumerable<string> trackHashes)
    {
        await _context.AddRangeAsync(trackHashes.Select(x => new PlaylistTrackMappingModel
        { PlaylistId = Guid.NewGuid(), TrackHash = x, PlaylistName = name }));
        await _context.SaveChangesAsync();
    }

    public IQueryable<PlaylistModel> GetAll()
    {
        return _context.Playlists;
    }
}