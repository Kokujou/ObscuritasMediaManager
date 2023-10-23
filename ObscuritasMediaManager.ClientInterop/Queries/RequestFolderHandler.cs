using System;
using System.Linq;

namespace ObscuritasMediaManager.ClientInterop.Queries;

public class RequestFolderHandler : IQueryHandler
{
    private static readonly FolderBrowserDialog folderBrowserDialog = new FolderBrowserDialog();

    public InteropQuery Query => InteropQuery.RequestFolder;

    public async Task<object?> ExecuteAsync(JsonElement? payload)
    {
        await Task.Yield();
        var result = folderBrowserDialog.ShowDialog();
        if (result != DialogResult.OK) return null;
        return folderBrowserDialog.SelectedPath;
    }
}
