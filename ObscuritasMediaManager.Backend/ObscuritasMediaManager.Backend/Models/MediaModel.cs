using System.Data.Linq.Mapping;
using System.Diagnostics.CodeAnalysis;

namespace ObscuritasMediaManager.Backend.Models
{
    [Table(Name = "media")]
    public class MediaModel
    {
        [Column] public string Name { get; set; }
        [Column] public string Type { get; set; }
        [Column] public int Rating { get; set; }
        [Column] public int Release { get; set; }

        [Column(Name = "Genres")] [NotNull] public string GenreString { get; set; }

        [Column] public int State { get; set; }
        [Column] public string Description { get; set; }
        [Column] public string Thumbnail { get; set; }
        [Column] public string Image { get; set; }
    }
}