using System;
using System.IO;
using System.Linq;
using System.Windows;

namespace ObscuritasMediaManager.ClientInterop.Queries;

public class RequestFolderContentHandler : IQueryHandler
{
    private static readonly FolderBrowserDialog folderBrowserDialog = new FolderBrowserDialog();

    public InteropQuery Query => InteropQuery.RequestFolderContent;

    public async Task<object?> ExecuteAsync(JsonElement? payload)
    {
        string[]? files = null;

        App.Current.Dispatcher
            .Invoke(
                () =>
                {
                    MainWindow.Instance.Show();
                    MainWindow.Instance.Visibility = Visibility.Hidden;
                    var result = folderBrowserDialog.ShowDialog();
                    if (result != DialogResult.OK) return;
                    files = Directory.GetFiles(folderBrowserDialog.SelectedPath, "*.*", SearchOption.AllDirectories);
                });
        return files;
    }
}
