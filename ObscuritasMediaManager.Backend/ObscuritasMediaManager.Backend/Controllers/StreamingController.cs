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
    public class StreamingController : ControllerBase
    {
        private readonly StreamingRepository _repository;

        public StreamingController(StreamingRepository repository)
        {
            _repository = repository;
        }

        [HttpPost]
        public async Task<ActionResult> BatchPostStreamingEntries(
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

        [HttpGet("{guid:Guid}")]
        public async Task<ActionResult<IEnumerable<StreamingEntryModel>>> GetStreamingEntries(Guid guid)
        {
            try
            {
                return Ok(await _repository.GetAsync(guid));
            }
            catch (Exception e)
            {
                return BadRequest(e.ToString());
            }
        }

        [HttpGet("{guid:Guid}/season/{season}/episode/{episode}")]
        public async Task<ActionResult<StreamingEntryModel>> GetStream(Guid guid, string season, int episode)
        {
            var entry = await _repository.GetAsync(guid, season, episode);
            return Ok(entry);
        }
    }
}