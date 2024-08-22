using System.Windows;
using Application = System.Windows.Application;

namespace ObscuritasMediaManager.ClientInterop.Queries;

public class RequestFolderPathHandler : IQueryHandler
{
    public InteropQuery Query => InteropQuery.RequestFolderPath;

    public async Task<object?> ExecuteAsync(JsonElement? payload)
    {
        return await Application.Current.Dispatcher
            .InvokeAsync(
                () =>
                {
                    MainWindow.Instance.Show();
                    MainWindow.Instance.Visibility = Visibility.Hidden;
                    var folderBrowserDialog = new FolderBrowserDialog();
                    var result = folderBrowserDialog.ShowDialog();
                    if (result != DialogResult.OK) return null;
                    return folderBrowserDialog.SelectedPath;
                });
    }
}