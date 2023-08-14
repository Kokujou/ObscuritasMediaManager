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

    public IQueryable<PlaylistModel> GetAll()
    {
        return _context.Playlists;
    }

    public async Task<PlaylistModel> GetPlaylistAsync(Guid playlistId)
    {
        return await _context.Playlists.SingleOrDefaultAsync(x => x.Id == playlistId);
    }

    public async Task CreatePlaylistAsync(PlaylistModel playlist)
    {
        await UpdateTracksAsync(playlist);

        var cached = playlist.Tracks.ToList();
        playlist.TrackMappings = null;
        await _context.Playlists.AddAsync(playlist);
        await _context.SaveChangesAsync();

        await UpdatePlaylistTrackMappingAsync(playlist.Id, playlist.Name, cached);
    }

    public async Task UpdateDataAsync(PlaylistModel actual, PlaylistModel old, PlaylistModel updated)
    {
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

    public async Task UpdateTracksAsync(PlaylistModel playlist)
    {
        var tracksToAdd = playlist.Tracks;
        if (tracksToAdd is null) return;

        var newTrackIds = tracksToAdd.Select(u => u.Hash).ToArray();
        var hashsToAddInDb = _context.Music.Where(u => newTrackIds.Contains(u.Hash)).Select(u => u.Hash).ToArray();
        tracksToAdd = tracksToAdd.Where(x => !hashsToAddInDb.Contains(x.Hash));

        if (!tracksToAdd.Any()) return;

        _context.Music.AddRange(tracksToAdd);
        await _context.SaveChangesAsync();
    }

    public async Task UpdatePlaylistTrackMappingAsync(Guid playlistId, string playlistName, IEnumerable<MusicModel> updatedTracks)
    {
        var actualMapping = await _context.PlaylistEntries.Where(x => x.PlaylistId == playlistId).ToListAsync();
        var updatedTrackMappings = updatedTracks
                                          .Select((track, index) =>
                                              PlaylistTrackMappingModel.Create(playlistId, playlistName, track, index))
                                          .ToList();

        var newTracks = updatedTrackMappings
            .Where(x => !actualMapping.Contains(x))
            .Select(x => x with { Track = null, Playlist = null })
            .ToList();
        var removedTracks = actualMapping
            .Where(x => !updatedTrackMappings.Contains(x))
            .Select(x => x with { Track = null, Playlist = null })
            .ToList();
        if (removedTracks.Any()) _context.PlaylistEntries.RemoveRange(removedTracks);
        await _context.SaveChangesAsync();
        if (newTracks.Any()) await _context.PlaylistEntries.AddRangeAsync(newTracks);
        await _context.SaveChangesAsync();
    }

    public async Task AddTracksAsync(Guid playlistId, IEnumerable<string> trackHashes)
    {
        var playlist = await _context.Playlists.SingleOrDefaultAsync(x => x.Id == playlistId);
        trackHashes = trackHashes.Union(playlist.Tracks.Select(x => x.Hash));
        if (!trackHashes.Any()) return;
        var selectedTracks = await _context.Music.Where(x => trackHashes.Contains(x.Hash)).ToListAsync();
        await UpdatePlaylistTrackMappingAsync(playlistId, playlist.Name, selectedTracks);
    }
}