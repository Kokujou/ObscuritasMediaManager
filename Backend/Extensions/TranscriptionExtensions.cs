using ObscuritasMediaManager.Backend.Data;
using System.Text;
using System.Text.RegularExpressions;

namespace ObscuritasMediaManager.Backend.Extensions;

public static class TranscriptionExtensions
{
    private const string Vowels = "aiueo";
    private const string LongVowels = "âîûêô";

    private static readonly Regex Sokuon = new(@"(?:xtsu|xtu|ltu)\s*(?<next>[a-zâîûêô])", RegexOptions.Compiled);

    public static string ToHiragana(this string romaji, RomajiStyle style = RomajiStyle.Hepburn)
    {
        var source = Prepare(romaji);
        var result = new StringBuilder(source.Length);
        var i = 0;

        while (i < source.Length)
        {
            var c = source[i];

            if (c is < 'a' or > 'z')
            {
                result.Append(c);
                i++;
                continue;
            }

            if (c == 'n' && (i + 1 == source.Length || !IsSyllableStart(source[i + 1])))
            {
                result.Append('ん');
                i++;
                continue;
            }

            if (c == 'm' && i + 1 < source.Length && source[i + 1] is 'b' or 'p' or 'm')
            {
                result.Append('ん');
                i++;
                continue;
            }

            if (i + 1 < source.Length && c == source[i + 1] && !Vowels.Contains(c) && c != 'n')
            {
                result.Append('っ');
                i++;
                continue;
            }

            var matched = false;

            for (var length = Math.Min(4, source.Length - i); length >= 1; length--)
            {
                var key = source.Substring(i, length);

                if (style == RomajiStyle.Wapuro && HiraganaRomajiMap.Wapuro.TryGetValue(key, out var alternate))
                {
                    result.Append(alternate);
                    i += length;
                    matched = true;
                    break;
                }

                if (!HiraganaRomajiMap.Map.TryGetValue(key, out var kana))
                    continue;

                result.Append(kana);
                i += length;
                matched = true;
                break;
            }

            if (matched)
                continue;

            if (HiraganaRomajiMap.Dangling.TryGetValue(c, out var trailing))
                result.Append(trailing);

            i++;
        }

        return result.ToString();
    }

    public static IEnumerable<string> ToKanaCandidates(this string? value)
    {
        if (string.IsNullOrWhiteSpace(value))
            yield break;

        yield return value;

        var hepburn = value.ToHiragana();
        if (hepburn.Length > 0)
            yield return hepburn;

        var wapuro = value.ToHiragana(RomajiStyle.Wapuro);
        if (wapuro.Length > 0 && wapuro != hepburn)
            yield return wapuro;
    }

    public static string? ReverseWords(this string? value)
    {
        if (string.IsNullOrWhiteSpace(value))
            return null;

        var words = value.Split(' ', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
        return words.Length < 2 ? null : string.Join(' ', words.Reverse());
    }

    public static string ResolveSokuon(this string romaji)
    {
        return Sokuon.Replace(romaji, match =>
        {
            var next = match.Groups["next"].Value[0];
            return Vowels.Contains(next) || LongVowels.Contains(next) ? next.ToString() : $"{next}{next}";
        });
    }

    public static bool IsKanji(this char c)
    {
        return c is >= '一' and <= '鿿' or >= '㐀' and <= '䶿';
    }

    public static bool IsHiragana(this char c)
    {
        return c is >= '぀' and <= 'ゟ' or 'ー';
    }

    public static bool IsKatakana(this char c)
    {
        return c is >= '゠' and <= 'ヿ';
    }

    private static bool IsSyllableStart(char c)
    {
        return Vowels.Contains(c) || c == 'y';
    }

    private static string Prepare(string value)
    {
        var normalized = value.ToLowerInvariant()
            .Replace("n'", "ん")
            .Replace("ā", "aa").Replace("â", "aa")
            .Replace("ī", "ii").Replace("î", "ii")
            .Replace("ū", "uu").Replace("û", "uu")
            .Replace("ē", "ei").Replace("ê", "ei")
            .Replace("ō", "ou").Replace("ô", "ou");

        return new(normalized
            .Select(c => c is '-' or '~' or '〜' ? 'ー' : c)
            .Where(c => char.IsLetter(c) || c == 'ー')
            .ToArray());
    }
}