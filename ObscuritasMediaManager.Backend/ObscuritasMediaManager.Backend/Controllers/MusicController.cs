using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ObscuritasMediaManager.Backend.Controllers.Requests;
using ObscuritasMediaManager.Backend.Data.Music;
using ObscuritasMediaManager.Backend.DataRepositories;
using ObscuritasMediaManager.Backend.Models;

namespace ObscuritasMediaManager.Backend.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class MusicController : ControllerBase
{
    private readonly MusicRepository _musicRepository;

    public MusicController(MusicRepository repository)
    {
        _musicRepository = repository;
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
    public async Task UpdateAsync(string hash, [FromBody] UpdateRequest<MusicModel> updateRequest)
    {
        if ((updateRequest.OldModel.Hash != default) && (hash != updateRequest.OldModel.Hash))
                throw new Exception("Ids of objects did not match");
        var invalidInstruments = await GetInvalidInstrumentsAsync(updateRequest.NewModel.Instruments);
        if (invalidInstruments.Count > 0)
                throw new Exception($"sent instruments invalid: {string.Join(",", invalidInstruments)}");

        await _musicRepository.UpdateAsync(hash, updateRequest.OldModel, updateRequest.NewModel);
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

    private async Task<List<string>> GetInvalidInstrumentsAsync(IEnumerable<string> instrumentNames)
    {
        instrumentNames = instrumentNames.ToList();
        if (!instrumentNames.Any()) return new List<string>();

        var instruments = await _musicRepository.GetInstruments();
        var instrumentStrings = instruments.Select(x => x.Name);
        var invalidInstruments = instrumentNames.Except(instrumentStrings).ToList();
        return invalidInstruments;
    }
}