using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ObscuritasMediaManager.Backend.Models;

[Table("UserSettings")]
public class UserSettingsModel
{
    public Guid Id { get; set; }
    public int Volume { get; set; }
    [MaxLength(9999)] public string? MusicFilter { get; set; }
    [MaxLength(9999)] public string? MediaFilter { get; set; }
}