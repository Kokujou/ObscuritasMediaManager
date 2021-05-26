using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ObscuritasMediaManager.Backend.DataRepositories.Interfaces;
using ObscuritasMediaManager.Backend.Models;

namespace ObscuritasMediaManager.Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PlaylistController : ControllerBase
    {
        private static readonly Dictionary<Guid, IEnumerable<Guid>> TemporaryPlaylistRepository
            = new();

        private readonly IMusicRepository _musicRepository;

        public PlaylistController(IMusicRepository musicRepository)
        {
            _musicRepository = musicRepository;
        }

        [HttpPost("temp")]
        public IActionResult CreateTemporaryPlaylist([FromBody] IEnumerable<Guid> entries)
        {
            var guid = Guid.NewGuid();
            TemporaryPlaylistRepository.Add(guid, entries);
            return Ok(guid);
        }

        [HttpGet("temp/{guid:Guid}")]
        public async Task<IActionResult> GetTemporaryPlaylist(Guid guid)
        {
            try
            {
                var trackIds = TemporaryPlaylistRepository[guid];
                var tracks = new List<MusicModel>();
                foreach (var id in trackIds) tracks.Add(await _musicRepository.GetAsync(id));
                return Ok(tracks);
            }
            catch
            {
                return NotFound();
            }
        }
    }
}