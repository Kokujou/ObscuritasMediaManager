using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using ObscuritasMediaManager.Backend.Controllers.Requests;
using ObscuritasMediaManager.Backend.Data.Music;
using ObscuritasMediaManager.Backend.DataRepositories;
using ObscuritasMediaManager.Backend.Extensions;
using ObscuritasMediaManager.Backend.Models;
using System.Text.Json;

namespace ObscuritasMediaManager.Backend.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class MusicController : ControllerBase
{
    private readonly MusicRepository _musicRepository;
    private readonly JsonSerializerOptions _jsonOptions;

    public MusicController(MusicRepository repository, IOptions<JsonOptions> jsonOptions)
    {
        _musicRepository = repository;
        _jsonOptions = jsonOptions.Value.JsonSerializerOptions;
    }

    [HttpPost]
    public async Task BatchCreateMusicTracks(IEnumerable<MusicModel> tracks)
    {
        var existingTracks = await _musicRepository.GetHashValuesAsync();
        var invalidTracks = new List<MusicModel>();
        var validTracks = new List<MusicModel>();
        foreach (var track in tracks)
        {
            if (!System.IO.File.Exists(track.Path))
            {
                invalidTracks.Add(track);
                continue;
            }

            track.CalculateHash();

            if (existingTracks.ContainsKey(track.Hash) && (existingTracks[track.Hash] == track.Path))
                continue;

            if (existingTracks.ContainsKey(track.Hash) && System.IO.File.Exists(existingTracks[track.Hash]))
                invalidTracks.Add(track);
            else if (existingTracks.ContainsKey(track.Hash))
                await _musicRepository.ChangeFilePathAsync(track.Hash, track.Path);
            else
                validTracks.Add(track.CalculateHash());
        }

        if (validTracks.Count > 0)
                await _musicRepository.BatchCreateMusicTracksAsync(validTracks);
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

    [HttpGet("instruments")]
    public async Task<IEnumerable<InstrumentModel>> GetInstruments()
    {
        return await _musicRepository.GetInstruments();
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
    public async Task UpdateAsync(string hash, [FromBody] UpdateRequest<MusicModel> _)
    {
        var deserialized = await HttpContext.ReadRequestBodyAsync<UpdateRequest<JsonElement>>(_jsonOptions);
        await _musicRepository.UpdateAsync(hash, deserialized.OldModel, deserialized.NewModel, _jsonOptions);
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