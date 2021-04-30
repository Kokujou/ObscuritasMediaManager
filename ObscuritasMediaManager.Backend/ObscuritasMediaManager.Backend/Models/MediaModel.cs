using System.Collections.Generic;
using System.Data.Linq.Mapping;

namespace ObscuritasMediaManager.Backend.Models
{
    [Table(Name = "media")]
    public class MediaModel
    {
        [Column(IsPrimaryKey = true)] public string Name { get; set; }
        [Column(IsPrimaryKey = true)] public string Type { get; set; }
        [Column] public int Rating { get; set; }
        [Column] public int Release { get; set; }

        [Column(Name = "Genres")] public string GenreString { get; set; }
        public IEnumerable<string> Genres => GenreString.Split(',');

        [Column] public int State { get; set; }
        [Column] public string Description { get; set; }
        [Column] public string Image { get; set; }
    }
}