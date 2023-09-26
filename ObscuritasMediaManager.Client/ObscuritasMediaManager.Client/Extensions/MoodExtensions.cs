using ObscuritasMediaManager.Backend.Data.Music;
using System;
using System.Linq;

namespace ObscuritasMediaManager.Client.Extensions;

public static class MoodExtensions
{
    public static readonly Dictionary<Mood, string> MoodColors = new()
    {
        { Mood.Aggressive, "#a33000" },
        { Mood.Calm, "#773311" },
        { Mood.Dramatic, "#333333" },
        { Mood.Epic, "#773399" },
        { Mood.Funny, "#a0a000" },
        { Mood.Happy, "#008000" },
        { Mood.Monotonuous, "#999999" },
        { Mood.Passionate, "#bb6622" },
        { Mood.Romantic, "#dd6677" },
        { Mood.Sad, "#0335a0" },
        { Mood.Cool, "#00aaee" },
        { Mood.Unset, "#dddddd" }
    };

    public static bool HasNoHue(this Mood mood)
    {
        return (mood == Mood.Unset) || (mood == Mood.Monotonuous) || (mood == Mood.Dramatic);
    }

    public static string GetColorCode(this Mood mood, Mood? fallback = null)
    {
        if ((fallback is not null) && (mood == Mood.Unset)) return MoodColors[fallback.Value];
        return MoodColors[mood];
    }

    public static string GetFontColorCode(this Mood mood)
    {
        if ((mood == Mood.Monotonuous) || (mood == Mood.Unset)) return "black";
        return "white";
    }
}
