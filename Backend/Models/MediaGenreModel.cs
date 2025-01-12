using ObscuritasMediaManager.Backend.Data.Media;
using System.ComponentModel.DataAnnotations.Schema;
using System.Reflection;
using System.Text.Json.Serialization;

namespace ObscuritasMediaManager.Backend.Models;

public class MediaGenreModel : GenreModel
{
    [JsonIgnore] [NotMapped] public override string SectionName => TranslateSection();
    public MediaGenreCategory Section { get; set; }

    public string TranslateSection()
    {
        return Section.GetType().GetMember(Section.ToString()).Single().GetCustomAttribute<TranslationAttribute>()
                   ?.Translation ??
               Section.ToString();
    }
}