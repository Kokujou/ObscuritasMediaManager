using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using ObscuritasMediaManager.Backend.Controllers.Requests;
using ObscuritasMediaManager.Backend.Controllers.Responses;
using ObscuritasMediaManager.Backend.Data;
using ObscuritasMediaManager.Backend.Data.Music;
using ObscuritasMediaManager.Backend.DataRepositories;
using ObscuritasMediaManager.Backend.Extensions;
using ObscuritasMediaManager.Backend.Models;
using ObscuritasMediaManager.Backend.Services;
using System.Text.Json;

namespace ObscuritasMediaManager.Backend.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class MusicController : ControllerBase
{
    private readonly MusicRepository _musicRepository;
    private readonly JsonSerializerOptions _jsonOptions;
    private readonly LyricsService _lyricsService;

    public MusicController(MusicRepository repository, IOptions<JsonOptions> jsonOptions, LyricsService lyricsService)
    {
        _musicRepository = repository;
        _jsonOptions = jsonOptions.Value.JsonSerializerOptions;
        _lyricsService = lyricsService;
    }

    [HttpGet("default")]
    public MusicModel GetDefault()
    {
        return MusicModel.CreateDefault("Neuer Track");
    }

    [HttpPost("track")]
    public async Task<string> CreateMusicTrackAsync(MusicModel track)
    {
        track.CalculateHash();
        var state = await _musicRepository.CreateTrackAsync(track);
        if (state != ModelCreationState.Success) throw new Exception($"An error occured while creationg tag. Status: {state}");

        return track.Hash;
    }

    [HttpPost("tracks")]
    public async Task<KeyValuePair<string, ModelCreationState>> CreateMusicTrackFromPathAsync([FromBody] string trackPath)
    {
        if (!System.IO.File.Exists(trackPath))
                 return new(null, ModelCreationState.Invalid);

        var track = MusicModel.CreateDefault(trackPath.Split('\\').Last());
        track.Path = trackPath;

        if (!(await FFMPEGExtensions.HasAudioStreamAsync(track.GetNormalizedPath())))
            return new(track.Hash, ModelCreationState.Invalid);

        track.CalculateHash();

        var result = await _musicRepository.CreateTrackAsync(track);
        return new(track.Hash, result);
    }

    [HttpPost("recalculate-hashes")]
    public async Task RecalculateHashes()
    {
        await _musicRepository.RecalculateHashesAsync();
    }

    [HttpGet]
    public IQueryable<MusicModel> GetAll()
    {
        return _musicRepository.GetAll();
    }

    [HttpGet("{hash}")]
    public async Task<MusicModel> GetAsync(string hash)
    {
        return await _musicRepository.GetAsync(hash);
    }

    [HttpGet("{hash}/lyrics")]
    public async Task<LyricsResponse> GetLyricsAsync(string hash, int offset = 0)
    {
        var track = await GetAsync(hash);

        return await _lyricsService.SearchForLyricsAsync(track, offset);
    }

    [HttpGet("instruments")]
    public async Task<IEnumerable<InstrumentModel>> GetInstruments()
    {
        return await _musicRepository.GetInstrumentsAsync();
    }

    [HttpPut("instrument/{name}/type/{type}")]
    public async Task AddInstrument(InstrumentType type, string name)
    {
        var newInstrument = new InstrumentModel { Name = name, Type = type };
        await _musicRepository.AddInstrumentAsync(newInstrument);
    }

    [HttpDelete("instrument/{name}/type/{type}")]
    public async Task RemoveInstrument(InstrumentType type, string name)
    {
        await _musicRepository.RemoveInstrumentAsync(type, name);
    }

    [HttpPut("{hash}")]
    public async Task UpdateAsync(string hash, [FromBody] UpdateRequest<JsonElement> request)
    {
        await _musicRepository.UpdateAsync(hash, request.OldModel, request.NewModel, _jsonOptions);
    }

    [HttpDelete("music/soft")]
    public async Task SoftDeleteTracks([FromBody] List<string> trackHashes)
    {
        if (!trackHashes.Any()) return;

        await _musicRepository.SoftDeleteTracksAsync(trackHashes);
    }

    [HttpPut("music/undelete")]
    public async Task UndeleteTracks([FromBody] List<string> trackHashes)
    {
        if (!trackHashes.Any()) return;

        await _musicRepository.UndeleteTracksAsync(trackHashes);
    }

    [HttpDelete("music/hard")]
    public async Task HardDeleteTracks([FromBody] List<string> trackHashes)
    {
        if (!trackHashes.Any()) return;

        await _musicRepository.HardDeleteTracksAsync(trackHashes);
    }
}