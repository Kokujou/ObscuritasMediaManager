using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ObscuritasMediaManager.Backend.Models;

[Table("PlaylistTrackMapping", Schema = "dbo")]
public class PlaylistTrackMappingModel
{
    [Key] public int PlaylistId { get; set; }
    public string PlaylistName { get; set; }
    public string TrackHash { get; set; }
}