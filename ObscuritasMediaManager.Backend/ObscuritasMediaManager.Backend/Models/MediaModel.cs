using System.Collections.Generic;
using System.Reflection.Metadata;

namespace ObscuritasMediaManager.Backend.Models
{
    public class MediaModel
    {
        public string Name { get; set; }
        public string Type { get; set; }
        public int Rating { get; set; }
        public int Release { get; set; }
        public IEnumerable<string> Genres { get; set; }
        public int State { get; set; }
        public string Description { get; set; }
        public Blob Thumbnail { get; set; }
        public string Image { get; set; }
    }
}