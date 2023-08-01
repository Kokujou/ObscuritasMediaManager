using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ObscuritasMediaManager.Backend.DataRepositories;
using ObscuritasMediaManager.Backend.Models;

namespace ObscuritasMediaManager.Backend.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class PlaylistController : ControllerBase
{
    private static readonly Dictionary<Guid, IEnumerable<string>> TemporaryPlaylistRepository
        = new();

    private readonly MusicRepository _musicRepository;
    private readonly PlaylistRepository _playlistRepository;

    public PlaylistController(MusicRepository musicRepository, PlaylistRepository playlistRepository)
    {
        _musicRepository = musicRepository;
        _playlistRepository = playlistRepository;
    }

    [HttpPost("temp")]
    public ActionResult<Guid> CreateTemporaryPlaylist([FromBody] IEnumerable<string> hashes)
    {
        var guid = Guid.NewGuid();
        TemporaryPlaylistRepository.Add(guid, hashes);
        return Ok(guid);
    }

    [HttpGet("list")]
    public IQueryable<PlaylistModel> ListPlaylists()
    {
        return _playlistRepository.GetAll();
    }

    [HttpGet("temp/{guid:Guid}")]
    public async Task<ActionResult<IEnumerable<MusicModel>>> GetTemporaryPlaylist(Guid guid)
    {
        if (!TemporaryPlaylistRepository.TryGetValue(guid, out var trackHashes))
            return NotFound();
        var tracks = new List<MusicModel>();
        foreach (var hash in trackHashes) tracks.Add(await _musicRepository.GetAsync(hash));
        return tracks;
    }

    [HttpGet("{id:Guid}")]
    public async Task<ActionResult<IEnumerable<MusicModel>>> GetPlaylist(Guid id)
    {
        var tracks = await _playlistRepository.GetTracksAsync(id);
        if (tracks.Count == 0) return NotFound();
        return tracks;
    }

    [HttpPost("create/{name}")]
    public async Task CreatePlaylist(string name, IEnumerable<string> trackHashes)
    {
        await _playlistRepository.CreateAsync(name, trackHashes);
    }
}