using Microsoft.Win32;
using System.Reflection;

namespace ObscuritasMediaManager.ClientInterop.Services;

public static class ProtocolRegistrationService
{
    private const string ProtocolName = "ommci";

    public static void RegisterProtocol()
    {
        using var key = Registry.ClassesRoot.CreateSubKey(ProtocolName);
        key.SetValue(string.Empty, "URL:" + ProtocolName);
        key.SetValue("URL Protocol", string.Empty);

        using var defaultIcon = key.CreateSubKey("DefaultIcon");
        var iconPath = Assembly.GetExecutingAssembly().Location;
        defaultIcon.SetValue(string.Empty, iconPath);

        using var commandKey = key.CreateSubKey(@"shell\open\command");
        var cmdPath = Environment.ProcessPath;
        commandKey.SetValue(string.Empty, $"\"{cmdPath}\" \"%1\"");
    }
}