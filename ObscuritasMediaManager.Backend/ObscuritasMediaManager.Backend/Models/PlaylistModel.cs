using Microsoft.EntityFrameworkCore;
using ObscuritasMediaManager.Backend.Data.Music;
using ObscuritasMediaManager.Backend.Extensions;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ObscuritasMediaManager.Backend.Models;

[Table("Playlists")]
public class PlaylistModel
{

    [Key] public int Id { get; set; }
    public string Name { get; set; }
    public string Author { get; set; }
    public string Image { get; set; }
    public int Rating { get; set; }
    public Nation Language { get; set; }
    public Nation Nation { get; set; }
    public IEnumerable<MusicGenre> Genres { get; set; }
    public bool Complete { get; set; }
    [NotMapped] public bool IsTemporary { get; set; }

    public IEnumerable<MusicModel> Tracks { get; set; }

    public static void Configure(ModelBuilder builder)
    {
        var entity = builder.Entity<PlaylistModel>();

        entity.Property(x => x.Genres).HasConversion(x => string.Join(",", x), x => x.Split(",", StringSplitOptions.RemoveEmptyEntries).Select(y => y.ParseEnumOrDefault<MusicGenre>()).ToList());

        entity.HasMany(x => x.Tracks).WithMany().UsingEntity<PlaylistTrackMappingModel>(right => right.HasOne<MusicModel>().WithMany().HasForeignKey(x => x.TrackHash), left => left.HasOne<PlaylistModel>().WithMany().HasForeignKey(x => x.PlaylistId));
        entity.Navigation(x => x.Tracks).AutoInclude();
    }
}
