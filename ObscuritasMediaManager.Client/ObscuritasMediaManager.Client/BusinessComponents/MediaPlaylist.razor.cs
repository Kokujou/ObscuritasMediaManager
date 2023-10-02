using Microsoft.AspNetCore.Components;
using ObscuritasMediaManager.Client.GenericComponents;

namespace ObscuritasMediaManager.Client.BusinessComponents;

public partial class MediaPlaylist
{
    [Parameter] public IEnumerable<MusicModel> Items { get; set; } = new List<MusicModel>();
    [Parameter] public int ActiveIndex { get; set; }
    [Parameter] public EventCallback<int> IndexChanged { get; set; }
    [Parameter] public EventCallback Randomize { get; set; }
    public required PaginatedScrolling ScrollContainer { get; set; }

    private List<MusicModel> PaginatedItems => Items.Take(maxPlaylistItems).ToList();

    private List<MusicModel> OriginalItems = new();
    private int maxPlaylistItems = 20;
    private ElementReference? activeElement;

    public override async Task SetParametersAsync(ParameterView parameters)
    {
        var oldIndex = ActiveIndex;
        await base.SetParametersAsync(parameters);
        if (ActiveIndex == oldIndex) return;
        await scrollToActive();
    }

    private async Task notifyIndexChanged(int index)
    {
        await IndexChanged.InvokeAsync(index);
        ActiveIndex = index;
        await scrollToActive();
    }

    private async Task scrollToActive()
    {
        maxPlaylistItems = ActiveIndex + 1;
        while (maxPlaylistItems.ToString()[^1] != '0') maxPlaylistItems++;

        await Task.Delay(100);
        if (activeElement is null) return;
        await ScrollContainer.ScrollToChildAsync(activeElement.Value);
    }

    private void loadMoreItems()
    {
        if (Items.Count() > maxPlaylistItems) maxPlaylistItems += 10;
    }

    private async Task randomizeOrder()
    {
        OriginalItems = Items.ToList();
        await Randomize.InvokeAsync();
    }

    private void restoreOrder()
    {
        Items = OriginalItems.ToList();
    }
}