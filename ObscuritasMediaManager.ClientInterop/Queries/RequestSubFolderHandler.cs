using System;
using System.IO;
using System.Linq;
using System.Windows;

namespace ObscuritasMediaManager.ClientInterop.Queries;

public class RequestSubFolderHandler : IQueryHandler
{
    public InteropQuery Query => InteropQuery.RequestSubFolders;

    public async Task<object?> ExecuteAsync(JsonElement? payload)
    {
        return await App.Current.Dispatcher
            .InvokeAsync(
                () =>
                {
                    MainWindow.Instance.Show();
                    MainWindow.Instance.Visibility = Visibility.Hidden;
                    var folderBrowserDialog = new FolderBrowserDialog();
                    var result = folderBrowserDialog.ShowDialog();
                    if (result != DialogResult.OK) return null;
                    return Directory.GetDirectories(folderBrowserDialog.SelectedPath);
                });
    }
}
