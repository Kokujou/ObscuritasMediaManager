using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ObscuritasMediaManager.Backend.DataRepositories;
using ObscuritasMediaManager.Backend.Models;

namespace ObscuritasMediaManager.Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PlaylistController : ControllerBase
    {
        private static readonly Dictionary<Guid, IEnumerable<string>> TemporaryPlaylistRepository
            = new();

        private readonly MusicRepository _musicRepository;

        public PlaylistController(MusicRepository musicRepository)
        {
            _musicRepository = musicRepository;
        }

        [HttpPost("temp")]
        public IActionResult CreateTemporaryPlaylist([FromBody] IEnumerable<string> hashes)
        {
            var guid = Guid.NewGuid();
            TemporaryPlaylistRepository.Add(guid, hashes);
            return Ok(guid);
        }

        [HttpGet("temp/{guid:Guid}")]
        public async Task<IActionResult> GetTemporaryPlaylist(Guid guid)
        {
            try
            {
                var trackHashes = TemporaryPlaylistRepository[guid];
                var tracks = new List<MusicModel>();
                foreach (var hash in trackHashes) tracks.Add(await _musicRepository.GetAsync(hash));
                return Ok(tracks);
            }
            catch
            {
                return NotFound();
            }
        }
    }
}