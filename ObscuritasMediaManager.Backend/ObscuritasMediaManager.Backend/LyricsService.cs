using Genius;
using System.Text.RegularExpressions;

namespace ObscuritasMediaManager.Backend;

public class LyricsService
{
    private readonly GeniusClient _geniusClient;

    public LyricsService(GeniusClient geniusClient)
    {
        _geniusClient = geniusClient;
    }

    public async Task<string> SearchForLyricsAsync(string trackName, string search, int offset = 0)
    {
        var searchResult = await _geniusClient.SearchClient.Search($"{search} Romanized");
        var getRelevantHits = (
            ) => searchResult.Response.Hits
            .Where(x => x.Type == "song")
            .Select(x => x.Result)
            .Where(x => (x.LyricsState == "complete") && x.FullTitle.ToLower().Contains(trackName.ToLower()))
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

        return htmlCode;
    }
}
