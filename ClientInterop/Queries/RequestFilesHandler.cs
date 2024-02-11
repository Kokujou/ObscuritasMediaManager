using ObscuritasMediaManager.ClientInterop.Requests;
using System;
using System.Linq;
using System.Windows;

namespace ObscuritasMediaManager.ClientInterop.Queries;

public class RequestFilesHandler : IQueryHandler
{
    private static readonly OpenFileDialog OpenFileDialog = new();

    public InteropQuery Query => InteropQuery.RequestFiles;

    public async Task<object?> ExecuteAsync(JsonElement? payload)
    {
        string[]? files = null;
        App.Current.Dispatcher
            .Invoke(
                () =>
                {
                    MainWindow.Instance.Show();
                    MainWindow.Instance.Visibility = Visibility.Hidden;
                    var request = payload?.Deserialize<FilesQueryRequest>(WebSocketInterop.DefaultJsonOptions)!;
                    OpenFileDialog.Multiselect = request.Multiselect;
                    OpenFileDialog.Filter = request.GetDialogFilter();
                    var result = OpenFileDialog.ShowDialog();
                    MainWindow.Instance.Hide();
                    if (result != DialogResult.OK) return;
                    files = OpenFileDialog.FileNames;
                });
        return files;
    }
}
