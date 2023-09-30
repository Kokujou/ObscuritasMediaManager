using Microsoft.AspNetCore.Components;

namespace ObscuritasMediaManager.Client.GenericComponents;

public partial class PaginatedScrolling
{
    [Parameter] public int ScrollTopThreshold { get; set; } = 0;
    [Parameter] public EventCallback ScrollBottom { get; set; }
    [Parameter] public RenderFragment? ChildContent { get; set; }
    public required ElementReference ScrollContainer { get; set; }

    public async Task ScrollToTopAsync()
    {
        await JS.InvokeVoidAsync("scrollToTop", ScrollContainer);
    }

    public async Task CheckIfScrolledToBottom()
    {
        var isBottom = await JS.InvokeAsync<bool>("isScrolledToBottom", ScrollContainer, ScrollTopThreshold);
        if (isBottom) await ScrollBottom.InvokeAsync();
    }

    public async Task ScrollToChildAsync(ElementReference child)
    {
        await JS.InvokeVoidAsync("scrollToChild", ScrollContainer, child);
    }
}