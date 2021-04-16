using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using ObscuritasMediaManager.Backend.Controllers.Requests;
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
            try
            {
                return Ok(_repository.Get(animeName, animeType));
            }
            catch (Exception e)
            {
                return BadRequest(e.ToString());
            }
        }

        [HttpGet]
        public IActionResult GetAll([FromQuery] string type = "")
        {
            try
            {
                return Ok(_repository.GetAll(type));
            }
            catch (Exception e)
            {
                return BadRequest(e.ToString());
            }
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

        [HttpPut]
        public IActionResult UpdateMedia([FromBody] MediaModel media)
        {
            try
            {
                _repository.UpdateMedia(media);
                return NoContent();
            }
            catch (Exception e)
            {
                return BadRequest(e.ToString());
            }
        }

        [HttpPut("{animeName}/type/{animeType}/image")]
        public IActionResult AddMediaImage([FromBody] UpdateImageRequest request, [FromRoute] string animeName,
            [FromRoute] string animeType)
        {
            try
            {
                _repository.AddMediaImage(animeName, animeType, request.Image);
                return NoContent();
            }
            catch (Exception e)
            {
                return BadRequest(e.ToString());
            }
        }

        [HttpDelete("{animeName}/type/{animeType}/image")]
        public IActionResult DeleteMediaImage([FromRoute] string animeName,
            [FromRoute] string animeType)
        {
            try
            {
                _repository.RemoveMediaImage(animeName, animeType);
                return NoContent();
            }
            catch (Exception e)
            {
                return BadRequest(e.ToString());
            }
        }
    }
}