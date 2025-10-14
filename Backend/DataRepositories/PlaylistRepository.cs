using System.Collections.Concurrent;
using Microsoft.EntityFrameworkCore;
using ObscuritasMediaManager.Backend.Models;

namespace ObscuritasMediaManager.Backend.DataRepositories;

public class PlaylistRepository(DatabaseContext context)
{
    private static readonly ConcurrentDictionary<Guid, List<string>> TemporaryPlaylistRepository = new();

    public IQueryable<PlaylistModel> GetAll()
    {
        return context.Playlists;
    }

    public async Task<PlaylistModel?> GetPlaylistAsync(Guid playlistId)
    {
        if (TemporaryPlaylistRepository.TryGetValue(playlistId, out var trackHashes))
            return new()
            {
                Name = "Temporary Playlist",
                TrackMappings =
                    await Task.WhenAll(trackHashes.Select(async (trackHash, index) =>
                        PlaylistTrackMappingModel.Create(playlistId, string.Empty,
                            await context.Music.SingleAsync(x => x.Hash == trackHash), index))),
                IsTemporary = true,
                Id = playlistId
            };

        return await context.Playlists.SingleAsync(x => x.Id == playlistId);
    }

    public Guid CreateTemporaryPlaylist(List<string> hashes)
    {
        var playlistId = Guid.NewGuid();
        TemporaryPlaylistRepository.TryAdd(playlistId, hashes);
        return playlistId;
    }

    public async Task CreatePlaylistAsync(PlaylistModel playlist)
    {
        await UpdateTracksAsync(playlist);

        var cached = playlist.Tracks.ToList();
        playlist.TrackMappings = null;
        await context.Playlists.AddAsync(playlist);
        await context.SaveChangesAsync();

        await UpdatePlaylistTrackMappingAsync(playlist.Id, playlist.Name, cached);
    }

    public async Task UpdateDataAsync(PlaylistModel actual, PlaylistModel old, PlaylistModel updated)
    {
        context.Entry(actual).State = EntityState.Unchanged;
        if (!string.IsNullOrEmpty(updated.Name) && old.Name == actual.Name)
            actual.Name = updated.Name;
        if (!string.IsNullOrEmpty(updated.Author) && old.Author == actual.Author)
            actual.Author = updated.Author;
        if (updated.Genres != null && !old.Genres.Except(actual.Genres).Any())
            actual.Genres = updated.Genres;
        if (updated.Language != default && old.Language == actual.Language)
            actual.Language = updated.Language;
        if (updated.Nation != default && old.Nation == actual.Nation)
            actual.Nation = updated.Nation;
        if (updated.Rating != 0 && old.Rating == actual.Rating)
            actual.Rating = updated.Rating;
        if (updated.Image != default && old.Image == actual.Image)
            actual.Image = updated.Image;
        actual.Complete = updated.Complete;

        await context.SaveChangesAsync();
    }

    public async Task UpdateTracksAsync(PlaylistModel playlist)
    {
        var tracksToAdd = playlist.Tracks;
        if (tracksToAdd is null) return;

        var newTrackIds = tracksToAdd.Select(u => u.Hash).ToArray();
        var hashsToAddInDb = context.Music.Where(u => newTrackIds.Contains(u.Hash)).Select(u => u.Hash).ToArray();
        tracksToAdd = tracksToAdd.Where(x => !hashsToAddInDb.Contains(x.Hash));

        if (!tracksToAdd.Any()) return;

        context.Music.AddRange(tracksToAdd);
        await context.SaveChangesAsync();
    }

    public async Task UpdatePlaylistTrackMappingAsync(Guid playlistId, string playlistName,
        IEnumerable<MusicModel> updatedTracks)
    {
        var actualMapping = await context.PlaylistEntries.Where(x => x.PlaylistId == playlistId).ToListAsync();
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
        if (removedTracks.Any()) context.PlaylistEntries.RemoveRange(removedTracks);
        await context.SaveChangesAsync();
        if (newTracks.Any()) await context.PlaylistEntries.AddRangeAsync(newTracks);
        await context.SaveChangesAsync();
    }

    public async Task AddTracksAsync(Guid playlistId, IEnumerable<string?> trackHashes)
    {
        var playlist = await context.Playlists.SingleAsync(x => x.Id == playlistId);
        trackHashes = trackHashes.Union(playlist.Tracks.Select(x => x.Hash));
        var selectedTracks = await context.Music.Where(x => trackHashes.Contains(x.Hash)).ToListAsync();
        if (selectedTracks.Count == 0) return;
        await UpdatePlaylistTrackMappingAsync(playlistId, playlist.Name, selectedTracks);
    }

    public void DeleteTemporaryPlaylist(Guid playlistId)
    {
        TemporaryPlaylistRepository.Remove(playlistId, out _);
    }

    public async Task DeletePlaylistAsync(Guid playlistId)
    {
        context.Remove(new PlaylistModel { Id = playlistId, Name = string.Empty });
        await context.SaveChangesAsync();
    }
}