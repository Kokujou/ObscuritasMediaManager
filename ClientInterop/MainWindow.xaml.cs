﻿using Serilog;
using Serilog.Events;
using System.IO;
using System.Runtime.CompilerServices;
using System.Windows;
using System.Windows.Media.Imaging;

namespace ObscuritasMediaManager.ClientInterop;

public partial class MainWindow : Window
{
    public static MainWindow Instance { get; private set; }

    public static string GetProjectPath([CallerFilePath] string currentFilePath = "")
    {
        return Path.GetDirectoryName(currentFilePath)!;
    }

    public NotifyIcon NotifyIcon { get; set; }

    public MainWindow()
    {
        InitializeComponent();
        Instance = this;
        NotifyIcon = new NotifyIcon();
        NotifyIcon.Visible = true;
        NotifyIcon.Icon = new(Path.Combine(GetProjectPath(), "magic-circle.ico"));
        NotifyIcon.ContextMenuStrip = new();
        NotifyIcon.ContextMenuStrip.Items.Add("Beenden", null, new EventHandler((_, _) => Close()));
        Icon = BitmapFrame.Create(new Uri(Path.Combine(GetProjectPath(), "magic-circle.ico")));
        Topmost = true;
        Hide();

        var server = new WebSocketServer("ws://localhost:8005");
        server.AddWebSocketService<WebSocketInterop>("/Interop");
        server.Start();

        ProtocolRegistrationService.RegisterProtocol();

        Log.Logger = new LoggerConfiguration()
            .WriteTo
            .File(
                @"C:\LogFiles\ObscuritasMediaManager\Backend.log", LogEventLevel.Warning, retainedFileCountLimit: 2,
                rollingInterval: RollingInterval.Day)
            .CreateLogger();

        AppDomain.CurrentDomain.UnhandledException += (_, e) => Log.Error(e.ExceptionObject.ToString() ?? string.Empty);
        System.Windows.Forms.Application.ThreadException += (_, e) => Log.Error(e.Exception.ToString() ?? string.Empty);
    }
}
