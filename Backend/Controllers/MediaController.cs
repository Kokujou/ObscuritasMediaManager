using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.VisualBasic.FileIO;
using ObscuritasMediaManager.Backend.Controllers.Requests;
using ObscuritasMediaManager.Backend.Data;
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

    [HttpGet("default")]
    public MediaModel GetDefault()
    {
        return MediaModel.CreateDefault();
    }

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
    public async Task<KeyValuePair<Guid?, ModelCreationState>> CreateFromMediaPathAsync([FromBody] MediaCreationRequest request)
    {
        var directory = new DirectoryInfo(request.RootPath);
        if (!directory.Exists) return new(null, ModelCreationState.Invalid);

        if (!directory.GetFiles("*.*", System.IO.SearchOption.AllDirectories)
            .Any(x => FFMPEGExtensions.HasVideoStreamAsync(x.FullName).Result))
            return new(null, ModelCreationState.Invalid);

        request.Entry ??= MediaModel.CreateDefault();
        request.Entry.Id = Guid.NewGuid();
        request.Entry.Language = request.Language;
        request.Entry.Type = request.Category;
        request.Entry.RootFolderPath = directory.FullName;

        return await _mediaRepository.CreateAsync(request.Entry);
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

    [HttpDelete("{mediaId:Guid}/hard")]
    public async Task HardDeleteMedium(Guid mediaId)
    {
        await _mediaRepository.DeleteAsync(mediaId);
    }

    [HttpDelete("{mediaId:Guid}/full")]
    public async Task FullDeleteMedium(Guid mediaId)
    {
        var medium = await _mediaRepository.GetAsync(mediaId);
        await _mediaRepository.DeleteAsync(mediaId);

        try
        {
            FileSystem.DeleteDirectory(medium.RootFolderPath, UIOption.OnlyErrorDialogs, RecycleOption.SendToRecycleBin);
        }
        catch { }
    }
}