using System;
using System.Collections.Generic;
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
    }
}