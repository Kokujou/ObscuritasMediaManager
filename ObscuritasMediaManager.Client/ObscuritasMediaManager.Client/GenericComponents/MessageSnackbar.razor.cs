using Microsoft.AspNetCore.Components;
using ObscuritasMediaManager.Client.Layout;

namespace ObscuritasMediaManager.Client.GenericComponents;

public partial class MessageSnackbar
{
    public const int MaxInstances = 4;

    public static readonly TimeSpan FadeAnimationDuration = TimeSpan.FromMilliseconds(500);
    public static readonly TimeSpan DisplayDuration = TimeSpan.FromSeconds(5);

    public static async void Popup(string text, Type type)
    {
        var otherSnackbars = PageLayout.GetComponents<MessageSnackbar>();

        if (otherSnackbars.Count > MaxInstances)
            await otherSnackbars.First().Dismiss();

        var component = new DynamicallyRenderedComponent
                        {
                            ComponentType = typeof(MessageSnackbar),
                            Parameters = new() { { nameof(Message), text }, { nameof(MessageType), type } }
                        };
        PageLayout.Children.Add(component);
        PageLayout.ChildrenChanged(null, null);
    }

    [Parameter] public required string Message { get; set; }
    [Parameter] public required Type MessageType { get; set; }
    private int Top { get; set; }
    private ElementReference HostReference { get; set; }

    private string BackgroundColor
                       => MessageType switch
                       {
                           Type.Success => "green",
                           Type.Warning => "yellow",
                           Type.Error => "red",
                           Type.Info => "lightblue",
                           _ => throw new NotImplementedException()
                       };

    private bool Deleted { get; set; } = true;

    public async Task<int> GetElementHeightAsync(ElementReference element)
    {
        return (int)await JS.InvokeAsync<float>("getElementHeight", element);
    }

    public async Task Dismiss()
    {
        Deleted = true;
        StateHasChanged();
        await Task.Delay(FadeAnimationDuration);

        PageLayout.Children.Remove(PageLayout.Children.First(x => x.Instance?.Instance == this));
        PageLayout.ChildrenChanged.Invoke(null, null);
        var otherSnackbars = PageLayout.GetComponents<MessageSnackbar>();
        await Task.Yield();

        for (var i = 0; i < otherSnackbars.Count; i++)
        {
            var snackbar = otherSnackbars[i];
            if (i == 0)
                snackbar.Top = 40;
            else
            {
                var previous = otherSnackbars[i - 1];
                snackbar.Top = previous.Top + (await GetElementHeightAsync(previous.HostReference)) + 10;
            }
            snackbar.StateHasChanged();
        }
        PageLayout.ChildrenChanged.Invoke(null, null);
    }

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        await base.OnAfterRenderAsync(firstRender);
        if (firstRender)
        {
            var otherSnackbars = PageLayout.GetComponents<MessageSnackbar>();

            var currentIndex = otherSnackbars.IndexOf(this);
            var previous = (currentIndex <= 0) ? this : otherSnackbars[currentIndex - 1];

            Top = previous.Top + (await GetElementHeightAsync(previous.HostReference)) + 10;
            Deleted = false;
            StateHasChanged();

            await Task.Delay(DisplayDuration);
            await Dismiss();
        }
    }

    public enum Type
    {
        Success,
        Warning,
        Error,
        Info
    }
}