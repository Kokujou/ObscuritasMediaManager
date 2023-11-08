using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using ObscuritasMediaManager.Backend.Controllers.Requests;
using ObscuritasMediaManager.Backend.Data;
using ObscuritasMediaManager.Backend.Data.Media;
using ObscuritasMediaManager.Backend.Data.Music;
using ObscuritasMediaManager.Backend.DataRepositories;
using ObscuritasMediaManager.Backend.Extensions;
using ObscuritasMediaManager.Backend.Models;
using System.Text.Json;
using System.Text.Json.Nodes;

namespace ObscuritasMediaManager.Backend.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class MediaController(MediaRepository _mediaRepository, IOptions<JsonOptions> jsonOptions) : ControllerBase
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
    public async Task<KeyValuePair<Guid?, ModelCreationState>> CreateFromMediaAsync([FromBody] string mediaPath,
        MediaCategory category, Language language)
    {
        var directory = new DirectoryInfo(mediaPath);
        if (!directory.Exists) return new(null, ModelCreationState.Invalid);

        if (directory.GetFiles("*.*", SearchOption.AllDirectories)
            .Any(x => FFMPEGExtensions.HasVideoOrSubtitleStreamAsync(x.FullName).Result))
            return new(null, ModelCreationState.Invalid);

        var mediaId = Guid.NewGuid();
        await _mediaRepository.CreateAsync(
            new()
            {
                Id = mediaId,
                Type = category,
                Language = language,
                Genres = new List<GenreModel>(),
                Name = directory.Name,
                RootFolderPath = directory.FullName,
                Status = MediaStatus.Completed,
                Release = 1900,
            });
        return new(mediaId, ModelCreationState.Success);
    }

    [HttpPut("{id}")]
    public async Task UpdateMedia(Guid id, [FromBody] UpdateRequest<JsonElement> _)
    {
        var deserialized = await HttpContext.ReadRequestBodyAsync<UpdateRequest<JsonNode>>(_serializerOptions);
        await _mediaRepository.UpdateAsync(id, deserialized.OldModel, deserialized.NewModel, _serializerOptions);
    }

    [HttpPut("{guid:Guid}/image")]
    public async Task AddMediaImage([FromBody] string image, Guid guid)
    {
        await _mediaRepository.UpdatePropertyAsync(guid, x => x.Image, image);
    }

    [HttpDelete("{guid:Guid}/image")]
    public async Task DeleteMediaImage(Guid guid)
    {
        await _mediaRepository.UpdatePropertyAsync(guid, x => x.Image, string.Empty);
    }
}