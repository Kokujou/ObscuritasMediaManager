using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ObscuritasMediaManager.Backend.Controllers.Requests;
using ObscuritasMediaManager.Backend.DataRepositories;
using ObscuritasMediaManager.Backend.Models;

namespace ObscuritasMediaManager.Backend.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class MusicController : ControllerBase
{
    private readonly MusicRepository _repository;

    public MusicController(MusicRepository repository)
    {
        _repository = repository;
    }

    [HttpPost]
    public async Task<ActionResult> BatchCreateMusicTracks(IEnumerable<MusicModel> tracks)
    {
        try
        {
            var existingTracks = await _repository.GetHashValuesAsync();
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

                if (existingTracks.ContainsKey(track.Hash) && existingTracks[track.Hash] == track.Path)
                    continue;

                if (existingTracks.ContainsKey(track.Hash) && System.IO.File.Exists(existingTracks[track.Hash]))
                    invalidTracks.Add(track);
                else if (existingTracks.ContainsKey(track.Hash))
                    await _repository.ChangeFilePathAsync(track.Hash, track.Path);
                else
                    validTracks.Add(track.CalculateHash());
            }

            if (validTracks.Count > 0)
                await _repository.BatchCreateMusicTracksAsync(validTracks);
            return NoContent();
        }
        catch (Exception e)
        {
            return BadRequest(e.ToString());
        }
    }

    [HttpPost("recalculate-hashes")]
    public async Task<ActionResult> RecalculateHashes()
    {
        try
        {
            await _repository.RecalculateHashesAsync();
            return NoContent();
        }
        catch (Exception e)
        {
            return BadRequest(e.ToString());
        }
    }

    [HttpGet]
    public IQueryable<MusicModel> GetAll()
    {
        return _repository.GetAll();
    }

    [HttpGet("{hash}")]
    public async Task<ActionResult<MusicModel>> GetAsync(string hash)
    {
        try
        {
            return Ok(await _repository.GetAsync(hash));
        }
        catch (Exception e)
        {
            return BadRequest(e.ToString());
        }
    }

    [HttpGet("instruments")]
    public async Task<ActionResult<IEnumerable<InstrumentModel>>> GetInstruments()
    {
        try
        {
            return Ok(await _repository.GetInstruments());
        }
        catch (Exception e)
        {
            return BadRequest(e.ToString());
        }
    }

    [HttpPut("{hash}")]
    public async Task<ActionResult> UpdateAsync(string hash, [FromBody] UpdateRequest<MusicModel> updateRequest)
    {
        try
        {
            if (updateRequest.OldModel.Hash != default && hash != updateRequest.OldModel.Hash)
                return BadRequest("Ids of objects did not match");
            var invalidInstruments = await GetInvalidInstrumentsAsync(updateRequest.NewModel.Instruments);
            if (invalidInstruments.Count > 0)
                return BadRequest($"sent instruments invalid: {string.Join(",", invalidInstruments)}");

            await _repository.UpdateAsync(hash, updateRequest.OldModel, updateRequest.NewModel);
            return NoContent();
        }
        catch (Exception e)
        {
            return BadRequest(e.ToString());
        }
    }

    private async Task<List<string>> GetInvalidInstrumentsAsync(IEnumerable<string> instrumentNames)
    {
        instrumentNames = instrumentNames.ToList();
        if (!instrumentNames.Any()) return new List<string>();

        var instruments = await _repository.GetInstruments();
        var instrumentStrings = instruments.Select(x => x.Name);
        var invalidInstruments = instrumentNames.Except(instrumentStrings).ToList();
        return invalidInstruments;
    }
}