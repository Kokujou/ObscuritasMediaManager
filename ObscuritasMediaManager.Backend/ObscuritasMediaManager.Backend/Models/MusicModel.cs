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
    public static void Configure(ModelBuilder builder)
    {
        var entity = builder.Entity<MusicModel>();
        entity
          .HasMany(x => x.Instruments)
            .WithMany()
            .UsingEntity<MusicInstrumentMappingModel>(
                x => x.HasOne<InstrumentModel>().WithMany().HasForeignKey(x => x.InstrumentId).HasPrincipalKey(x => x.Id),
                x => x.HasOne<MusicModel>().WithMany().HasForeignKey(x => x.TrackHash).HasPrincipalKey(x => x.Hash));

        entity.Navigation(x => x.Instruments).AutoInclude();
    }

    public string Name { get; set; }

    public string DisplayName => GetDisplayName();

    public string Author { get; set; }
    public string Source { get; set; }
    public Mood Mood1 { get; set; }
    public Mood Mood2 { get; set; }
    public Nation Language { get; set; }
    public Nation Nation { get; set; }
    public Instrumentation Instrumentation { get; set; }
    public Participants Participants { get; set; }
    public List<InstrumentModel> Instruments { get; set; } = new List<InstrumentModel>();
    [NotMapped] public IEnumerable<InstrumentType> InstrumentTypes => Instruments.Select((x) => x.Type).Distinct();

    [NotMapped] public IEnumerable<string> InstrumentNames => Instruments.Select(x => x.Name);

    public IEnumerable<MusicGenre> Genres { get; set; } = new List<MusicGenre>();
    public string Path { get; set; }
    public string Lyrics { get; set; }
    public byte Rating { get; set; }
    public bool Complete { get; set; }
    [Key] public string Hash { get; set; }
    [JsonIgnore]
    [IgnoreDataMember] public long FileBytes { get; set; }
    public bool Deleted { get; set; }

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
        if ((Author is not null) && (Author != "undefined"))
            result += $" - {Author}";
        if (!string.IsNullOrEmpty(Source))
            result += $" ({Source})";
        return result;
    }
}