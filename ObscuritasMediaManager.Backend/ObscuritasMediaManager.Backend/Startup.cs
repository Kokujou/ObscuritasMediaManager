using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using ObscuritasMediaManager.Backend.Authentication;
using ObscuritasMediaManager.Backend.DataRepositories;
using Xabe.FFmpeg;

namespace ObscuritasMediaManager.Backend;

public class Startup
{
    // This method gets called by the runtime. Use this method to add services to the container.
    // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddControllers();
        services.AddScoped<GenreRepository>();
        services.AddScoped<MediaRepository>();
        services.AddScoped<StreamingRepository>();
        services.AddScoped<MusicRepository>();
        services.AddScoped<UserRepository>();
        services.AddScoped<PlaylistRepository>();
        services.AddScoped<RecipeRepository>();

        services.AddDbContext<DatabaseContext>(x => x.UseSqlite(@"Data Source=database.sqlite"));

        services.AddCors(x =>
            x.AddPolicy("all",
                builder => builder.WithOrigins("https://localhost", "https://obscuritas.strangled.net")
                    .AllowAnyHeader().AllowAnyMethod()));

        services.AddMvc().AddJsonOptions(options =>
        {
            options.JsonSerializerOptions.Converters.Add(
                new JsonStringEnumConverter());
        });

        JsonConvert.DefaultSettings = () => new()
        {
            ContractResolver = new DefaultContractResolver
            {
                NamingStrategy = new CamelCaseNamingStrategy()
            }
        };

        FFmpeg.SetExecutablesPath("D:\\Programme\\ffmpeg\\bin");

        services.AddSwaggerGen(options => { });

        services.AddAuthentication("basic")
            .AddScheme<AuthenticationSchemeOptions, BasicAuthenticationHandler>("basic", null);
        services.AddAuthorization();
    }

    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
        app.UseRouting();
        app.UseHttpsRedirection();
        app.UseExceptionHandler(a => a.Run(async context =>
        {
            var exceptionHandlerPathFeature = context.Features.Get<IExceptionHandlerPathFeature>();
            var exception = exceptionHandlerPathFeature?.Error;
            context.Response.StatusCode = 400;

            await context.Response.WriteAsJsonAsync(new
                { Reason = exception?.Message, InnerException = exception?.InnerException?.Message });
        }));

        app.UseCors("all");
        app.UseAuthentication();
        app.UseAuthorization();


        app.UseEndpoints(endpoints => { endpoints.MapControllers(); });

        app.UseSwagger();
        app.UseSwaggerUI(options =>
        {
            options.SwaggerEndpoint("/ObscuritasMediaManager/swagger/v1/swagger.json",
                "Obscuritas Media management");
        });
    }
}