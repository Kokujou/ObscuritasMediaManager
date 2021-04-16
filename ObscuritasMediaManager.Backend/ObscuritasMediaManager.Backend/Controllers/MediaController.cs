using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using ObscuritasMediaManager.Backend.DataRepositories.Interfaces;
using ObscuritasMediaManager.Backend.Models;

namespace ObscuritasMediaManager.Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MediaController : ControllerBase
    {
        private readonly IMediaRepository _repository;

        public MediaController(IMediaRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            return Ok(new {status = 200});
        }

        [HttpPost]
        public IActionResult BatchPostStreamingEntries([FromBody] IEnumerable<MediaModel> media)
        {
            try
            {
                _repository.BatchCreateMedia(media);
                return NoContent();
            }
            catch (Exception e)
            {
                return BadRequest(e.ToString());
            }
        }
    }
}