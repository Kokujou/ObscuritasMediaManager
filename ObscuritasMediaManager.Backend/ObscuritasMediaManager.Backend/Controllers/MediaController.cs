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
    public async Task<MediaModel> Get([FromRoute] Guid guid)
    {
        return await _repository.GetAsync(guid);
    }

    [HttpGet]
    public IQueryable<MediaModel> GetAll()
    {
        return _repository.GetAll();
    }

    [HttpPost]
    public async Task BatchCreateMediaAsync([FromBody] IEnumerable<MediaModel> media)
    {
        await _repository.BatchCreateMediaAsync(media);
    }

    [HttpPut]
    public async Task UpdateMedia([FromBody] MediaModel media)
    {
        await _repository.UpdateMediaAsync(media);
    }

    [HttpPut("{guid:Guid}/image")]
    public async Task AddMediaImage([FromBody] string image, Guid guid)
    {
        await _repository.AddMediaImageAsync(guid, image);
    }

    [HttpDelete("{guid:Guid}/image")]
    public async Task DeleteMediaImage(Guid guid)
    {
        await _repository.RemoveMediaImageAsync(guid);
    }
}