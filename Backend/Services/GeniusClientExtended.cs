using Genius;
using ObscuritasMediaManager.Backend.Controllers.Responses;
using ObscuritasMediaManager.Backend.Data;
using ObscuritasMediaManager.Backend.Data.Music;
using ObscuritasMediaManager.Backend.Models;
using ObscuritasMediaManager.Backend.Services.Interfaces;
using System.Text.RegularExpressions;

namespace ObscuritasMediaManager.Backend.Services;

public class GeniusClientExtended(GeniusClient geniusClient, HttpClient httpClient) : ILyricsClient
{
    public async Task<List<LyricsSearchResponse>> SearchForAsync(MusicModel track)
    {
        var search = track.Name;
        if (!string.IsNullOrEmpty(track.Author) && track.Author.ToLower() != "unset" &&
            track.Author.ToLower() != "undefined")
            search += $" {track.Author}";

        if (track.Language == Language.Japanese) search += " Romanized";

        var searchResult = await geniusClient.SearchClient.Search(search);
        var hits = searchResult.Response.Hits
            .Where(x => x.Type == "song")
            .Select(x => x.Result)
            .Where(x => x.LyricsState == "complete" && x.FullTitle.ToLower().Contains(track.Name.ToLower()))
            .Select(x =>
                new LyricsSearchResponse { Title = x.FullTitle, Url = $"https://genius.com/songs/{x.Id}/embed.js" })
            .ToList();
        return hits;
    }

    public async Task<LyricsResponse> GetRomanizedLyricsAsync(LyricsSearchResponse entry)
    {
        var stupidShittyEmbedJsResponse = await httpClient.GetAsync(entry.Url);
        var stupidShittyEmbedJsContent = await stupidShittyEmbedJsResponse.Content.ReadAsStringAsync();

        var shittyStartTag = @"<div class=\\\""rg_embed_body\\\"">";
        var htmlTagStart = stupidShittyEmbedJsContent.IndexOf(shittyStartTag) + shittyStartTag.Length;
        var htmlTagEnd = stupidShittyEmbedJsContent.IndexOf(@"<div class=\\\""rg_embed_footer\\\"">");
        var htmlCode = stupidShittyEmbedJsContent[htmlTagStart..htmlTagEnd].Replace("\\\\n", string.Empty)
            .Replace("<br>", "\n");
        htmlCode = Regex.Replace(htmlCode, "<.*>", string.Empty);
        return new(entry.Title, htmlCode);
    }
}