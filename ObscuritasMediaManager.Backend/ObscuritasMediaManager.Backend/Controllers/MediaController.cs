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

        [HttpGet("{guid:Guid}")]
        public async Task<IActionResult> Get([FromRoute] Guid guid)
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

        [HttpPut]
        public async Task<IActionResult> UpdateMedia([FromBody] MediaModel media)
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


                await _repository.UpdateMediaAsync(media);

                return NoContent();
            }
            catch (Exception e)
            {
                return BadRequest(e.ToString());
            }
        }


        [HttpPut("{guid:Guid}/image")]
        public async Task<IActionResult> AddMediaImage([FromBody] UpdateImageRequest request,
            Guid guid)
        {
            try
            {
                await _repository.AddMediaImageAsync(guid, request.Image);
                return NoContent();
            }
            catch (Exception e)
            {
                return BadRequest(e.ToString());
            }
        }

        [HttpDelete("{guid:Guid}/image")]
        public async Task<IActionResult> DeleteMediaImage(Guid guid)
        {
            try
            {
                await _repository.RemoveMediaImageAsync(guid);
                return NoContent();
            }
            catch (Exception e)
            {
                return BadRequest(e.ToString());
            }
        }
    }
}