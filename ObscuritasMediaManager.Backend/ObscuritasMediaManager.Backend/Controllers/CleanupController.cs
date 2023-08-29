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

    [HttpDelete("music/soft")]
    public async Task SoftDeleteTracks([FromBody] List<string> trackHashes)
    {
        if (!trackHashes.Any()) return;

        await _musicRepository.SoftDeleteTracksAsync(trackHashes);
    }

    [HttpDelete("music/hard")]
    public async Task HardDeleteTracks([FromBody] List<string> trackHashes)
    {
        if (!trackHashes.Any()) return;

        await _musicRepository.HardDeleteTracksAsync(trackHashes);
    }
}