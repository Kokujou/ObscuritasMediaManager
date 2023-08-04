using System.ComponentModel.DataAnnotations.Schema;

namespace ObscuritasMediaManager.Backend.Models;

[Table("PlaylistTrackMapping", Schema = "dbo")]
public class PlaylistTrackMappingModel
{
    public Guid PlaylistId { get; set; }
    public string PlaylistName { get; set; }
    public string TrackHash { get; set; }
}