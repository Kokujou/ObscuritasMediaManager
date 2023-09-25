
namespace ObscuritasMediaManager.Client.Layout;

public partial class PageLayout
{
    public static float ScaleFactorX => ((float)MainWindow.Instance!.ActualWidth) / 1920;

    public static float ScaleFactorY => ((float)MainWindow.Instance!.ActualHeight) / 1080;

    public PageLayout()
    {
        MainWindow.Instance.SizeChanged += (_, _) => StateHasChanged();
        MainWindow.Instance.StateChanged += (_, _) => StateHasChanged();
    }
}