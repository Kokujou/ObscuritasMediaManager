using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using ObscuritasMediaManager.Backend.Controllers.Requests;
using ObscuritasMediaManager.Backend.DataRepositories.Interfaces;
using ObscuritasMediaManager.Backend.Exceptions;
using ObscuritasMediaManager.Backend.Models;

namespace ObscuritasMediaManager.Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MediaController : ControllerBase
    {
        private readonly IMediaRepository _repository;
        private readonly IGenreRepository _genreRepository;

        public MediaController(IMediaRepository repository, IGenreRepository genreRepository)
        {
            _repository = repository;
            _genreRepository = genreRepository;
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
            catch (ModelCreationFailedException<MediaModel> e)
            {
                return BadRequest(e.ToString());
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
                var genres = _genreRepository.GetAll();
                if (!string.IsNullOrEmpty(media.GenreString)
                    && (!media.Genres.All(mediaGenre => genres.Any(genre => genre.Name == mediaGenre))
                        || media.Genres.Any(genre => media.Genres.Count(x => x == genre) != 1)))
                    throw new Exception(
                        $"One of the specified genres is not in the range of values: {media.GenreString}.\n" +
                        $"Supported Genres are: {string.Join(",", genres)}");

                _repository.UpdateMedia(media);

                return NoContent();
            }
            catch (Exception e)
            {
                return BadRequest(e.ToString());
            }
        }

        [HttpPut("{mediaName}/type/{mediaType}/image")]
        public IActionResult AddMediaImage([FromBody] UpdateImageRequest request, [FromRoute] string mediaName,
            [FromRoute] string mediaType)
        {
            try
            {
                _repository.AddMediaImage(mediaName, mediaType, request.Image);
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