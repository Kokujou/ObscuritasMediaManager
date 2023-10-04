using Microsoft.EntityFrameworkCore;
using ObscuritasMediaManager.Backend.Attributes;
using ObscuritasMediaManager.Backend.Data.Media;
using ObscuritasMediaManager.Backend.Data.Music;
using ObscuritasMediaManager.Backend.Extensions;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ObscuritasMediaManager.Backend.Models;

public class MediaModel
{
    public static void Configure(ModelBuilder builder)
    {
        var entity = builder.Entity<MediaModel>();
        entity.HasMany(x => x.Genres)
            .WithMany()
            .UsingEntity("MediaGenreMapping",
            x => x.HasOne(typeof(GenreModel)).WithMany().HasForeignKey("GenreId").HasPrincipalKey(nameof(GenreModel.Id)),
            x => x.HasOne(typeof(MediaModel)).WithMany().HasForeignKey("MediaId").HasPrincipalKey(nameof(MediaModel.Id)));
        entity.Navigation(x => x.Genres).AutoInclude();
        entity.Property(x => x.ContentWarnings)
            .HasConversion(x => string.Join(",", x.Select(x => x.ToString())),
            x => x.Split(",", StringSplitOptions.RemoveEmptyEntries).Select(x => x.ParseEnumOrDefault<ContentWarning>()));
    }

    public IEnumerable<ContentWarning> ContentWarnings { get; set; }
    public string Description { get; set; }
    public List<GenreModel> Genres { get; set; } = new List<GenreModel>();
    [NotMapped]
    [NotHashable]
    public string Hash => this.GetHash();

    [Key] public Guid Id { get; set; } = Guid.NewGuid();
    public string Image { get; set; }
    public Nation Language { get; set; }
    public string Name { get; set; }
    public int Rating { get; set; }
    public int Release { get; set; }
    public MediaStatus Status { get; set; }
    public TargetGroup TargetGroup { get; set; }
    public MediaCategory Type { get; set; }

    public override string ToString()
    {
        return $"{Name} - {Type}";
    }
}