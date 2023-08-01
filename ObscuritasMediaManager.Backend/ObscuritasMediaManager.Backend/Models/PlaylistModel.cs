using ObscuritasMediaManager.Backend.Data.Music;
using System.ComponentModel.DataAnnotations.Schema;

namespace ObscuritasMediaManager.Backend.Models
{
    [Table("Playlists")]
    public class PlaylistModel
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Autor { get; set; }
        public string Image { get; set; }
        public int Rating { get; set; }
        public bool Complete { get; set; }
        public IEnumerable<MusicGenre> Genres { get; set; }
    }
}
