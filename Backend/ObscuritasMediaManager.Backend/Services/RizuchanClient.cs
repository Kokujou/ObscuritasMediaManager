using HtmlAgilityPack;
using ObscuritasMediaManager.Backend.Controllers.Responses;
using ObscuritasMediaManager.Backend.Data;
using ObscuritasMediaManager.Backend.Models;
using System.Text.RegularExpressions;

namespace ObscuritasMediaManager.Backend.Services;

public class RizuchanClient(HttpClient httpClient) : ILyricsClient
{
    public async Task<List<LyricsSearchResponse>> SearchForAsync(MusicModel track)
    {
        var search = track.Name;
        if (!string.IsNullOrEmpty(track.Author) && track.Author.ToLower() != "unset" &&
            track.Author.ToLower() != "undefined")
            search += $" {track.Author}";
        if (!string.IsNullOrEmpty(track.Source))
            search += $" {track.Source}";

        var encodedSearch = search.Replace(" ", "+");
        var response = await httpClient.GetAsync($"https://www.rizuchan.com/?s={encodedSearch}");
        var htmlContent = await response.Content.ReadAsStringAsync();
        var htmlDocument = new HtmlDocument();
        htmlDocument.LoadHtml(htmlContent);
        var linkNodes = htmlDocument.DocumentNode.SelectNodes("//*[@class='entry-title']//a");
        if (linkNodes is null) return new();
        return htmlDocument.DocumentNode.SelectNodes("//*[@class='entry-title']//a")
            .Select(x => new LyricsSearchResponse
            {
                Title = HtmlEntity.DeEntitize(x.InnerText), Url = x.GetAttributeValue("href", "")
            })
            .ToList();
    }

    public async Task<LyricsResponse> GetRomanizedLyricsAsync(LyricsSearchResponse entry)
    {
        var response = await httpClient.GetAsync(entry.Url);
        var htmlContent = await response.Content.ReadAsStringAsync();
        var htmlDocument = new HtmlDocument();
        htmlDocument.LoadHtml(htmlContent);
        var paragraphs = htmlDocument.DocumentNode.SelectNodes("//*[contains(@class,'entry-content')]//p")
            .Where(x => !x.ParentNode.GetAttributeValue("class", "").Contains("entry-content"));
        var firstParagraphParent = paragraphs.First().ParentNode;
        var nonParagraphs = firstParagraphParent.SelectNodes("*[not(self::p)]");
        if (nonParagraphs is not null) firstParagraphParent.RemoveChildren(nonParagraphs);

        var hopefullyRomanizedLyrics =
            Regex.Replace(firstParagraphParent.InnerHtml, "<(br|br\\s?\\/|p|\\/p)[^>]*>", "\n").Replace("\n\n", "\n")
                .Replace("<em>", "").Replace("</em>", "");

        return new(entry.Title, HtmlEntity.DeEntitize(hopefullyRomanizedLyrics));
    }
}