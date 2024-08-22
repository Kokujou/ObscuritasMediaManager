using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using ObscuritasMediaManager.Backend.Controllers.Requests;
using ObscuritasMediaManager.Backend.Controllers.Responses;
using ObscuritasMediaManager.Backend.Data;
using ObscuritasMediaManager.Backend.Data.Music;
using ObscuritasMediaManager.Backend.DataRepositories;
using ObscuritasMediaManager.Backend.Exceptions;
using ObscuritasMediaManager.Backend.Extensions;
using ObscuritasMediaManager.Backend.Models;
using ObscuritasMediaManager.Backend.Services;
using System.Text.Json;
using System.Text.Json.Nodes;

namespace ObscuritasMediaManager.Backend.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class MusicController(MusicRepository repository, IOptions<JsonOptions> jsonOptions, LyricsService lyricsService)
    : ControllerBase
{
    private readonly JsonSerializerOptions _jsonOptions = jsonOptions.Value.JsonSerializerOptions;

    [HttpGet("default")]
    public MusicModel GetDefault()
    {
        return MusicModel.CreateDefault("Neuer Track");
    }

    [HttpPost("track")]
    public async Task<string> CreateMusicTrackAsync(MusicModel track)
    {
        track.CalculateHash();
        var state = await repository.CreateTrackAsync(track);
        if (state != ModelCreationState.Success) throw new($"An error occured while creationg tag. Status: {state}");

        return track.Hash!;
    }

    [HttpPost("tracks")]
    public async Task<KeyValuePair<string?, ModelCreationState>> CreateMusicTrackFromPathAsync(
        [FromBody] string trackPath)
    {
        if (!System.IO.File.Exists(trackPath)) return new(null, ModelCreationState.Invalid);

        var track = MusicModel.CreateDefault(trackPath.Split('\\').Last());
        track.Path = trackPath;

        if (!await FFMPEGExtensions.HasAudioStreamAsync(track.GetNormalizedPath()))
            return new(track.Hash, ModelCreationState.Invalid);

        track.CalculateHash();

        var result = await repository.CreateTrackAsync(track);
        return new(track.Hash, result);
    }

    [HttpPost("recalculate-hashes")]
    public async Task RecalculateHashes()
    {
        await repository.RecalculateHashesAsync();
    }

    [HttpGet]
    public IQueryable<MusicModel> GetAll()
    {
        return repository.GetAll();
    }

    [HttpGet("{hash}")]
    public async Task<MusicModel> GetAsync(string hash)
    {
        return await repository.GetAsync(hash);
    }

    [HttpGet("{hash}/lyrics")]
    public async Task<LyricsResponse> GetLyricsAsync(string hash, int offset = 0)
    {
        var track = await GetAsync(hash);

        while (true)
            try
            {
                return await lyricsService.SearchForLyricsAsync(track, offset);
            }
            catch (LyricsNotFoundException)
            {
                throw;
            }
            catch (Exception ex)
            {
                Log.Error($"An error occurred while parsing the lyrics, incrementing offset: {ex}");
            }
    }

    [HttpGet("instruments")]
    public async Task<IEnumerable<InstrumentModel>> GetInstruments()
    {
        return await repository.GetInstrumentsAsync();
    }

    [HttpPut("instrument/{name}/type/{type}")]
    public async Task AddInstrument(InstrumentType type, string name)
    {
        var newInstrument = new InstrumentModel { Name = name, Type = type };
        await repository.AddInstrumentAsync(newInstrument);
    }

    [HttpDelete("instrument/{name}/type/{type}")]
    public async Task RemoveInstrument(InstrumentType type, string name)
    {
        await repository.RemoveInstrumentAsync(type, name);
    }

    [HttpPut("{hash}")]
    public async Task<MusicModel> UpdateAsync(string hash, [FromBody] UpdateRequest<dynamic> _)
    {
        var deserialized = await HttpContext.ReadRequestBodyAsync<UpdateRequest<JsonNode>>(_jsonOptions);

        await repository.UpdateAsync(hash, deserialized.OldModel, deserialized.NewModel, _jsonOptions);
        return await repository.GetAsync(hash);
    }

    [HttpDelete("music/soft")]
    public async Task SoftDeleteTracks([FromBody] List<string> trackHashes)
    {
        if (!trackHashes.Any()) return;

        await repository.SoftDeleteTracksAsync(trackHashes);
    }

    [HttpPut("music/undelete")]
    public async Task UndeleteTracks([FromBody] List<string> trackHashes)
    {
        if (!trackHashes.Any()) return;

        await repository.UndeleteTracksAsync(trackHashes);
    }

    [HttpDelete("music/hard")]
    public async Task HardDeleteTracks([FromBody] List<string> trackHashes)
    {
        if (!trackHashes.Any()) return;

        await repository.HardDeleteTracksAsync(trackHashes);
    }
}