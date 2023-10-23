using System;
using System.Collections.Specialized;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices;

namespace ObscuritasMediaManager.ClientInterop.Commands;

public class CopyAudioToClipboardHandler : ICommandHandler
{
    [DllImport("shell32.dll", CharSet = CharSet.Auto)]
    public static extern IntPtr ILCreateFromPath(string path);

    [DllImport("shell32.dll", CharSet = CharSet.None)]
    public static extern void ILFree(IntPtr pidl);

    [DllImport("shell32.dll", CharSet = CharSet.None)]
    public static extern int ILGetSize(IntPtr pidl);

    private static MemoryStream CreateShellIDList(StringCollection filenames)
    {
        var pos = 0;
        var pidls = new byte[filenames.Count][];
        foreach (var filename in filenames)
        {
            var pidl = ILCreateFromPath(filename);
            var pidlSize = ILGetSize(pidl);
            pidls[pos] = new byte[pidlSize];
            Marshal.Copy(pidl, pidls[pos++], 0, pidlSize);
            ILFree(pidl);
        }

        var pidlOffset = 4 * (filenames.Count + 2);
        using var memStream = new MemoryStream();
        using var sw = new BinaryWriter(memStream);
        sw.Write(filenames.Count);
        sw.Write(pidlOffset);
        pidlOffset += 4;
        foreach (var pidl in pidls)
        {
            sw.Write(pidlOffset);
            pidlOffset += pidl.Length;
        }

        sw.Write(0);
        foreach (var pidl in pidls) sw.Write(pidl);
        return memStream;
    }

    public InteropCommand Command => InteropCommand.CopyAudioToClipboard;

    [STAThread]
    public async Task ExecuteAsync(JsonElement? payload)
    {
        await Task.Yield();
        var trackPath = payload?.GetString()!;

        var fi = new FileInfo(trackPath);
        var dataObject = new DataObject();
        dataObject.SetFileDropList(new StringCollection { fi.FullName });
        dataObject.SetData("Shell IDList Array", true, CreateShellIDList(new() { fi.FullName }));

        var thread = new Thread(() => Clipboard.SetDataObject(dataObject, true));

        thread.SetApartmentState(ApartmentState.STA);
        thread.Start();
        thread.Join();
    }
}
