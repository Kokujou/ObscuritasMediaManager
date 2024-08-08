using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ObscuritasMediaManager.Backend.Controllers.Requests;
using ObscuritasMediaManager.Backend.DataRepositories;
using ObscuritasMediaManager.Backend.Models;

namespace ObscuritasMediaManager.Backend.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class PlaylistController(PlaylistRepository playlistRepository)
    : ControllerBase
{
    [HttpGet("dummy")]
    public PlaylistModel GetDummyPlaylist()
    {
        return new() { Name = string.Empty };
    }

    [HttpPost("temp")]
    public Guid CreateTemporaryPlaylist([FromBody] List<string> hashes)
    {
        var playlistId = playlistRepository.CreateTemporaryPlaylist(hashes);
        return playlistId;
    }

    [HttpGet("{playlistId}")]
    public async Task<PlaylistModel?> GetPlaylist(Guid playlistId)
    {
        return await playlistRepository.GetPlaylistAsync(playlistId);
    }

    [HttpGet("list")]
    public IQueryable<PlaylistModel> ListPlaylists()
    {
        return playlistRepository.GetAll();
    }

    [HttpPost("create")]
    public async Task CreatePlaylistAsync(PlaylistModel playlist)
    {
        playlist.Id = Guid.NewGuid();
        await playlistRepository.CreatePlaylistAsync(playlist);
    }

    [HttpPut("{playlistId:guid}")]
    public async Task UpdatePlaylistDataAsync(Guid playlistId, [FromBody] UpdateRequest<PlaylistModel> updateRequest)
    {
        if (updateRequest.OldModel.Id != default && playlistId != updateRequest.OldModel.Id)
            throw new("Ids of objects did not match");

        var actual = await playlistRepository.GetPlaylistAsync(playlistId);
        if (actual is null)
        {
            await playlistRepository.CreatePlaylistAsync(updateRequest.NewModel);
            return;
        }

        playlistRepository.DeleteTemporaryPlaylist(playlistId);

        foreach (var track in updateRequest.NewModel.Tracks.Where(x => x.Hash is null))
            track.CalculateHash();

        await playlistRepository.UpdateDataAsync(actual, updateRequest.OldModel, updateRequest.NewModel);
        await playlistRepository.UpdateTracksAsync(updateRequest.NewModel);
        await playlistRepository.UpdatePlaylistTrackMappingAsync(updateRequest.NewModel.Id, updateRequest.NewModel.Name,
            updateRequest.NewModel.Tracks);
    }

    [HttpPut("{playlistId}/tracks")]
    public async Task AddTracksToPlaylistAsync(Guid playlistId, [FromBody] IEnumerable<string> trackHashes)
    {
        await playlistRepository.AddTracksAsync(playlistId, trackHashes);
    }

    [HttpDelete("{playlistId}")]
    public async Task DeletePlaylist(Guid playlistId)
    {
        await playlistRepository.DeletePlaylistAsync(playlistId);
    }
}