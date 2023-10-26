using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ObscuritasMediaManager.Backend.DataRepositories;
using ObscuritasMediaManager.Backend.Extensions;
using ObscuritasMediaManager.Backend.Models;

namespace ObscuritasMediaManager.Backend.Controllers;

[Authorize]
[Route("api/[controller]")]
[ApiController]
public class CleanupController : ControllerBase
{
    private static bool ValidateAudio(string path)
    {
        return FFMPEGExtensions.HasAudioStreamAsync(path).Result;
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
}