using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using ObscuritasMediaManager.Backend.DataRepositories;
using ObscuritasMediaManager.Backend.DataRepositories.Interfaces;

namespace ObscuritasMediaManager.Backend
{
    public class Startup
    {
        // This method gets called by the runtime. Use this method to add services to the container.
        // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
        public void ConfigureServices(IServiceCollection services)
        {
            MvcServiceCollectionExtensions.AddControllers(services);
            ServiceCollectionServiceExtensions.AddScoped<IGenreRepository, GenreRepository>(services);
            ServiceCollectionServiceExtensions.AddScoped<IMediaRepository, MediaRepository>(services);
            ServiceCollectionServiceExtensions.AddScoped<IStreamingRepository, StreamingRepository>(services);
            ServiceCollectionServiceExtensions.AddScoped<IMusicRepository, MusicRepository>(services);

            EntityFrameworkServiceCollectionExtensions.AddDbContext<DatabaseContext>(services,
                x => x.UseSqlite(@"Data Source=database.sqlite"));

            CorsServiceCollectionExtensions.AddCors(services, x =>
                x.AddPolicy("all",
                    builder => builder.WithOrigins("https://localhost", "https://obscuritas.strangled.net")
                        .AllowAnyHeader().AllowAnyMethod()));

            MvcCoreMvcBuilderExtensions.AddJsonOptions(MvcServiceCollectionExtensions.AddMvc(services),
                options => { options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()); });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment()) app.UseDeveloperExceptionPage();

            app.UseRouting();
            app.UseHttpsRedirection();

            app.UseCors("all");

            app.UseEndpoints(endpoints => { endpoints.MapControllers(); });
        }
    }
}