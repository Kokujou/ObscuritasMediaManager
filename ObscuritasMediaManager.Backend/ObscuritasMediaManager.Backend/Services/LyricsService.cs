using Genius;
using ObscuritasMediaManager.Backend.Controllers.Responses;
using ObscuritasMediaManager.Backend.Data.Music;
using ObscuritasMediaManager.Backend.Models;
using System.Text.RegularExpressions;

namespace ObscuritasMediaManager.Backend.Services;

public class LyricsService
{
    private readonly GeniusClient _geniusClient;

    public LyricsService(GeniusClient geniusClient)
    {
        _geniusClient = geniusClient;
    }

    public async Task<LyricsResponse> SearchForLyricsAsync(MusicModel track, int offset = 0)
    {
        var search = track.Name;
        if (!string.IsNullOrEmpty(track.Author) && (track.Author.ToLower() != "unset") && (track.Author.ToLower() != "undefined"))
            search += $" {track.Author}";
        if (track.Language == Language.Japanese) search += " Romanized";

        var searchResult = await _geniusClient.SearchClient.Search(search);
        var getRelevantHits = () =>
        searchResult.Response.Hits
            .Where(x => x.Type == "song")
            .Select(x => x.Result)
            .Where(x => (x.LyricsState == "complete") && x.FullTitle.ToLower().Contains(track.Name.ToLower()))
            .ToList();

        var relevantHits = getRelevantHits();
        if (relevantHits.Count < offset + 1)
            throw new Exception("no lyrics found");

        var firstHitId = relevantHits[offset].Id;
        using var client = new HttpClient();
        var stupidShittyEmbedJsResponse = await client.GetAsync(@$"https://genius.com/songs/{firstHitId}/embed.js");
        var stupidShittyEmbedJsContent = await stupidShittyEmbedJsResponse.Content.ReadAsStringAsync();

        var shittyStartTag = @"<div class=\\\""rg_embed_body\\\"">";
        var htmlTagStart = stupidShittyEmbedJsContent.IndexOf(shittyStartTag) + shittyStartTag.Length;
        var htmlTagEnd = stupidShittyEmbedJsContent.IndexOf(@"<div class=\\\""rg_embed_footer\\\"">");
        var htmlCode = stupidShittyEmbedJsContent[htmlTagStart..htmlTagEnd].Replace("\\\\n", string.Empty).Replace("<br>", "\n");
        htmlCode = Regex.Replace(htmlCode, "<.*>", string.Empty);

        return new(relevantHits[offset].FullTitle, htmlCode);
    }
}
