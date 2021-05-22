using System.Collections.Generic;
using System.Data.Linq.Mapping;
using ObscuritasMediaManager.Backend.Data.Music;

namespace ObscuritasMediaManager.Backend.Models
{
    [Table(Name = "Music")]
    public class MusicModel
    {
        public string Name { get; set; }
        public string Author { get; set; }
        public string Source { get; set; }
        public Mood Mood { get; set; }
        public Nation Language { get; set; }
        public Nation Nation { get; set; }
        public Instrumentation Instrumentation { get; set; }
        public Participants Participants { get; set; }
        public Instrument Instruments { get; set; }
        public InstrumentType InstrumentTypes { get; set; }
        [Column(Name = "Genres")] public string GenreString { get; set; }
        public IEnumerable<string> Genres => GenreString.Split(',');
        public string Src { get; set; }
    }
}