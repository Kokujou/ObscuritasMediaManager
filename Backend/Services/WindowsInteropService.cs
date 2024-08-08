using System.Runtime.InteropServices;

namespace ObscuritasMediaManager.Backend.Services;

public static class WindowsInteropService
{
    [DllImport("user32.dll")]
    public static extern short GetAsyncKeyState(int vKey);
}