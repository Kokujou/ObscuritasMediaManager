using System.Text.Json;
using System.Text.Json.Nodes;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.VisualBasic.FileIO;
using ObscuritasMediaManager.Backend.Controllers.Requests;
using ObscuritasMediaManager.Backend.Data;
using ObscuritasMediaManager.Backend.DataRepositories;
using ObscuritasMediaManager.Backend.Extensions;
using ObscuritasMediaManager.Backend.Models;
using ObscuritasMediaManager.Backend.Services;
using SearchOption = System.IO.SearchOption;

namespace ObscuritasMediaManager.Backend.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class MediaController(
    MediaRepository mediaRepository,
    IOptions<JsonOptions> jsonOptions,
    AnimeLoadsService animeLoadsService) : ControllerBase
{
    private JsonSerializerOptions SerializerOptions => jsonOptions.Value.JsonSerializerOptions;

    [HttpGet("default")]
    public MediaModel GetDefault()
    {
        return MediaModel.CreateDefault();
    }

    [HttpGet("{guid:Guid}")]
    public async Task<MediaModel> Get([FromRoute] Guid guid)
    {
        return await mediaRepository.GetAsync(guid);
    }

    [HttpGet("{guid:Guid}/image")]
    public async Task<ActionResult> GetImageFor(Guid guid)
    {
        var image = await mediaRepository.GetMediaImageAsync(guid);
        return File(Convert.FromBase64String(image ?? string.Empty),
            "image/jpeg");
    }

    [HttpGet]
    public IQueryable<MediaModel> GetAll()
    {
        return mediaRepository.GetAll();
    }

    [HttpPost]
    public async Task<KeyValuePair<Guid?, ModelCreationState>> CreateFromMediaPathAsync(
        [FromBody] MediaCreationRequest request)
    {
        var directory = new DirectoryInfo(request.RootPath);
        if (!directory.Exists) return new(null, ModelCreationState.Invalid);

        if (!directory.GetFiles("*.*", SearchOption.AllDirectories)
                .Any(x => FFMPEGExtensions.HasVideoStreamAsync(x.FullName).Result))
            return new(null, ModelCreationState.Invalid);

        request.Entry ??= MediaModel.CreateDefault();
        request.Entry.Id = Guid.NewGuid();
        request.Entry.Language = request.Language;
        request.Entry.Type = request.Category;
        request.Entry.RootFolderPath = directory.FullName;

        return await mediaRepository.CreateAsync(request.Entry);
    }

    [HttpPut("{id}")]
    public async Task UpdateMedia(Guid id, [FromBody] UpdateRequest<dynamic> _)
    {
        var deserialized = await HttpContext.ReadRequestBodyAsync<UpdateRequest<JsonNode>>(SerializerOptions);
        await mediaRepository.UpdateAsync(id, deserialized.OldModel, deserialized.NewModel, SerializerOptions);
    }

    [HttpPut("{guid:Guid}/image")]
    public async Task AddMediaImage([FromBody] string image, Guid guid)
    {
        await mediaRepository.SetMediaImageAsync(guid, image);
    }

    [HttpDelete("{guid:Guid}/image")]
    public async Task DeleteMediaImage(Guid guid)
    {
        await mediaRepository.SetMediaImageAsync(guid, null);
    }

    [HttpDelete("{mediaId:Guid}/hard")]
    public async Task HardDeleteMedium(Guid mediaId)
    {
        await mediaRepository.DeleteAsync(mediaId);
    }

    [HttpDelete("{mediaId:Guid}/full")]
    public async Task FullDeleteMedium(Guid mediaId)
    {
        var medium = await mediaRepository.GetAsync(mediaId);
        await mediaRepository.DeleteAsync(mediaId);

        try
        {
            FileSystem.DeleteDirectory(medium.RootFolderPath, UIOption.OnlyErrorDialogs,
                RecycleOption.SendToRecycleBin);
        }
        catch (Exception ex)
        {
            Log.Error(ex, "Error when deleting media");
        }
    }

    [HttpPost("auto-fill-anime-details/{animeId}")]
    public async Task<MediaModel> AutoFillMediaDetailsAsync(Guid animeId)
    {
        var anime = await mediaRepository.GetAsync(animeId, true);
        return await animeLoadsService.AutoFillAnimeAsync(anime);
    }
}