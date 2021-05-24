using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ObscuritasMediaManager.Backend.Models
{
    public class MediaModel
    {
        [Key] public Guid Id { get; set; } = Guid.NewGuid();
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