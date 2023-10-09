
using Microsoft.AspNetCore.Components;
using ObscuritasMediaManager.Client.GenericComponents;

namespace ObscuritasMediaManager.Client.Layout;

public partial class PageLayout
{
    public static float ScaleFactorX => ((float)MainWindow.Instance!.ActualWidth) / 1920;

    public static float ScaleFactorY => (((float)MainWindow.Instance!.ActualHeight) - 20) / 1080;

    public static List<DynamicallyRenderedComponent> Children { get; set; } = new();
    public static EventHandler ChildrenChanged { get; set; }

    public static List<T> GetComponents<T>()
    {
        return Children.Where(x => (x.ComponentType == typeof(T)) && (x.Instance?.Instance is T))
            .Select(x => (T)x.Instance!.Instance!)
            .ToList();
    }

    [Parameter] public RenderFragment? HeaderContent { get; set; }

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