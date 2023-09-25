using System.ComponentModel.DataAnnotations.Schema;

namespace ObscuritasMediaManager.Backend.Models;

[Table("UserSettings")]
public class UserSettingsModel
{
    public Guid Id { get; set; }
    public int Volume { get; set; }
    public string MusicFilter { get; set; }
    public string MediaFilter { get; set; }
}
