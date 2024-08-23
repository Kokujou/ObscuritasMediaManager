using ObscuritasMediaManager.ClientInterop.Commands;
using Serilog;
using Serilog.Events;
using System.IO;
using System.Net.Sockets;
using System.Runtime.CompilerServices;
using System.Windows.Media.Imaging;
using Application = System.Windows.Forms.Application;

namespace ObscuritasMediaManager.ClientInterop;

public partial class MainWindow
{
    public static MainWindow Instance { get; private set; } = null!;

    public static string GetProjectPath([CallerFilePath] string currentFilePath = "")
    {
        return Path.GetDirectoryName(currentFilePath)!;
    }

    public NotifyIcon NotifyIcon { get; set; }

    public MainWindow()
    {
        InitializeComponent();
        Instance = this;
        NotifyIcon = new();
        NotifyIcon.Visible = true;
        NotifyIcon.Icon = new(Path.Combine(GetProjectPath(), "magic-circle.ico"));
        NotifyIcon.ContextMenuStrip = new();
        NotifyIcon.ContextMenuStrip.Items.Add("Beenden", null, (_, _) => Close());
        Icon = BitmapFrame.Create(new Uri(Path.Combine(GetProjectPath(), "magic-circle.ico")));
        Topmost = true;
        Hide();
        var server = new WebSocketInteropServer();
        server.AddWebSocketService<WebSocketInteropClient>("/Interop");
        server.Start();

        ProtocolRegistrationService.RegisterProtocol();

        Log.Logger = new LoggerConfiguration()
            .WriteTo
            .File(
                @"C:\LogFiles\ObscuritasMediaManager\Backend.log", LogEventLevel.Warning, retainedFileCountLimit: 2,
                rollingInterval: RollingInterval.Day)
            .CreateLogger();

        AppDomain.CurrentDomain.UnhandledException += (_, e) => Log.Error(e.ExceptionObject.ToString() ?? string.Empty);
        Application.ThreadException += (_, e) => Log.Error(e.Exception.ToString());

        var client = new UdpClient();
        client.Connect("127.0.0.1", 80);
        client.Send([1]);

        Closing += (_, _) =>
        {
            OpenChromeForDebuggingHandler.TerminateProcess();
            client.Send([0]);
            client.Dispose();
        };
    }
}