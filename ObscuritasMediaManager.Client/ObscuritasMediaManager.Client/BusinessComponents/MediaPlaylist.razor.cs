using Microsoft.AspNetCore.Components;

namespace ObscuritasMediaManager.Client.BusinessComponents;

public partial class MediaPlaylist
{
    [Parameter] public IEnumerable<MusicModel> Items { get; set; } = new List<MusicModel>();
    [Parameter] public int Index { get; set; }
    [Parameter] public EventCallback<int> IndexChanged { get; set; }
    [Parameter] public EventCallback Randomize { get; set; }
}