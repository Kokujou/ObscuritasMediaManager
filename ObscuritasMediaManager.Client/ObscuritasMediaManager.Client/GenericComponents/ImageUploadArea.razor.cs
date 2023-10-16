using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Forms;
using Microsoft.AspNetCore.Components.Web;
using System;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Reflection.Metadata;
using System.Windows.Forms;
using File = System.IO.File;

namespace ObscuritasMediaManager.Client.GenericComponents;

public partial class ImageUploadArea
{
    private static OpenFileDialog ImageBrowser = new() { Filter = FileDialogConstants.ImageFilter };

    public required ElementReference UploadDescription { get; set; }
    [Parameter] public EventCallback<string> ImageReceived { get; set; }
    public required InputFile FileInput { get; set; }
    private bool Focused { get; set; }

    private async Task openImageBrowser()
    {
        var result = ImageBrowser.ShowDialog();
        if (result != DialogResult.OK) return;

        try
        {
            var fileBytes = await File.ReadAllBytesAsync(ImageBrowser.FileName);
            var selectedImageData = Convert.ToBase64String(fileBytes);
            await ImageReceived.InvokeAsync(selectedImageData);
        }
        catch (Exception ex)
        {
            MessageSnackbar.Popup(ex.ToString(), MessageSnackbar.Type.Error);
        }
    }

    private async Task receivePastedImage(ClipboardEventArgs args)
    {
        if (Clipboard.ContainsFileDropList())
        {
            var files = Clipboard.GetFileDropList();
            if (files.Count == 1) await ImageFileReceivedAsync(files[0]);
            return;
        }

        if (Clipboard.ContainsImage())
        {
            Debugger.Break();
            using var ms = new MemoryStream();
            var image = Clipboard.GetImage()!;
            image.Save(ms, image.RawFormat);
            var imageBytes = ms.ToArray();
            var imageData = Convert.ToBase64String(imageBytes);
            await ImageReceived.InvokeAsync(imageData);
            return;
        }
    }

    private async Task FileInputChanged(InputFileChangeEventArgs args)
    {
        using var stream = args.File.OpenReadStream();
        var fileBytes = new byte[args.File.Size];
        await stream.ReadAsync(fileBytes, 0, fileBytes.Length);
        await ImageReceived.InvokeAsync(Convert.ToBase64String(fileBytes));
        return;
    }

    private async Task ImageFileReceivedAsync(string? filename)
    {
        var supportedTypes = new[] { ".bmp", ".jpg", ".jpeg", ".png", ".webp" };
        if (string.IsNullOrEmpty(filename) || !supportedTypes.Any(filename.EndsWith)) return;
        var fileBytes = await File.ReadAllBytesAsync(filename);
        await ImageReceived.InvokeAsync(Convert.ToBase64String(fileBytes));
    }
}
