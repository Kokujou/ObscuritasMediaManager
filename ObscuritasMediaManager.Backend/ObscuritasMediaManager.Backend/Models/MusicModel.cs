using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using ObscuritasMediaManager.Backend.Data.Music;

namespace ObscuritasMediaManager.Backend.Models
{
    public class MusicModel
    {
        [Key] public Guid Id { get; set; } = Guid.NewGuid();
        public string Name { get; set; }
        public string Author { get; set; }
        public string Source { get; set; }
        public Mood Mood { get; set; }
        public Nation Language { get; set; }
        public Nation Nation { get; set; }
        public Instrumentation Instrumentation { get; set; }
        public Participants Participants { get; set; }
        public string InstrumentsString { get; set; } = string.Empty;
        public string GenreString { get; set; } = string.Empty;
        public IEnumerable<Genre> Genres => ParseGenreString(GenreString);
        public string Src { get; set; }

        private static IEnumerable<Genre> ParseGenreString(string genreString)
        {
            if (string.IsNullOrEmpty(genreString)) return Enumerable.Empty<Genre>();
            var genres = genreString.Split(',');
            return genres.Select(Enum.Parse<Genre>).ToList();
        }
    }
}