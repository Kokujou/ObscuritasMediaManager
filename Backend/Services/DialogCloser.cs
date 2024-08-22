using System.Runtime.InteropServices;

namespace ObscuritasMediaManager.Backend.Services;

public static class DialogCloser
{
    [DllImport("User32.dll")]
    public static extern bool SetForegroundWindow(IntPtr handle);

    [DllImport("User32.dll")]
    public static extern bool ShowWindow(IntPtr handle, int nCmdShow);

    [DllImport("User32.dll")]
    public static extern bool IsIconic(IntPtr handle);
}