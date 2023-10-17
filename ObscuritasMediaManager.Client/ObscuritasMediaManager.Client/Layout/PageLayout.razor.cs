
using Microsoft.AspNetCore.Components;
using ObscuritasMediaManager.Client.Dialogs;
using ObscuritasMediaManager.Client.GenericComponents;

namespace ObscuritasMediaManager.Client.Layout;

public partial class PageLayout : IDisposable
{
    public static float ScaleFactorX => ((float)MainWindow.Instance!.ActualWidth) / 1920;

    public static float ScaleFactorY => (((float)MainWindow.Instance!.ActualHeight) - 20) / 1080;

    public static List<DynamicallyRenderedComponent> Children { get; set; } = new();
    public static EventHandler ChildrenChanged { get; set; }

    public static async Task<TComponent> SpawnComponentAsync<TComponent>() where TComponent : class
    {
        var component = new DynamicallyRenderedComponent { ComponentType = typeof(GroupedSelectionDialog) };
        Children.Add(component);
        ChildrenChanged(null, new());

        while (component.Instance?.Instance is null) await Task.Yield();

        return (TComponent) component.Instance.Instance;
    }

    public static List<T> GetComponents<T>()
    {
        return Children.Where(x => (x.ComponentType == typeof(T)) && (x.Instance?.Instance is T))
            .Select(x => (T)x.Instance!.Instance!)
            .ToList();
    }

    public static void RemoveComponent<T>(T target) where T : class
    {
        var component = Children.FirstOrDefault(x => x.Instance?.Instance == target);
        if (component is not null) Children.Remove(component);
        ChildrenChanged.Invoke(null, new());
    }

    [Parameter] public RenderFragment? HeaderContent { get; set; }

    public PageLayout()
    {
        MainWindow.Instance.SizeChanged += (_, _) => StateHasChanged();
        MainWindow.Instance.StateChanged += (_, _) => StateHasChanged();
        ChildrenChanged += (_, _) => StateHasChanged();
    }

    public void Dispose()
    {
        PageLayout.Children.Clear();
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