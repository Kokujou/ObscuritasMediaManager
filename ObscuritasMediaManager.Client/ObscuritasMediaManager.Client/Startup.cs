using Genius;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using ObscuritasMediaManager.Backend.DataRepositories;

namespace ObscuritasMediaManager.Client;

public static class Startup
{
    public static IServiceProvider? Services { get; private set; }

    public static void Init()
    {
        IHost host = Host.CreateDefaultBuilder().ConfigureServices(WireupServices).Build();
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

        services.AddDbContext<DatabaseContext>(
            x => x.UseSqlite(@"Data Source=database.sqlite")
                .UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking)
                .EnableSensitiveDataLogging());
    }
}
