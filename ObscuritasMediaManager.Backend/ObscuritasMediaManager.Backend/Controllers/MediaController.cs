using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
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
        private readonly IGenreRepository _genreRepository;

        public MediaController(IMediaRepository repository, IGenreRepository genreRepository)
        {
            _repository = repository;
            _genreRepository = genreRepository;
        }

        [HttpGet("{animeName}/type/{animeType}")]
        public async Task<IActionResult> Get([FromRoute] string animeName, [FromRoute] string animeType)
        {
            try
            {
                return Ok(await _repository.GetAsync(animeName, animeType));
            }
            catch (Exception e)
            {
                return BadRequest(e.ToString());
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] string type = "")
        {
            try
            {
                return Ok(await _repository.GetAllAsync(type));
            }
            catch (Exception e)
            {
                return BadRequest(e.ToString());
            }
        }

        [HttpPost]
        public async Task<IActionResult> BatchPostStreamingEntries([FromBody] IEnumerable<MediaModel> media)
        {
            try
            {
                await _repository.BatchCreateMediaAsync(media);
                return NoContent();
            }
            catch (Exception e)
            {
                return BadRequest(e.ToString());
            }
        }

        [HttpPut("{mediaName}/type/{mediaType}")]
        public async Task<IActionResult> UpdateMedia(string mediaName, string mediaType, [FromBody] MediaModel media)
        {
            try
            {
                var genres = await _genreRepository.GetAllAsync();
                if (!string.IsNullOrEmpty(media.GenreString)
                    && (!media.Genres.All(mediaGenre => genres.Any(genre => genre.Name == mediaGenre))
                        || media.Genres.Any(genre => media.Genres.Count(x => x == genre) != 1)))
                    throw new Exception(
                        $"One of the specified genres is not in the range of values: {media.GenreString}.\n" +
                        $"Supported Genres are: {string.Join(",", genres)}");

                await _repository.UpdateMediaAsync(mediaName, mediaType, media);

                return NoContent();
            }
            catch (Exception e)
            {
                return BadRequest(e.ToString());
            }
        }


        [HttpPut("{mediaName}/type/{mediaType}/image")]
        public async Task<IActionResult> AddMediaImage([FromBody] UpdateImageRequest request,
            [FromRoute] string mediaName,
            [FromRoute] string mediaType)
        {
            try
            {
                await _repository.AddMediaImageAsync(mediaName, mediaType, request.Image);
                return NoContent();
            }
            catch (Exception e)
            {
                return BadRequest(e.ToString());
            }
        }

        [HttpDelete("{animeName}/type/{animeType}/image")]
        public async Task<IActionResult> DeleteMediaImage([FromRoute] string animeName,
            [FromRoute] string animeType)
        {
            try
            {
                await _repository.RemoveMediaImageAsync(animeName, animeType);
                return NoContent();
            }
            catch (Exception e)
            {
                return BadRequest(e.ToString());
            }
        }
    }
}