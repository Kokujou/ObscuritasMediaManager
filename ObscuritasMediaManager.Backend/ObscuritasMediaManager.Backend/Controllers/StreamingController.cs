using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ObscuritasMediaManager.Backend.DataRepositories;
using ObscuritasMediaManager.Backend.Models;

namespace ObscuritasMediaManager.Backend.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class StreamingController : ControllerBase
{
    private readonly StreamingRepository _repository;

    public StreamingController(StreamingRepository repository)
    {
        _repository = repository;
    }

    [HttpPost]
    public async Task BatchPostStreamingEntries([FromBody] IEnumerable<StreamingEntryModel> streamingEntries)
    {
        await _repository.BatchCreateStreamingEntriesAsync(streamingEntries);
    }

    [HttpGet("{guid:Guid}/season/{season}/episode/{episode}")]
    public async Task<StreamingEntryModel> GetStream(Guid guid, string season, int episode)
    {
        return await _repository.GetAsync(guid, season, episode);
    }
}