using System.ComponentModel.DataAnnotations.Schema;
using System.Reflection;
using ObscuritasMediaManager.Backend.Data.Media;

namespace ObscuritasMediaManager.Backend.Models;

public class MediaGenreModel : GenreModel
{
    [NotMapped] public override string SectionName => TranslateSection();
    public MediaGenreCategory Section { get; set; }

    public string TranslateSection()
    {
        return Section.GetType().GetMember(Section.ToString()).Single().GetCustomAttribute<TranslationAttribute>()
                   ?.Translation ??
               Section.ToString();
    }
}