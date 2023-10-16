using Genius;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using ObscuritasMediaManager.Backend.DataRepositories;
using ObscuritasMediaManager.Client.Services;
using Serilog.Events;
using Xabe.FFmpeg;

namespace ObscuritasMediaManager.Client;

public static class Program
{
    public static IServiceProvider? Services { get; private set; }

    public static async void Init()
    {
        AppDomain.CurrentDomain.UnhandledException += (sender,
            args) => Log.Error(args.ExceptionObject?.ToString() ?? string.Empty);
        FFmpeg.SetExecutablesPath("D:\\Programme\\ffmpeg\\bin");

        IHost host = Host.CreateDefaultBuilder()
            .UseSerilog((hostContext, services, configuration)
        => configuration.WriteTo
                    .File(@"C:\LogFiles\ObscuritasMediaManager\Backend.log", LogEventLevel.Warning, retainedFileCountLimit: 2,
                    rollingInterval: RollingInterval.Day))
            .ConfigureServices(WireupServices)
            .Build();
        Services = host.Services;
    }

    private static void WireupServices(IServiceCollection services)
    {
        services.AddWpfBlazorWebView();
#if DEBUG
        services.AddBlazorWebViewDeveloperTools();
#endif
        services.AddScoped<GenreRepository>();
        services.AddScoped<MediaRepository>();
        services.AddScoped<StreamingRepository>();
        services.AddScoped<MusicRepository>();
        services.AddScoped<UserRepository>();
        services.AddScoped<PlaylistRepository>();
        services.AddScoped<RecipeRepository>();
        services.AddScoped<LyricsService>();
        services.AddSingleton(new GeniusClient("_i5cToYg6uB_yorzbeVRYbBtqfLdhU-LtzTxaA5swKJVkDK3W_Yj33IILm1VdL1o"));
        services.AddSingleton<MusicFilterService>();
        services.AddSingleton<MediaFilterService>();
        services.AddSingleton<Session>();
        services.AddSingleton<AudioService>();
        services.AddSingleton<AudioFileImportService>();

        services.AddDbContext<DatabaseContext>(
            x => x.UseSqlite(
                @"Data Source=J:\Dokumente\Web-Projekte\Obscuritas Media Manager\ObscuritasMediaManager.Backend\ObscuritasMediaManager.Backend/database.sqlite")
                .UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking)
                .EnableSensitiveDataLogging());
    }
}
