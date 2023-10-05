using Microsoft.AspNetCore.Components;
using System;
using System.Linq;

namespace ObscuritasMediaManager.Client.BusinessComponents.MediaFilter;

public partial class MediaFilterSidebar
{
    [Parameter]
    public MediaFilter Filter { get; set; } = new(new List<GenreModel>());
    [Parameter] public EventCallback<MediaFilter> FilterChanged { get; set; }
    [Parameter] public RenderFragment? Footer { get; set; }

    private void resetFilter()
    {
        Filter = new(Filter.genres.states.Keys);

        FilterChanged.InvokeAsync(Filter);
    }

    private void ChangeFilter(Action<MediaFilter> action)
    {
        action(Filter);
        FilterChanged.InvokeAsync(Filter);
    }

    private void openGenreDialog() { }
}
