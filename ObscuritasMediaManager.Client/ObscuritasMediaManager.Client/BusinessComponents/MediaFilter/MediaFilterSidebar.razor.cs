using Microsoft.AspNetCore.Components;
using System;
using System.Linq;

namespace ObscuritasMediaManager.Client.BusinessComponents.MediaFilter;

public partial class MediaFilterSidebar
{
    [Parameter] public MediaFilter Filter { get; set; } = new(new List<GenreModel>());
    [Parameter] public EventCallback<MediaFilter> FilterUpdated { get; set; }
    [Parameter]public RenderFragment ChildContent { get; set; }
}
