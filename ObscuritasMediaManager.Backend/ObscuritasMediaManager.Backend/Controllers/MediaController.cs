using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using ObscuritasMediaManager.Backend.Controllers.Requests;
using ObscuritasMediaManager.Backend.DataRepositories;
using ObscuritasMediaManager.Backend.Extensions;
using ObscuritasMediaManager.Backend.Models;
using ObscuritasMediaManager.Backend.Services;
using System.Text.Json;
using System.Text.Json.Nodes;

namespace ObscuritasMediaManager.Backend.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class MediaController(MediaRepository _mediaRepository, MediaImportService _mediaImportService,
    IOptions<JsonOptions> jsonOptions) : ControllerBase
{
    private JsonSerializerOptions _serializerOptions => jsonOptions?.Value.JsonSerializerOptions;

    [HttpGet("{guid:Guid}")]
    public async Task<MediaModel> Get([FromRoute] Guid guid)
    {
        return await _mediaRepository.GetAsync(guid);
    }

    [HttpGet]
    public IQueryable<MediaModel> GetAll()
    {
        return _mediaRepository.GetAll();
    }

    [HttpPost]
    public async Task BatchCreateMediaAsync([FromBody] IEnumerable<MediaModel> media)
    {
        await _mediaRepository.BatchCreateMediaAsync(media);
    }

    [HttpPut("{id}")]
    public async Task UpdateMedia(Guid id, [FromBody] UpdateRequest<MediaModel> _)
    {
        var deserialized = await HttpContext.ReadRequestBodyAsync<UpdateRequest<JsonNode>>(_serializerOptions);
        await _mediaRepository.UpdateAsync(id, deserialized.OldModel, deserialized.NewModel, _serializerOptions);
    }

    [HttpPut("{guid:Guid}/image")]
    public async Task AddMediaImage([FromBody] string image, Guid guid)
    {
        await _mediaRepository.AddMediaImageAsync(guid, image);
    }

    [HttpDelete("{guid:Guid}/image")]
    public async Task DeleteMediaImage(Guid guid)
    {
        await _mediaRepository.RemoveMediaImageAsync(guid);
    }

    [HttpPost("import")]
    public async IAsyncEnumerable<MediaModel> ImportRootFolderAsync([FromBody] string rootFolderPath)
    {
        await foreach (var media in _mediaImportService.ImportRootFolderAsync(rootFolderPath))
        {
            yield return media;
            await Response.Body.FlushAsync();
        }
        ;
    }
}