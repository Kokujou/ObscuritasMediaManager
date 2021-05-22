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
    public class StreamingController : ControllerBase
    {
        private readonly IStreamingRepository _repository;

        public StreamingController(IStreamingRepository repository)
        {
            _repository = repository;
        }


        [HttpPost]
        public async Task<IActionResult> BatchPostStreamingEntries(
            [FromBody] IEnumerable<StreamingEntryModel> streamingEntries)
        {
            try
            {
                await _repository.BatchCreateStreamingEntriesAsync(streamingEntries);
                return NoContent();
            }
            catch (Exception e)
            {
                return BadRequest(e.ToString());
            }
        }

        [HttpGet("{mediaName}/type/{mediaType}")]
        public async Task<IActionResult> GetStreamingEntry(string mediaName, string mediaType)
        {
            try
            {
                return Ok(await _repository.GetAsync(mediaName, mediaType));
            }
            catch (Exception e)
            {
                return BadRequest(e.ToString());
            }
        }

        [HttpGet("{mediaName}/type/{mediaType}/season/{season}/episode/{episode}")]
        public async Task<IActionResult> GetStream(string mediaName, string mediaType, string season, int episode)
        {
            var entry = await _repository.GetAsync(mediaName, mediaType, season, episode);
            return Ok(entry);
        }
    }
}