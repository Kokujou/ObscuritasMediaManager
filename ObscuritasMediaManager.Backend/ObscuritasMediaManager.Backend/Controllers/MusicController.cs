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
    public class MusicController : ControllerBase
    {
        private readonly IMusicRepository _repository;

        public MusicController(IMusicRepository repository)
        {
            _repository = repository;
        }

        [HttpPost]
        public async Task<IActionResult> BatchCreateMusicTracks(IEnumerable<MusicModel> tracks)
        {
            try
            {
                await _repository.BatchCreateMusicTracksAsync(tracks);
                return NoContent();
            }
            catch (Exception e)
            {
                return BadRequest(e.ToString());
            }
        }
    }
}