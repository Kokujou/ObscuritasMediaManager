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
        entity.Property(x => x.Genres).HasConversion(x => string.Join(",", x), x => x.Split(",", StringSplitOptions.RemoveEmptyEntries));
        entity.Property(x => x.ContentWarnings)
            .HasConversion(x => string.Join(",", x.Select(x => x.ToString())),
            x => x.Split(",", StringSplitOptions.RemoveEmptyEntries).Select(x => x.ParseEnumOrDefault<ContentWarning>()));
    }

    public override string ToString()
    {
        return $"{Name} - {Type}";
    }

    public IEnumerable<ContentWarning> ContentWarnings { get; set; }
    public string Description { get; set; }
    public IEnumerable<string> Genres { get; set; } = new List<string>();
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
}