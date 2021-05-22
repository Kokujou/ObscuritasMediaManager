using System.Collections.Generic;
using System.Data.Linq.Mapping;

namespace ObscuritasMediaManager.Backend.Models
{
    [Table(Name = "media")]
    public class MediaModel
    {
        public string Name { get; set; }
        public string Type { get; set; }
        public int Rating { get; set; }
        public int Release { get; set; }

        public string GenreString { get; set; }
        public IEnumerable<string> Genres => GenreString.Split(',');

        public int State { get; set; }
        public string Description { get; set; }
        public string Image { get; set; }

        public override string ToString()
        {
            return $"{Name} - {Type}";
        }
    }
}