using Microsoft.EntityFrameworkCore;
using ObscuritasMediaManager.Backend.Data.Music;
using ObscuritasMediaManager.Backend.Extensions;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;
using System.Text.Json.Serialization;

namespace ObscuritasMediaManager.Backend.Models;

public class MusicModel
{
    public static MusicModel CreateDefault(string name)
    {
        return new()
        {
            Name = name,
            Language = Language.Japanese,
            Instrumentation = Instrumentation.Mixed,
            Participants = Participants.SmallGroup,
            Path = string.Empty
        };
    }

    public static void Configure(ModelBuilder builder)
    {
        var entity = builder.Entity<MusicModel>();
        entity
            .HasMany(x => x.Instruments)
            .WithMany()
            .UsingEntity<MusicInstrumentMappingModel>(
                x => x.HasOne<InstrumentModel>().WithMany().HasForeignKey(y => y.InstrumentId)
                    .HasPrincipalKey(y => y.Id),
                x => x.HasOne<MusicModel>().WithMany().HasForeignKey(y => y.TrackHash).HasPrincipalKey(y => y.Hash));

        entity.Navigation(x => x.Instruments);
    }

    [MaxLength(255)] public string Name { get; set; } = null!;
    public string DisplayName => GetDisplayName();
    [MaxLength(255)] public string? Author { get; set; }
    [MaxLength(255)] public string? Source { get; set; }
    public Mood Mood1 { get; set; }
    public Mood Mood2 { get; set; }
    public Language Language { get; set; }
    public Instrumentation Instrumentation { get; set; }
    public Participants Participants { get; set; }
    public List<InstrumentModel> Instruments { get; set; } = [];
    [NotMapped] public IEnumerable<InstrumentType> InstrumentTypes => Instruments.Select(x => x.Type).Distinct();
    [NotMapped] public IEnumerable<string> InstrumentNames => Instruments.Select(x => x.Name);
    public IEnumerable<MusicGenre> Genres { get; set; } = new List<MusicGenre>();
    [MaxLength(255)] public string Path { get; set; } = null!;
    [MaxLength(255)] public string? Lyrics { get; set; }
    public byte Rating { get; set; }
    public bool Complete { get; set; }
    [MaxLength(255)] [Key] public string Hash { get; set; } = null!;
    [JsonIgnore] [IgnoreDataMember] public long FileBytes { get; set; }
    public bool Deleted { get; set; }

    public string GetNormalizedPath()
    {
        return new FileInfo(Path).FullName;
    }

    public MusicModel CalculateHash()
    {
        var fileInfo = new FileInfo(Path);
        if (!fileInfo.Exists) throw new FileNotFoundException();
        Hash = fileInfo.GetFileHash();
        FileBytes = fileInfo.Length;
        return this;
    }

    public override string ToString()
    {
        return $"{Name} - {Author} ({Source})\n{Path}";
    }

    private string GetDisplayName()
    {
        var result = Name;
        if (Author is not null && Author != "undefined")
            result += $" - {Author}";
        if (!string.IsNullOrEmpty(Source))
            result += $" ({Source})";
        return result;
    }
}