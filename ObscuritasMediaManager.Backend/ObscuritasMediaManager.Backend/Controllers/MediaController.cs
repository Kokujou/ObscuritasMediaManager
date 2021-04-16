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

        [HttpGet("{animeName}/type/{animeType}")]
        public IActionResult Get([FromRoute] string animeName, [FromRoute] string animeType)
        {
            return Ok(_repository.Get(animeName, animeType));
        }

        [HttpGet]
        public IActionResult GetAll([FromQuery] string type = "")
        {
            return Ok(_repository.GetAll(type));
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