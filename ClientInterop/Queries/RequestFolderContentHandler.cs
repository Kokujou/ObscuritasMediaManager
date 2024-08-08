using System.IO;
using System.Windows;
using Application = System.Windows.Application;

namespace ObscuritasMediaManager.ClientInterop.Queries;

public class RequestFolderContentHandler : IQueryHandler
{
    private static readonly FolderBrowserDialog FolderBrowserDialog = new();

    public InteropQuery Query => InteropQuery.RequestFolderContent;

    public async Task<object?> ExecuteAsync(JsonElement? payload)
    {
        await Task.Yield();
        string[]? files = null;

        Application.Current.Dispatcher
            .Invoke(
                () =>
                {
                    MainWindow.Instance.Show();
                    MainWindow.Instance.Visibility = Visibility.Hidden;
                    var result = FolderBrowserDialog.ShowDialog();
                    if (result != DialogResult.OK)
                    {
                        return;
                    }

                    files = Directory.GetFiles(FolderBrowserDialog.SelectedPath, "*.*", SearchOption.AllDirectories);
                });
        return files;
    }
}