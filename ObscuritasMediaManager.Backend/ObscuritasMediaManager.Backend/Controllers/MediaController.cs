using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ObscuritasMediaManager.Backend.DataRepositories;
using ObscuritasMediaManager.Backend.Models;

namespace ObscuritasMediaManager.Backend.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class MediaController : ControllerBase
{
    private readonly GenreRepository _genreRepository;
    private readonly MediaRepository _repository;

    public MediaController(MediaRepository repository, GenreRepository genreRepository)
    {
        _repository = repository;
        _genreRepository = genreRepository;
    }

    [HttpGet("{guid:Guid}")]
    public async Task<ActionResult<MediaModel>> Get([FromRoute] Guid guid)
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
    public async Task<ActionResult<IEnumerable<MediaModel>>> GetAll([FromQuery] string type = "")
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
    public async Task<ActionResult> BatchCreateMediaAsync([FromBody] IEnumerable<MediaModel> media)
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
    public async Task<ActionResult> UpdateMedia([FromBody] MediaModel media)
    {
        try
        {
            await _repository.UpdateMediaAsync(media);

            return NoContent();
        }
        catch (Exception e)
        {
            return BadRequest(e.ToString());
        }
    }

    [HttpPut("{guid:Guid}/image")]
    public async Task<ActionResult> AddMediaImage([FromBody] string image, Guid guid)
    {
        try
        {
            await _repository.AddMediaImageAsync(guid, image);
            return NoContent();
        }
        catch (Exception e)
        {
            return BadRequest(e.ToString());
        }
    }

    [HttpDelete("{guid:Guid}/image")]
    public async Task<ActionResult> DeleteMediaImage(Guid guid)
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