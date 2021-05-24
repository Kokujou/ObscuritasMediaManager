using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;

namespace ObscuritasMediaManager.Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PlaylistController : ControllerBase
    {
        private static readonly Dictionary<Guid, IEnumerable<string>> TemporaryPlaylistRepository
            = new();

        [HttpPost("temp")]
        public IActionResult CreateTemporaryPlaylist([FromBody] IEnumerable<string> entries)
        {
            var guid = Guid.NewGuid();
            TemporaryPlaylistRepository.Add(guid, entries);
            return Ok(guid);
        }

        [HttpGet("temp/{guid:Guid}")]
        public IActionResult GetTemporaryPlaylist(Guid guid)
        {
            try
            {
                return Ok(TemporaryPlaylistRepository[guid]);
            }
            catch
            {
                return NotFound();
            }
        }
    }
}