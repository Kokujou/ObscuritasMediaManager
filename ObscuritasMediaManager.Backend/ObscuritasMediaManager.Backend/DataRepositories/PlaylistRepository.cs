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

    public async Task<PlaylistModel> GetPlaylistAsync(Guid playlistId)
    {
        var _ = _context.Playlists.Where(x => x.Id == playlistId).ToQueryString();
        return await _context.Playlists.SingleAsync(x => x.Id == playlistId);
    }

    public async Task UpdateDataAsync(Guid playlistId, PlaylistModel old, PlaylistModel updated)
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
        foreach (var track in updated.Tracks) track.CalculateHash();
        actual.Tracks = updated.Tracks;
        actual.Complete = updated.Complete;

        await _context.SaveChangesAsync();
    }

    public async Task UpdateTracksAsync(Guid playlistId, PlaylistModel old, PlaylistModel updated)
    {
        var tracksToRemove = old.Tracks.Except(updated.Tracks);
        var removeTrackIds = tracksToRemove.Select(u => u.Hash).ToArray();
        var hashsToRemoveInDb = _context.Music.Where(u => removeTrackIds.Contains(u.Hash)).Select(u => u.Hash).ToArray();
        tracksToRemove = tracksToRemove.Where(x => hashsToRemoveInDb.Contains(x.Hash));

        var tracksToAdd = updated.Tracks.Except(old.Tracks);
        var newTrackIds = tracksToAdd.Select(u => u.Hash).ToArray();
        var hashsToAddInDb = _context.Music.Where(u => newTrackIds.Contains(u.Hash)).Select(u => u.Hash).ToArray();
        tracksToAdd = tracksToAdd.Where(x => !hashsToAddInDb.Contains(x.Hash));

        _ = await _context.Playlists.SingleOrDefaultAsync(x => x.Id == playlistId);

        _context.Music.RemoveRange(tracksToRemove);
        await _context.SaveChangesAsync();
        _context.Music.AddRange(tracksToAdd);
        await _context.SaveChangesAsync();
    }

    public async Task UpdatePlaylistTrackMappingAsync(Guid playlistId, PlaylistModel updated)
    {
        var actualMapping = await _context.PlaylistEntries.Where(x => x.PlaylistId == playlistId).ToListAsync();
        var updatedTrackMappings = updated.Tracks
                                          .Select(
                                              x => new PlaylistTrackMappingModel
                                                   {
                                                       PlaylistId = playlistId,
                                                       PlaylistName = updated.Name,
                                                       TrackHash = x.Hash
                                                   })
                                          .ToList();
        var newTracks = updatedTrackMappings
            .Where(x => !actualMapping.Any(y => x.TrackHash == y.TrackHash))
            .ToList();
        var removedTracks = actualMapping
            .Where(x => !updatedTrackMappings.Any(y => x.TrackHash == y.TrackHash))
            .ToList();
        await _context.PlaylistEntries.AddRangeAsync(newTracks);
        _context.PlaylistEntries.RemoveRange(removedTracks);
        await _context.SaveChangesAsync();
    }
}