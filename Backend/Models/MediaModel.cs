using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using ObscuritasMediaManager.Backend.Data.Media;
using ObscuritasMediaManager.Backend.Data.Music;
using ObscuritasMediaManager.Backend.Extensions;

namespace ObscuritasMediaManager.Backend.Models;

public class MediaModel
{
    public static MediaModel CreateDefault()
    {
        return new()
        {
            ContentWarnings = new List<ContentWarning>(),
            Genres = [],
            Release = 1900,
            Language = Language.Japanese,
            Type = MediaCategory.AnimeSeries,
            Status = MediaStatus.Completed,
            TargetGroup = TargetGroup.None,
            Name = "Neuer Eintrag",
            RootFolderPath = string.Empty
        };
    }

    public static void Configure(ModelBuilder builder)
    {
        var entity = builder.Entity<MediaModel>();
        entity.HasMany(x => x.Genres)
            .WithMany()
            .UsingEntity(
                "MediaGenreMapping",
                x => x.HasOne(typeof(MediaGenreModel))
                    .WithMany()
                    .HasForeignKey("GenreId")
                    .HasPrincipalKey(nameof(MediaGenreModel.Id)),
                x => x.HasOne(typeof(MediaModel)).WithMany().HasForeignKey("MediaId").HasPrincipalKey(nameof(Id)));
        entity.Navigation(x => x.Genres).AutoInclude();
        entity.Property(x => x.ContentWarnings)
            .HasConversion(
                x => string.Join(",", x.Select(y => y.ToString())),
                x => x.Split(",", StringSplitOptions.RemoveEmptyEntries)
                    .Select(y => y.ParseEnumOrDefault<ContentWarning>()));
    }

    public IEnumerable<ContentWarning> ContentWarnings { get; set; } = [];
    [MaxLength(9999)] public string? Description { get; set; }
    public List<MediaGenreModel> Genres { get; set; } = [];

    [NotMapped] [NotHashable] public string Hash => this.GetHash();

    [MaxLength(255)] public string Name { get; set; } = null!;
    [MaxLength(255)] public string? RomajiName { get; set; }
    [MaxLength(255)] public string? KanjiName { get; set; }
    [MaxLength(255)] public string? GermanName { get; set; }
    [MaxLength(255)] public string? EnglishName { get; set; }
    [Key] public Guid Id { get; set; } = Guid.NewGuid();
    public Language Language { get; set; }
    public int Rating { get; set; }
    public int Release { get; set; }
    public MediaStatus Status { get; set; }
    public TargetGroup TargetGroup { get; set; }
    public MediaCategory Type { get; set; }
    [MaxLength(255)] public string RootFolderPath { get; set; } = null!;
    public bool Deleted { get; set; }
    public bool Complete { get; set; }

    public override string ToString()
    {
        return $"{Name} - {Type}";
    }

    public string GetNormalizedPath()
    {
        return new FileInfo(RootFolderPath).FullName;
    }
}