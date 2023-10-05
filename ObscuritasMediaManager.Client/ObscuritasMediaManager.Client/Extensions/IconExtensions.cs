using ObscuritasMediaManager.Backend.Data.Media;
using ObscuritasMediaManager.Backend.Data.Music;
using ObscuritasMediaManager.Client.Attributes;
using System;
using System.Linq;
using System.Reflection;

namespace ObscuritasMediaManager.Client.Extensions;

public static class IconExtensions
{
    public static string GetIconUrl<T>(this T enumValue) where T : Enum
    {
        return typeof(T).GetMember(enumValue.ToString()).First().GetCustomAttribute<IconUrlAttribute>()?.Url ?? string.Empty;
    }

    public static string GetIconUrl(this Nation enumValue)
    {
        return enumValue switch
        {
            Nation.Japanese => "resources/inline-icons/language-icons/japan-flag.svg",
            Nation.English => "resources/inline-icons/language-icons/english-flag.svg",
            Nation.German => "resources/inline-icons/language-icons/german-flag.svg",
            Nation.Spain => "resources/inline-icons/language-icons/spain-flag.svg",
            Nation.Chinese => "resources/inline-icons/language-icons/china-flag.svg",
            Nation.Italian => "resources/inline-icons/language-icons/italy-flag.svg",
            Nation.Russian => "resources/inline-icons/language-icons/russia-flag.svg",
            Nation.SouthAmerican => "resources/inline-icons/language-icons/south-america-flag.svg",
            Nation.African => "resources/inline-icons/language-icons/africa-flag.svg",
            _ => "resources/inline-icons/language-icons/no-language.svg",
        };
    }

    public static string GetIconUrl(this InstrumentType enumValue)
    {
        return enumValue switch
        {
            InstrumentType.Vocal => "resources/inline-icons/instrument-icons/microphone-icon.svg",
            InstrumentType.WoodWind => "resources/inline-icons/instrument-icons/wood-wind-icon.svg",
            InstrumentType.Brass => "resources/inline-icons/instrument-icons/brass-icon.svg",
            InstrumentType.Percussion => "resources/inline-icons/instrument-icons/percussion-icon.svg",
            InstrumentType.Stringed => "resources/inline-icons/instrument-icons/string-icon.svg",
            InstrumentType.Keyboard => "resources/inline-icons/instrument-icons/keyboard-icon.svg",
            InstrumentType.Electronic => "resources/inline-icons/instrument-icons/electronic-icon.svg",
            InstrumentType.HumanBody => "resources/inline-icons/instrument-icons/human-body-icon.svg",
            InstrumentType.Miscellaneous => "resources/inline-icons/instrument-icons/misc-icon.svg",
            _ => "resources/inline-icons/general/unset-icon.svg"
        };
    }

    public static string GetIconUrl(this Participants enumValue)
    {
        return enumValue switch
        {
            Participants.Solo => "resources/inline-icons/participants-icons/single-person.svg",
            Participants.SmallGroup => "resources/inline-icons/participants-icons/small-group.svg",
            Participants.LargeGroup => "resources/inline-icons/participants-icons/large-group.svg",
            Participants.SmallOrchestra => "resources/inline-icons/participants-icons/small-orchestra.svg",
            Participants.LargeOrchestra => "resources/inline-icons/participants-icons/large-orchestra.svg",
            _ => "resources/inline-icons/general/unset-icon.svg"
        };
    }

    public static string GetIconUrl(this ContentWarning enumValue)
    {
        return enumValue switch
        {
            ContentWarning.Depression => "resources/icons/content-warnings/depression.png",
            ContentWarning.Drugs => "resources/icons/content-warnings/drugs.png",
            ContentWarning.Violence => "resources/icons/content-warnings/conflict.png",
            ContentWarning.Horror => "resources/icons/content-warnings/horror.png",
            ContentWarning.Gore => "resources/icons/content-warnings/gore.png",
            ContentWarning.Vulgarity => "resources/icons/content-warnings/swearing.png",
            ContentWarning.Nudity => "resources/icons/content-warnings/sex.png",
            _ => "resources/inline-icons/general/unset-icon.svg"
        };
    }

    public static string GetIconUrl(this TargetGroup enumValue)
    {
        return enumValue switch
        {
            TargetGroup.Children => "resources/icons/target-groups/children.png",
            TargetGroup.Adolescents => "resources/icons/target-groups/adolescents.png",
            TargetGroup.Adults => "resources/icons/target-groups/adults.png",
            TargetGroup.Families => "resources/icons/target-groups/family.png",
            TargetGroup.Men => "resources/icons/target-groups/male.png",
            TargetGroup.Women => "resources/icons/target-groups/female.png",
            _ => "resources/inline-icons/general/unset-icon.svg"
        };
    }
}
