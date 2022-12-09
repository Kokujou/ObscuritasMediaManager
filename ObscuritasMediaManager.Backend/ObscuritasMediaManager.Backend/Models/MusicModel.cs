using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using ObscuritasMediaManager.Backend.Data.Music;
using ObscuritasMediaManager.Backend.Extensions;

namespace ObscuritasMediaManager.Backend.Models;

public class MusicModel
{
    public string Name { get; set; }
    public string Author { get; set; }
    public string Source { get; set; }
    public Mood Mood1 { get; set; }
    public Mood Mood2 { get; set; }
    public Nation Language { get; set; }
    public Nation Nation { get; set; }
    public Instrumentation Instrumentation { get; set; }
    public Participants Participants { get; set; }
    public IEnumerable<string> Instruments { get; set; } = new List<string>();
    public IEnumerable<MusicGenre> Genres { get; set; } = new List<MusicGenre>();
    public string Path { get; set; }
    public byte Rating { get; set; }
    public bool Complete { get; set; }

    [Key] public string Hash { get; set; }

    [JsonIgnore]
    [Newtonsoft.Json.JsonIgnore]
    public long FileBytes { get; set; }

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
}