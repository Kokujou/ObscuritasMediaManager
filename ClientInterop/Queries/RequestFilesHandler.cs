using ObscuritasMediaManager.ClientInterop.Requests;
using System.Windows;
using Application = System.Windows.Application;

namespace ObscuritasMediaManager.ClientInterop.Queries;

public class RequestFilesHandler : IQueryHandler
{
    private static readonly OpenFileDialog OpenFileDialog = new();

    public InteropQuery Query => InteropQuery.RequestFiles;

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
                    var request = payload?.Deserialize<FilesQueryRequest>(WebSocketInterop.DefaultJsonOptions)!;
                    OpenFileDialog.Multiselect = request.Multiselect;
                    OpenFileDialog.Filter = request.GetDialogFilter();
                    var result = OpenFileDialog.ShowDialog();
                    MainWindow.Instance.Hide();
                    if (result != DialogResult.OK)
                    {
                        return;
                    }

                    files = OpenFileDialog.FileNames;
                });
        return files;
    }
}