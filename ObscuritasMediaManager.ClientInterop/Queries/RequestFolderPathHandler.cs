using System;
using System.Linq;

namespace ObscuritasMediaManager.ClientInterop.Queries;

public class RequestFolderPathHandler : IQueryHandler
{
    public InteropQuery Query => InteropQuery.RequestFolderPath;

    public async Task<object?> ExecuteAsync(JsonElement? payload)
    {
        return await App.Current.Dispatcher
            .InvokeAsync(
                () =>
                {
                    var folderBrowserDialog = new FolderBrowserDialog();
                    var result = folderBrowserDialog.ShowDialog();
                    if (result != DialogResult.OK) return null;
                    return folderBrowserDialog.SelectedPath;
                });
    }
}
