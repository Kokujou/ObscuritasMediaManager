using ObscuritasMediaManager.ClientInterop.Requests;
using System;
using System.Linq;

namespace ObscuritasMediaManager.ClientInterop.Queries;

public class RequestFilesHandler : IQueryHandler
{
    private static readonly OpenFileDialog OpenFileDialog = new();

    public InteropQuery Query => InteropQuery.RequestFiles;

    public async Task<object?> ExecuteAsync(JsonElement? payload)
    {
        await Task.Yield();
        var request = payload?.Deserialize<FilesQueryRequest>(WebSocketInterop.DefaultJsonOptions)!;

        OpenFileDialog.Multiselect = request.Multiselect;
        OpenFileDialog.Filter = request.GetDialogFilter();

        var result = OpenFileDialog.ShowDialog();
        if (result != DialogResult.OK) return null;
        return OpenFileDialog.FileNames;
    }
}
