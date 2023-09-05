using Genius;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using ObscuritasMediaManager.Backend.Controllers.Requests;
using ObscuritasMediaManager.Backend.Data.Music;
using ObscuritasMediaManager.Backend.DataRepositories;
using ObscuritasMediaManager.Backend.Extensions;
using ObscuritasMediaManager.Backend.Models;
using System.Text.Json;
using System.Text.RegularExpressions;

namespace ObscuritasMediaManager.Backend.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class MusicController : ControllerBase
{
    private readonly MusicRepository _musicRepository;
    private readonly JsonSerializerOptions _jsonOptions;
    private readonly GeniusClient _geniusClient;

    public MusicController(MusicRepository repository, IOptions<JsonOptions> jsonOptions, GeniusClient geniusClient)
    {
        _musicRepository = repository;
        _jsonOptions = jsonOptions.Value.JsonSerializerOptions;
        _geniusClient = geniusClient;
    }

    [HttpPost]
    public async Task BatchCreateMusicTracks(IEnumerable<MusicModel> tracks)
    {
        var existingTracks = await _musicRepository.GetHashValuesAsync();
        var invalidTracks = new List<MusicModel>();
        var validTracks = new List<MusicModel>();
        foreach (var track in tracks)
        {
            if (!System.IO.File.Exists(track.Path))
            {
                invalidTracks.Add(track);
                continue;
            }

            track.CalculateHash();

            if (existingTracks.ContainsKey(track.Hash) && (existingTracks[track.Hash] == track.Path))
                continue;

            if (existingTracks.ContainsKey(track.Hash) && System.IO.File.Exists(existingTracks[track.Hash]))
                invalidTracks.Add(track);
            else if (existingTracks.ContainsKey(track.Hash))
                await _musicRepository.ChangeFilePathAsync(track.Hash, track.Path);
            else
                validTracks.Add(track.CalculateHash());
        }

        if (validTracks.Count > 0)
                await _musicRepository.BatchCreateMusicTracksAsync(validTracks);
    }

    [HttpPost("recalculate-hashes")]
    public async Task RecalculateHashes()
    {
        await _musicRepository.RecalculateHashesAsync();
    }

    [HttpGet]
    public IQueryable<MusicModel> GetAll()
    {
        return _musicRepository.GetAll();
    }

    [HttpGet("{hash}")]
    public async Task<MusicModel> GetAsync(string hash)
    {
        return await _musicRepository.GetAsync(hash);
    }

    [HttpGet("{hash}/lyrics")]
    public async Task<string> GetLyricsAsync(string hash)
    {
        var track = await GetAsync(hash);
        var search = track.Name;
        if (!string.IsNullOrEmpty(track.Author) && (track.Author.ToLower() != "unset")) 
            search += $" {track.Author}";
        search += " Romanized";

        var searchResult = await _geniusClient.SearchClient.Search(search);
        var relevantHits = searchResult.Response.Hits
            .Where(x => x.Type == "song")
            .Select(x => x.Result)
            .Where(x => x.LyricsState == "complete")
            .ToList();

        if (relevantHits.Count == 0)
            throw new Exception("no lyrics found");

        var firstHitId = relevantHits[0].Id;
        using var client = new HttpClient();
        var stupidShittyEmbedJsResponse = await client.GetAsync(@$"https://genius.com/songs/{firstHitId}/embed.js");
        var stupidShittyEmbedJsContent = await stupidShittyEmbedJsResponse.Content.ReadAsStringAsync();

        var shittyStartTag = @"<div class=\\\""rg_embed_body\\\"">";
        var htmlTagStart = stupidShittyEmbedJsContent.IndexOf(shittyStartTag) + shittyStartTag.Length;
        var htmlTagEnd = stupidShittyEmbedJsContent.IndexOf(@"<div class=\\\""rg_embed_footer\\\"">");
        var htmlCode = stupidShittyEmbedJsContent[htmlTagStart..htmlTagEnd].Replace("\\\\n", string.Empty).Replace("<br>", "\n");
        htmlCode = Regex.Replace(htmlCode, "<.*>", string.Empty);

        return htmlCode;
    }

    [HttpGet("instruments")]
    public async Task<IEnumerable<InstrumentModel>> GetInstruments()
    {
        return await _musicRepository.GetInstruments();
    }

    [HttpPut("instrument/{name}/type/{type}")]
    public async Task AddInstrument(InstrumentType type, string name)
    {
        var newInstrument = new InstrumentModel { Name = name, Type = type };
        await _musicRepository.AddInstrumentAsync(newInstrument);
    }

    [HttpDelete("instrument/{name}/type/{type}")]
    public async Task RemoveInstrument(InstrumentType type, string name)
    {
        await _musicRepository.RemoveInstrumentAsync(type, name);
    }

    [HttpPut("{hash}")]
    public async Task UpdateAsync(string hash, [FromBody] UpdateRequest<MusicModel> _)
    {
        var deserialized = await HttpContext.ReadRequestBodyAsync<UpdateRequest<JsonElement>>(_jsonOptions);
        await _musicRepository.UpdateAsync(hash, deserialized.OldModel, deserialized.NewModel, _jsonOptions);
    }

    [HttpDelete("music/soft")]
    public async Task SoftDeleteTracks([FromBody] List<string> trackHashes)
    {
        if (!trackHashes.Any()) return;

        await _musicRepository.SoftDeleteTracksAsync(trackHashes);
    }

    [HttpPut("music/undelete")]
    public async Task UndeleteTracks([FromBody] List<string> trackHashes)
    {
        if (!trackHashes.Any()) return;

        await _musicRepository.UndeleteTracksAsync(trackHashes);
    }

    [HttpDelete("music/hard")]
    public async Task HardDeleteTracks([FromBody] List<string> trackHashes)
    {
        if (!trackHashes.Any()) return;

        await _musicRepository.HardDeleteTracksAsync(trackHashes);
    }
}