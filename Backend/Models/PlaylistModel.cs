using Microsoft.EntityFrameworkCore;
using ObscuritasMediaManager.Backend.Data.Music;
using ObscuritasMediaManager.Backend.Extensions;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;
using System.Text.Json.Serialization;

namespace ObscuritasMediaManager.Backend.Models;

[Table("Playlists")]
public class PlaylistModel
{
    public static void Configure(ModelBuilder builder)
    {
        var entity = builder.Entity<PlaylistModel>();

        entity.Property(x => x.Genres)
            .HasConversion(
                x => string.Join(",", x),
                x => x.Split(",",
                    StringSplitOptions.RemoveEmptyEntries).Select(y => y.ParseEnumOrDefault<MusicGenre>()).ToList());

        var mappingEntity = builder.Entity<PlaylistTrackMappingModel>();
        mappingEntity
            .HasOne(x => x.Playlist)
            .WithMany(x => x.TrackMappings)
            .HasForeignKey(x => x.PlaylistId);

        mappingEntity
            .HasOne(x => x.Track)
            .WithMany()
            .HasForeignKey(x => x.TrackHash);

        mappingEntity.HasKey(x => new { x.PlaylistId, x.TrackHash });
        mappingEntity.Navigation(x => x.Playlist).AutoInclude();
        mappingEntity.Navigation(x => x.Track).AutoInclude();
        entity.Navigation(x => x.TrackMappings).AutoInclude();
    }

    [Key] public Guid Id { get; set; }
    [MaxLength(255)] public required string Name { get; set; }
    [MaxLength(255)] public string? Author { get; set; }
    [MaxLength(255)] public string? Image { get; set; }
    public byte Rating { get; set; }
    public Language Language { get; set; }
    public Language Nation { get; set; }
    public IEnumerable<MusicGenre> Genres { get; set; } = new List<MusicGenre>();
    public bool Complete { get; set; }
    [NotMapped] public bool IsTemporary { get; set; }

    [JsonIgnore] [IgnoreDataMember] public IEnumerable<PlaylistTrackMappingModel>? TrackMappings { get; set; }

    [NotMapped]
    public IEnumerable<MusicModel> Tracks
    {
        get => TrackMappings?.OrderBy(x => x.Order).Select(x => x.Track!) ?? [];
        set => CreateMappingsFromTracks(value);
    }


    private void CreateMappingsFromTracks(IEnumerable<MusicModel> tracks)
    {
        TrackMappings = tracks.Select((track, index) => PlaylistTrackMappingModel.Create(Id, Name, track, index));
    }
}