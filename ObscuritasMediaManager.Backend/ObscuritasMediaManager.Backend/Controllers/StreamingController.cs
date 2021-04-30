using System;
using System.Collections.Generic;
using System.Linq;
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
        public IActionResult BatchPostStreamingEntries([FromBody] IEnumerable<StreamingEntryModel> streamingEntries)
        {
            try
            {
                _repository.BatchCreateStreamingEntries(streamingEntries);
                return NoContent();
            }
            catch (Exception e)
            {
                return BadRequest(e.ToString());
            }
        }

        [HttpGet("{mediaName}/type/{mediaType}")]
        public IActionResult GetStreamingEntry(string mediaName, string mediaType)
        {
            try
            {
                return Ok(_repository.Get(mediaName, mediaType));
            }
            catch (Exception e)
            {
                return BadRequest(e.ToString());
            }
        }

        [HttpGet("{mediaName}/type/{mediaType}/season/{season}/episode/{episode}")]
        public IActionResult GetStream(string mediaName, string mediaType, string season, int episode)
        {
            var entry = _repository.Get(mediaName, mediaType, season, episode).Single();
            return Ok(entry);
        }
    }
}