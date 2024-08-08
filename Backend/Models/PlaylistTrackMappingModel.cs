using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ObscuritasMediaManager.Backend.Models;

[Table("PlaylistTrackMapping")]
public record PlaylistTrackMappingModel
{
    public static PlaylistTrackMappingModel Create(Guid playlistId, string playlistName, MusicModel track, int index)
    {
        return new()
        {
            PlaylistId = playlistId,
            PlaylistName = playlistName,
            Playlist = new() { Id = playlistId, Name = playlistName },
            TrackHash = track.Hash,
            TrackName = track.Name,
            Track = track,
            Order = index
        };
    }

    public required Guid PlaylistId { get; set; }
    [MaxLength(255)] public required string PlaylistName { get; set; }
    public PlaylistModel? Playlist { get; set; }
    [MaxLength(255)] public string? TrackHash { get; set; }
    [MaxLength(255)] public required string TrackName { get; set; }
    public MusicModel? Track { get; set; }
    public int Order { get; set; }
}