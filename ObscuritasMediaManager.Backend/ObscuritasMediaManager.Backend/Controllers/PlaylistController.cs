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
    private static readonly List<IEnumerable<string>> TemporaryPlaylistRepository = new();

    private readonly MusicRepository _musicRepository;
    private readonly PlaylistRepository _playlistRepository;

    public PlaylistController(MusicRepository musicRepository, PlaylistRepository playlistRepository)
    {
        _musicRepository = musicRepository;
        _playlistRepository = playlistRepository;
    }

    [HttpPost("temp")]
    public int CreateTemporaryPlaylist([FromBody] IEnumerable<string> hashes)
    {
        TemporaryPlaylistRepository.Add(hashes);
        return TemporaryPlaylistRepository.Count - 1;
    }

    [HttpGet("{playlistId}")]
    public async Task<PlaylistModel> GetPlaylist(int playlistId)
    {
        if (TemporaryPlaylistRepository.ElementAtOrDefault(playlistId) is not IEnumerable<string> trackHashes)
            return await _playlistRepository.GetPlaylistAsync(playlistId);

        return new PlaylistModel { Tracks = await Task.WhenAll(trackHashes.Select(_musicRepository.GetAsync)), IsTemporary = true, Id = playlistId };
    }

    [HttpGet("list")]
    public IQueryable<PlaylistModel> ListPlaylists()
    {
        return _playlistRepository.GetAll();
    }

    [HttpPut("{playlistId:guid}")]
    public async Task UpdatePlaylistDataAsync(int playlistId, [FromBody] UpdateRequest<PlaylistModel> updateRequest)
    {
        if ((updateRequest.OldModel.Id != default) && (playlistId != updateRequest.OldModel.Id))
            throw new Exception("Ids of objects did not match");

        await _playlistRepository.UpdateAsync(playlistId, updateRequest.OldModel, updateRequest.NewModel);
    }
}