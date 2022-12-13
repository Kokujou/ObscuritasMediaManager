using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ObscuritasMediaManager.Backend.Models;

[Table("Playlists", Schema = "dbo")]
public class PlaylistEntryModel
{
    [Key] public Guid PlaylistId { get; set; }
    public string PlaylistName { get; set; }
    public string TrackHash { get; set; }
}