using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ObscuritasMediaManager.Backend.Controllers.Requests;
using ObscuritasMediaManager.Backend.DataRepositories;
using ObscuritasMediaManager.Backend.Models;

namespace ObscuritasMediaManager.Backend.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class PlaylistController : ControllerBase
{
    private static readonly Dictionary<Guid, List<string>> TemporaryPlaylistRepository = new();

    private readonly MusicRepository _musicRepository;
    private readonly PlaylistRepository _playlistRepository;

    public PlaylistController(MusicRepository musicRepository, PlaylistRepository playlistRepository)
    {
        _musicRepository = musicRepository;
        _playlistRepository = playlistRepository;
    }

    [HttpPost("temp")]
    public Guid CreateTemporaryPlaylist([FromBody] List<string> hashes)
    {
        var playlistId = Guid.NewGuid();
        TemporaryPlaylistRepository.Add(playlistId, hashes);
        return playlistId;
    }

    [HttpGet("{playlistId}")]
    public async Task<PlaylistModel> GetPlaylist(Guid playlistId)
    {
        if (!TemporaryPlaylistRepository.TryGetValue(playlistId, out var trackHashes))
            return await _playlistRepository.GetPlaylistAsync(playlistId);

        return new PlaylistModel
               {
                   TrackMappings =
                       await Task.WhenAll(trackHashes.Select(async (trackId, index) =>
                               PlaylistTrackMappingModel.Create(playlistId, string.Empty,
                                                                await _musicRepository.GetAsync(trackId), index))),
                   IsTemporary = true,
                   Id = playlistId
               };
    }

    [HttpGet("list")]
    public IQueryable<PlaylistModel> ListPlaylists()
    {
        return _playlistRepository.GetAll();
    }

    [HttpPut("{playlistId:guid}")]
    public async Task UpdatePlaylistDataAsync(Guid playlistId, [FromBody] UpdateRequest<PlaylistModel> updateRequest)
    {
        if ((updateRequest.OldModel.Id != default) && (playlistId != updateRequest.OldModel.Id))
            throw new Exception("Ids of objects did not match");

        TemporaryPlaylistRepository.Remove(playlistId);

        foreach (var track in updateRequest.NewModel.Tracks.Where(x => x.Hash is null))
            track.CalculateHash();

        var actual = await _playlistRepository.GetPlaylistAsync(playlistId);
        if (actual is null)
        {
            await _playlistRepository.CreatePlaylistAsync(updateRequest.NewModel);
            return;
        }

        await _playlistRepository.UpdateDataAsync(actual, updateRequest.OldModel, updateRequest.NewModel);
        await _playlistRepository.UpdateTracksAsync(updateRequest.NewModel);
        await _playlistRepository.UpdatePlaylistTrackMappingAsync(updateRequest.NewModel.Id, updateRequest.NewModel.Name,
                                                                  updateRequest.NewModel.Tracks);
    }
}