using System;
using System.Collections.Generic;
using System.Data.Linq.Mapping;
using System.Linq;
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
        public string InstrumentsString { get; set; }
        public IEnumerable<Instrument> Instruments => InstrumentsString?.Split(',').Select(Enum.Parse<Instrument>);
        public string InstrumentTypesString { get; set; }

        public IEnumerable<InstrumentType> InstrumentTypes =>
            InstrumentTypesString?.Split(',').Select(Enum.Parse<InstrumentType>);

        public string GenreString { get; set; }
        public IEnumerable<Genre> Genres => GenreString?.Split(',').Select(Enum.Parse<Genre>);
        public string Src { get; set; }
    }
}