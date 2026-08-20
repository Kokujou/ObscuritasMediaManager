using HtmlAgilityPack;
using ObscuritasMediaManager.Backend.Controllers.Responses;
using ObscuritasMediaManager.Backend.Data;
using ObscuritasMediaManager.Backend.Extensions;
using ObscuritasMediaManager.Backend.Models;
using ObscuritasMediaManager.Backend.Services.Interfaces;
using System.Text;

namespace ObscuritasMediaManager.Backend.Services;

public sealed class UtatenClient(HttpClient http, ILogger<UtatenClient> logger) : ILyricsClient
{
    public static Uri BaseAddress { get; set; } = new("https://utaten.com/");
    public const int MaxSearchHits = 50;

    private static IEnumerable<Uri> BuildSearchUrls(MusicModel track)
    {
        var titles = track.Name.ToKanaCandidates().ToList();

        var artists = track.Author.ToKanaCandidates()
            .Concat(track.Author.ReverseWords().ToKanaCandidates())
            .Distinct()
            .ToList();

        foreach (var title in titles)
        foreach (var artist in artists)
            yield return Build(title, artist);

        foreach (var title in titles)
            yield return Build(title, null);
    }

    private static Uri Build(string? title, string? artist)
    {
        var parameters = new List<string>();

        if (!string.IsNullOrWhiteSpace(title))
            parameters.Add($"title={Uri.EscapeDataString(title)}");

        if (!string.IsNullOrWhiteSpace(artist))
            parameters.Add($"artist_name={Uri.EscapeDataString(artist)}");

        if (parameters.Count == 0)
            throw new ArgumentException("Track needs at least a title or an artist.");

        return new(BaseAddress, "search?" + string.Join('&', parameters));
    }

    private static string Compose(List<UtatenSegment> segments)
    {
        var builder = new StringBuilder();

        foreach (var segment in segments)
        {
            if (segment.IsSeparator)
            {
                Separate(builder);
                continue;
            }

            if (segment.IsStandalone)
                Separate(builder);

            builder.Append(segment.Reading);
        }

        return builder.ToString().Trim().ResolveSokuon();
    }

    private static void Separate(StringBuilder builder)
    {
        if (builder.Length > 0 && builder[^1] != ' ')
            builder.Append(' ');
    }

    private static List<List<UtatenSegment>> ReadLines(HtmlNode container)
    {
        var lines = new List<List<UtatenSegment>>();
        var current = new List<UtatenSegment>();
        var previousHadKanji = false;

        foreach (var node in container.ChildNodes)
        {
            if (node.NodeType == HtmlNodeType.Element &&
                node.Name.Equals("br", StringComparison.OrdinalIgnoreCase))
            {
                lines.Add(current);
                current = [];
                previousHadKanji = false;
                continue;
            }

            if (node.NodeType == HtmlNodeType.Element && HasClass(node, "ruby"))
            {
                var surface = Text(FindByClass(node, "span", "rb"));
                var reading = Text(FindByClass(node, "span", "rt"));

                if (reading.Length == 0)
                    continue;

                current.AddRange(SplitRuby(surface, reading, previousHadKanji));
                previousHadKanji = surface.Any(c => c.IsKanji());
                continue;
            }

            if (node.NodeType is not (HtmlNodeType.Text or HtmlNodeType.Element))
                continue;

            var raw = HtmlEntity.DeEntitize(node.InnerText) ?? string.Empty;
            if (raw.Length == 0)
                continue;

            if (raw.Trim().Length == 0)
            {
                current.Add(new(string.Empty, false, true));
                continue;
            }

            current.Add(new(Collapse(raw), false, false));
        }

        lines.Add(current);
        return lines.Where(l => l.Any(s => s.Reading.Length > 0)).ToList();
    }

    private static IEnumerable<UtatenSegment> SplitRuby(string surface, string reading, bool previousHadKanji)
    {
        if (previousHadKanji &&
            surface.Length > 2 &&
            surface.All(c => c.IsHiragana()) &&
            HiraganaRomajiMap.LeadingParticles.TryGetValue(surface[0], out var particle) &&
            reading.Length > particle.Length &&
            reading.StartsWith(particle, StringComparison.Ordinal))
        {
            yield return new(particle, true, false);
            yield return new(reading[particle.Length..], true, false);
            yield break;
        }

        yield return new(reading, IsStandalone(surface, previousHadKanji), false);
    }

    private static bool IsStandalone(string surface, bool previousHadKanji)
    {
        if (surface.Length == 0)
            return true;

        if (surface.Any(c => c.IsKanji()))
            return true;

        if (surface.All(c => c.IsKatakana()))
            return true;

        if (!surface.All(c => c.IsHiragana()))
            return true;

        if (HiraganaRomajiMap.Particles.Contains(surface))
            return true;

        return !previousHadKanji;
    }

    private static string ReadTitle(HtmlDocument document, string fallback)
    {
        var heading = FindByClass(document.DocumentNode, "h2", "newLyricTitle__main");
        if (heading is null)
            return fallback;

        FindByClass(heading, "span", "newLyricTitle_afterTxt")?.Remove();

        var title = Text(heading);
        return title.Length > 0 ? title : fallback;
    }

    private static HtmlNode? FindByClass(HtmlNode scope, string tag, string className)
    {
        return scope.SelectNodes($".//{tag}")?.FirstOrDefault(n => HasClass(n, className));
    }

    private static bool HasClass(HtmlNode node, string className)
    {
        return node.GetAttributeValue("class", string.Empty)
            .Split(' ', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
            .Contains(className, StringComparer.Ordinal);
    }

    private static string Text(HtmlNode? node)
    {
        return node is null ? string.Empty : Collapse(HtmlEntity.DeEntitize(node.InnerText) ?? string.Empty);
    }

    private static string Collapse(string value)
    {
        var builder = new StringBuilder(value.Length);
        var pendingSpace = false;

        foreach (var c in value)
        {
            if (char.IsWhiteSpace(c))
            {
                pendingSpace = builder.Length > 0;
                continue;
            }

            if (pendingSpace)
            {
                builder.Append(' ');
                pendingSpace = false;
            }

            builder.Append(c);
        }

        return builder.ToString();
    }

    public async Task<List<LyricsSearchResponse>> SearchForAsync(MusicModel track)
    {
        foreach (var url in BuildSearchUrls(track))
        {
            var hits = await SearchAsync(url, track);
            if (hits.Count == 0)
                continue;

            logger.LogInformation("UtaTen matched {Query} with {HitCount} hits", url.Query, hits.Count);
            return hits;
        }

        return [];
    }

    public async Task<LyricsResponse> GetRomanizedLyricsAsync(LyricsSearchResponse target)
    {
        var document = await LoadAsync(target.Url)
                       ?? throw new InvalidOperationException($"UtaTen page could not be loaded: {target.Url}");

        var body = FindByClass(document.DocumentNode, "div", "lyricBody")
                   ?? throw new InvalidOperationException($"UtaTen page has no lyricBody: {target.Url}");

        var romaji = FindByClass(body, "div", "romaji")
                     ?? throw new InvalidOperationException($"UtaTen page has no romaji layer: {target.Url}");

        var text = string.Join('\n', ReadLines(romaji).Select(Compose));
        return new(ReadTitle(document, target.Title), text);
    }

    private async Task<List<LyricsSearchResponse>> SearchAsync(Uri url, MusicModel track)
    {
        var document = await LoadAsync(url);

        var table = document?.DocumentNode
            .SelectNodes("//table")
            ?.FirstOrDefault(n => HasClass(n, "searchResult"));

        if (table is null)
        {
            logger.LogDebug("No results for {Query} ({Title})", url.Query, track.Name);
            return [];
        }

        var hits = new List<LyricsSearchResponse>();

        foreach (var row in table.SelectNodes(".//tr") ?? Enumerable.Empty<HtmlNode>())
        {
            var link = FindByClass(row, "p", "searchResult__title")?.SelectSingleNode("./a");
            var href = link?.GetAttributeValue("href", null);

            if (link is null || string.IsNullOrEmpty(href))
                continue;

            hits.Add(new() { Url = new(BaseAddress, href), Title = Text(link) });

            if (hits.Count >= MaxSearchHits)
                break;
        }

        return hits;
    }

    private async Task<HtmlDocument?> LoadAsync(Uri url)
    {
        using var response = await http.GetAsync(url, HttpCompletionOption.ResponseHeadersRead);
        if (!response.IsSuccessStatusCode)
        {
            logger.LogWarning("UtaTen request {Url} failed with {StatusCode}", url, (int)response.StatusCode);
            return null;
        }

        await using var stream = await response.Content.ReadAsStreamAsync();

        var document = new HtmlDocument();
        document.Load(stream, Encoding.UTF8);
        return document;
    }

    private sealed record UtatenSegment(string Reading, bool IsStandalone, bool IsSeparator);
}