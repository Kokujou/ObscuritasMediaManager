
using Microsoft.AspNetCore.Components;

namespace ObscuritasMediaManager.Client.Layout;

public partial class PageLayout
{
    public static float ScaleFactorX => ((float)MainWindow.Instance!.ActualWidth) / 1920;

    public static float ScaleFactorY => (((float)MainWindow.Instance!.ActualHeight) - 20) / 1080;

    public static Dictionary<object, RenderFragment> Children { get; set; } = new();
    public static EventHandler ChildrenChanged { get; set; }

    public PageLayout()
    {
        MainWindow.Instance.SizeChanged += (_, _) => StateHasChanged();
        MainWindow.Instance.StateChanged += (_, _) => StateHasChanged();
        ChildrenChanged += (_, _) => StateHasChanged();
    }

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        await base.OnAfterRenderAsync(firstRender);

        if (firstRender) StateHasChanged();
        if (firstRender || Session.initialized) return;

        try
        {
            await Session.InitializeAsync();
        }
        catch (UnauthorizedAccessException ex)
        {
            NavigationManager.NavigateTo("/login");
        }
    }
}