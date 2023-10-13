using System;
using System.Linq;
using System.Windows.Forms;

namespace ObscuritasMediaManager.Client.Extensions;

public static class ThreadingExtensions
{
    private static TaskCompletionSource<DialogResult>? _taskCompletionSource;
    private static Form? _dialogForm;

    public static async Task<DialogResult> ShowDialogAsync(this OpenFileDialog dialog)
    {
        if (_dialogForm is not null)
        {
            var handle = _dialogForm.Invoke(() => _dialogForm.Handle);
            if (DialogCloser.IsIconic(handle)) DialogCloser.ShowWindow(handle, 9);
            DialogCloser.SetForegroundWindow(handle);
            _taskCompletionSource?.TrySetCanceled();
            _taskCompletionSource = new TaskCompletionSource<DialogResult>();
            return await _taskCompletionSource.Task;
        }

        _dialogForm = new Form();
        _taskCompletionSource = new TaskCompletionSource<DialogResult>();
        var thread = new Thread(() => _taskCompletionSource.TrySetResult(dialog.ShowDialog(_dialogForm)));
        thread.SetApartmentState(ApartmentState.STA);
        thread.Start();

        var result = await _taskCompletionSource.Task;
        _dialogForm = null;
        return result;
    }
}
