using ObscuritasMediaManager.Backend.Data.Media;
using System.ComponentModel.DataAnnotations.Schema;
using System.Reflection;

namespace ObscuritasMediaManager.Backend.Models;

public class MediaGenreModel : GenreModel
{
    public MediaGenreCategory Section { get; set; }
    [NotMapped] public new string SectionName => TranslateSection();

    public string TranslateSection()
    {
        return Section.GetType().GetMember(Section.ToString()).Single().GetCustomAttribute<TranslationAttribute>()?.Translation ??
            Section.ToString();
    }
}
