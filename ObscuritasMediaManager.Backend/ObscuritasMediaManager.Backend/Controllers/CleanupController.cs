using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ObscuritasMediaManager.Backend.DataRepositories;
using ObscuritasMediaManager.Backend.Models;
using Xabe.FFmpeg;

namespace ObscuritasMediaManager.Backend.Controllers;

[Authorize]
[Route("api/[controller]")]
[ApiController]
public class CleanupController : ControllerBase
{
    private static bool ValidateAudio(string path)
    {
        try
        {
            var fileInfo = FFmpeg.GetMediaInfo(path).Result;

            return fileInfo.AudioStreams.Any();
        }
        catch (Exception)
        {
            return false;
        }
    }

    private readonly MusicRepository _musicRepository;

    public CleanupController(MusicRepository musicRepository)
    {
        _musicRepository = musicRepository;
    }

    [HttpGet("music")]
    public IEnumerable<MusicModel> GetBrokenAudioTracks()
    {
        var tracks = _musicRepository.GetAll();

        return tracks.AsParallel().Where(track => !ValidateAudio(track.Path));
    }

    [HttpDelete("music")]
    public async Task<ActionResult<IEnumerable<string>>> CleanupMusic([FromBody] List<string> trackHashes)
    {
        try
        {
            if (!trackHashes.Any())
                return NoContent();

            var selectedTracks = await _musicRepository.GetSelectedAsync(trackHashes);
            var selectedBrokenTracks = selectedTracks.AsParallel().Where(x => !ValidateAudio(x.Path)).ToList();
            var succeededHashes = selectedBrokenTracks.Select(x => x.Hash).ToList();
            var failedHashes = trackHashes.Except(succeededHashes).ToList();

            if (!succeededHashes.Any())
                throw new Exception("None of the provided hashes matches an existing broken track.");

            await _musicRepository.BatchDeleteTracks(selectedBrokenTracks);

            if (failedHashes.Any())
                return Ok(failedHashes);

            return NoContent();
        }
        catch (Exception e)
        {
            return BadRequest(e.ToString());
        }
    }
}