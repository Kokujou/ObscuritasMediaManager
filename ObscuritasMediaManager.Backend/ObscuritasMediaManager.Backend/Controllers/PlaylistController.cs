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
    private readonly MusicRepository _musicRepository;
    private readonly PlaylistRepository _playlistRepository;

    public PlaylistController(MusicRepository musicRepository, PlaylistRepository playlistRepository)
    {
        _musicRepository = musicRepository;
        _playlistRepository = playlistRepository;
    }

    [HttpGet("dummy")]
    public PlaylistModel GetDummyPlaylist()
    {
        return new PlaylistModel();
    }

    [HttpPost("temp")]
    public Guid CreateTemporaryPlaylist([FromBody] List<string> hashes)
    {
        var playlistId = _playlistRepository.CreateTemporaryPlaylist(hashes);
        return playlistId;
    }

    [HttpGet("{playlistId}")]
    public async Task<PlaylistModel> GetPlaylist(Guid playlistId)
    {
        return await _playlistRepository.GetPlaylistAsync(playlistId);
    }

    [HttpGet("list")]
    public IQueryable<PlaylistModel> ListPlaylists()
    {
        return _playlistRepository.GetAll();
    }

    [HttpPost("create")]
    public async Task CreatePlaylistAsync(PlaylistModel playlist)
    {
        playlist.Id = Guid.NewGuid();
        await _playlistRepository.CreatePlaylistAsync(playlist);
    }

    [HttpPut("{playlistId:guid}")]
    public async Task UpdatePlaylistDataAsync(Guid playlistId, [FromBody] UpdateRequest<PlaylistModel> updateRequest)
    {
        if ((updateRequest.OldModel.Id != default) && (playlistId != updateRequest.OldModel.Id))
            throw new Exception("Ids of objects did not match");

        var actual = await _playlistRepository.GetPlaylistAsync(playlistId);
        if (actual is null)
        {
            await _playlistRepository.CreatePlaylistAsync(updateRequest.NewModel);
            return;
        }

        _playlistRepository.DeleteTemporaryPlaylist(playlistId);

        foreach (var track in updateRequest.NewModel.Tracks.Where(x => x.Hash is null))
            track.CalculateHash();

        await _playlistRepository.UpdateDataAsync(actual, updateRequest.OldModel, updateRequest.NewModel);
        await _playlistRepository.UpdateTracksAsync(updateRequest.NewModel);
        await _playlistRepository.UpdatePlaylistTrackMappingAsync(updateRequest.NewModel.Id, updateRequest.NewModel.Name,
        updateRequest.NewModel.Tracks);
    }

    [HttpPut("{playlistId}/tracks")]
    public async Task AddTracksToPlaylistAsync(Guid playlistId, [FromBody] IEnumerable<string> trackHashes)
    {
        await _playlistRepository.AddTracksAsync(playlistId, trackHashes);
    }

    [HttpDelete("{playlistId}")]
    public async Task DeletePlaylist(Guid playlistId)
    {
        await _playlistRepository.DeletePlaylistAsync(playlistId);
    }
}