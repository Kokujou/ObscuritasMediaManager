using System;
using System.IO;
using System.Linq;
using System.Windows.Interop;

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
                    var win32Parent = new NativeWindow();
                    win32Parent.AssignHandle(new WindowInteropHelper(MainWindow.Instance).Handle);
                    var result = folderBrowserDialog.ShowDialog(win32Parent);
                    if (result != DialogResult.OK) return;
                    files = Directory.GetFiles(folderBrowserDialog.SelectedPath, "*.*", SearchOption.AllDirectories);
                });
        return files;
    }
}
