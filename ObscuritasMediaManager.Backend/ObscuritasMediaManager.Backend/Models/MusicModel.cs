using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.IO;
using System.Linq;
using System.Text.Json.Serialization;
using ObscuritasMediaManager.Backend.Data.Music;
using ObscuritasMediaManager.Backend.Extensions;

namespace ObscuritasMediaManager.Backend.Models
{
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
        public string InstrumentsString { get; set; } = string.Empty;
        public string GenreString { get; set; } = string.Empty;
        public IEnumerable<Genre> Genres => ParseGenreString(GenreString);
        public string Path { get; set; }
        public byte Rating { get; set; }
        public bool? Complete { get; set; }

        [Key] public string Hash { get; set; }

        [JsonIgnore] public long FileBytes { get; set; }

        public MusicModel CalculateHash()
        {
            var fileInfo = new FileInfo(Path);
            if (!fileInfo.Exists) throw new FileNotFoundException();
            Hash = fileInfo.GetFileHash();
            FileBytes = fileInfo.Length;
            return this;
        }

        private static IEnumerable<Genre> ParseGenreString(string genreString)
        {
            if (string.IsNullOrEmpty(genreString)) return Enumerable.Empty<Genre>();
            var genres = genreString.Split(',');
            return genres.Select(Enum.Parse<Genre>).ToList();
        }

        public override string ToString()
        {
            return $"{Name} - {Author} ({Source})\n{Path}";
        }
    }
}