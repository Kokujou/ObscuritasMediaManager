using System.ComponentModel.DataAnnotations.Schema;

namespace ObscuritasMediaManager.Backend.Models;

[Table("PlaylistTrackMapping", Schema = "dbo")]
public record PlaylistTrackMappingModel
{
    public static PlaylistTrackMappingModel Create(Guid playlistId, string playlistName, MusicModel track, int index)
    {
        return new()
               {
                   PlaylistId = playlistId,
                   PlaylistName = playlistName,
                   Playlist = new PlaylistModel { Id = playlistId },
                   TrackHash = track.Hash,
                   TrackName = track.Name,
                   Track = track,
                   Order = index
               };
    }

    public Guid PlaylistId { get; set; }
    public string PlaylistName { get; set; }
    public PlaylistModel Playlist { get; set; }
    public string TrackHash { get; set; }
    public string TrackName { get; set; }
    public MusicModel Track { get; set; }
    public int Order { get; set; }
}