
using Microsoft.AspNetCore.Components;
using ObscuritasMediaManager.Backend.Data.Music;

namespace ObscuritasMediaManager.Client.BusinessComponents.MusicFilter;

public partial class MusicFilterSidebar
{
    public static readonly List<Expression<Func<MusicModel, object>>> SortableProperties = new()
    {
        x => x.Name,
        x => x.Author,
        x => x.Source,
        x => x.Nation,
        x => x.Language,
        x => x.Rating,
        x => x.Mood1,
        x => x.Instrumentation,
        x => x.Participants
    };

    [Parameter] public MusicFilter filter { get; set; } = new();
    [Parameter] public EventCallback<MusicFilter> filterChanged { get; set; }

    public bool canFilterInstrumentType(InstrumentType type)
    {
        return !filter.instrumentTypes.required.Any((x) => x == type);
    }

    public void changeFilter(Action<MusicFilter> action)
    {
        action(filter);
        filterChanged.InvokeAsync(filter);
    }

    public void showInstrumentFilterPopup() { }

    public void resetAllFilters()
    {
        filter = new();
        filter.UpdateInstrumentNames(Session.instruments.Current.Select(x => x.Name));
        filterChanged.InvokeAsync(filter);
    }
}