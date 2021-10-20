using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ObscuritasMediaManager.Backend.DataRepositories;
using ObscuritasMediaManager.Backend.Models;
using Xabe.FFmpeg;

namespace ObscuritasMediaManager.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CleanupController : ControllerBase
    {
        private readonly MusicRepository _musicRepository;

        public CleanupController(MusicRepository musicRepository)
        {
            _musicRepository = musicRepository;
        }

        [HttpGet("music")]
        public async Task<ActionResult<IEnumerable<MusicModel>>> GetBrokenAudioTracks()
        {
            var tracks = await _musicRepository.GetAllAsync();

            return Ok(tracks.AsParallel().Where(track => !ValidateAudioAsync(track.Path)));
        }

        public bool ValidateAudioAsync(string path)
        {
            try
            {
                var fileInfo = FFmpeg.GetMediaInfo(path).Result;

                return fileInfo.AudioStreams.Any();
            }
            catch (Exception e)
            {
                return false;
            }
        }
    }
}