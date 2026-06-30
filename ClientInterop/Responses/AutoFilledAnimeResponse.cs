using TypeGen.Core.TypeAnnotations;

namespace ObscuritasMediaManager.ClientInterop.Responses;

[ExportTsClass]
public class AutoFilledAnimeResponse
{
    public string Name { get; set; } = null!;
    public string? RomajiName { get; set; }
    public string? KanjiName { get; set; }
    public string? GermanName { get; set; }
    public string? EnglishName { get; set; }
    public int Rating { get; set; }
    public int? Release { get; set; }
    public string? Description { get; set; }
    public string? Image { get; set; }
}