using Microsoft.AspNetCore.Components;

namespace ObscuritasMediaManager.Client.BusinessComponents;

public partial class PlaylistTile
{
    [Parameter] public PlaylistModel? Playlist { get; set; }
    [Parameter] public EventCallback LocalExport { get; set; }
    [Parameter] public EventCallback GlobalExport { get; set; }
    [Parameter] public EventCallback Remove { get; set; }
}