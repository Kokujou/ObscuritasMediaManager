
using Microsoft.AspNetCore.Components;
using ObscuritasMediaManager.Backend.Data.Music;

namespace ObscuritasMediaManager.Client.BusinessComponents.MusicFilter;

public partial class MusicFilter
{
    [Parameter] public MusicFilterOptions filter { get; set; } = new(new List<string>());
    [Parameter] public Func<MusicModel, object>? sortingProperty { get; set; }
    [Parameter] public SortDirection? sortingDirection { get; set; }
    [Parameter] public EventCallback<MusicFilterOptions> filterChanged { get; set; }

    public void changeSorting(Func<MusicModel, object>? property = null, SortDirection? direction = null)
    {
        if (property is not null) sortingProperty = property;
        if (direction is not null) sortingDirection = direction;
    }

    public bool canFilterInstrumentType(InstrumentType type)
    {
        return !filter.instrumentTypes.required.Any((x) => x == type);
    }
}