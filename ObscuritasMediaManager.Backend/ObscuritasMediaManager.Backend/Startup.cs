using Genius;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.EntityFrameworkCore;
using ObscuritasMediaManager.Backend.Authentication;
using ObscuritasMediaManager.Backend.DataRepositories;
using ObscuritasMediaManager.Backend.Services;
using System.Text.Encodings.Web;
using System.Text.Json.Serialization;
using Xabe.FFmpeg;

namespace ObscuritasMediaManager.Backend;

public class Startup
{
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddControllers();
        services.AddScoped<GenreRepository>();
        services.AddScoped<MediaRepository>();
        services.AddScoped<MusicRepository>();
        services.AddScoped<UserRepository>();
        services.AddScoped<PlaylistRepository>();
        services.AddScoped<RecipeRepository>();
        services.AddSingleton(new GeniusClient("_i5cToYg6uB_yorzbeVRYbBtqfLdhU-LtzTxaA5swKJVkDK3W_Yj33IILm1VdL1o"));
        services.AddSingleton<LyricsService>();

        services.AddDbContext<DatabaseContext>(
            x => x.UseSqlite(
                @"Data Source=J:\Dokumente\Web-Projekte\Obscuritas Media Manager\ObscuritasMediaManager.Backend\ObscuritasMediaManager.Backend/database.sqlite")
                .UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking)
                .EnableSensitiveDataLogging());

        services.AddCors(
            x =>
                x.AddPolicy(
                "all", builder =>
                                builder.WithOrigins("https://localhost", "https://obscuritas.strangled.net")
                    .AllowAnyHeader()
                    .AllowAnyMethod()));

        services.AddMvc()
            .AddJsonOptions(
                options =>
                {
                    options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());

                    options.JsonSerializerOptions.Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping;
                });

        FFmpeg.SetExecutablesPath("D:\\Programme\\ffmpeg\\bin");

        services.AddSwaggerGen(options => { });

        services.AddAuthentication("basic").AddScheme<AuthenticationSchemeOptions, BasicAuthenticationHandler>("basic", null);
        services.AddAuthorization();
    }

    public void Configure(IApplicationBuilder app)
    {
        app.Use(
            async (context, next) =>
            {
                context.Request.EnableBuffering();
                context.Features.Get<IHttpResponseBodyFeature>().DisableBuffering();
                await next();
            });
        app.UseRouting();
        app.UseHttpsRedirection();
        app.UseExceptionHandler(
            a =>
                a.Run(
                async context =>
                {
                    var exceptionHandlerPathFeature = context.Features.Get<IExceptionHandlerPathFeature>();
                    var exception = exceptionHandlerPathFeature?.Error;
                    Log.Error(exception.ToString());
                    context.Response.StatusCode = 400;

                    await context.Response
                        .WriteAsJsonAsync(
                            new { Reason = exception?.Message, InnerException = exception?.InnerException?.Message });
                }));

        app.UseCors("all");
        app.UseAuthentication();
        app.UseAuthorization();

        app.UseEndpoints(endpoints => endpoints.MapControllers());

        app.UseSwagger();
        app.UseSwaggerUI(
            options => options.SwaggerEndpoint("/ObscuritasMediaManager/swagger/v1/swagger.json", "Obscuritas Media management"));
    }
}