using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ObscuritasMediaManager.Backend.DataRepositories;
using ObscuritasMediaManager.Backend.Extensions;
using ObscuritasMediaManager.Backend.Models;

namespace ObscuritasMediaManager.Backend.Controllers;

[Authorize]
[Route("api/[controller]")]
[ApiController]
public class CleanupController(MusicRepository musicRepository) : ControllerBase
{
    private static async Task<bool> ValidateAudioAsync(string path)
    {
        return await FFMPEGExtensions.HasAudioStreamAsync(path);
    }

    private static async Task<bool> ValidateVideoAsync(string path)
    {
        return await FFMPEGExtensions.HasVideoStreamAsync(path);
    }

    [HttpGet("music")]
    public IEnumerable<MusicModel> GetBrokenAudioTracks()
    {
        var tracks = musicRepository.GetAll();

        return tracks.AsParallel().Where(track => !ValidateAudioAsync(track.Path).Result);
    }

    [HttpPost("validate-media-root")]
    public bool ValidateMediaRoot([FromBody] string rootPath)
    {
        if (!Directory.Exists(rootPath)) return false;
        return Directory.GetFiles(rootPath, "*.*", SearchOption.AllDirectories).Any(x => ValidateVideoAsync(x).Result);
    }
}