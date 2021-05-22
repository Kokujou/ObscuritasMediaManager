using System.Data.Linq.Mapping;
using ObscuritasMediaManager.Backend.Data.Music;

namespace ObscuritasMediaManager.Backend.Models
{
    [Table(Name = "Music")]
    public class MusicModel
    {
        [Column(IsPrimaryKey = true)] public string Name { get; set; }
        [Column(IsPrimaryKey = true)] public string Author { get; set; }
        [Column] public string Source { get; set; }
        [Column] public Mood Mood { get; set; }
        [Column] public Nation Language { get; set; }
        [Column] public Nation Nation { get; set; }
        [Column] public Instrumentation Instrumentation { get; set; }
        [Column] public Participants Participants { get; set; }
        [Column] public Instrument Instruments { get; set; }
        [Column] public InstrumentType InstrumentTypes { get; set; }
        [Column] public Genre[] Genres { get; set; }
        [Column] public string Src { get; set; }
    }
}