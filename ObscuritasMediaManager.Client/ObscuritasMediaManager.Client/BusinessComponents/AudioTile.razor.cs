using Microsoft.AspNetCore.Components;

namespace ObscuritasMediaManager.Client.BusinessComponents;

public partial class AudioTile
{
    [Parameter] public MusicModel? Track { get; set; }
    [Parameter] public bool Visualization { get; set; }
    [Parameter] public bool Paused { get; set; }
    [Parameter] public EventCallback MusicToggled { get; set; }
    [Parameter] public EventCallback SoftDelete { get; set; }
    [Parameter] public EventCallback HardDelete { get; set; }
    [Parameter] public EventCallback Restore { get; set; }
}