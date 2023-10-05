using Microsoft.AspNetCore.Components;
using System;
using System.Linq;

namespace ObscuritasMediaManager.Client.BusinessComponents;

public partial class MediaTile : ComponentBase
{
    [Parameter] public DisplayStyle displayStyle { get; set; } = DisplayStyle.Solid;
    [Parameter] public MediaModel Media { get; set; } = new();
    [Parameter] public bool Disabled { get; set; }
    [Parameter] public EventCallback<int> RatingChanged { get; set; }
    [Parameter] public EventCallback<List<GenreModel>> GenresChanged { get; set; }
    [Parameter] public EventCallback<string> ImageReceived { get; set; }
    [Parameter] public RenderFragment? ChildContent { get; set; }
    private int hoveredRating = -1;

    public enum DisplayStyle
    {
        Simple,
        Solid,
    }
}
