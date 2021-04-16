using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
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
            services.AddControllers();
            services.AddSingleton<IGenreRepository, GenreRepository>();
            services.AddSingleton<IMediaRepository, MediaRepository>();
            services.AddSingleton<IStreamingRepository, StreamingRepository>();

            services.AddCors(x =>
                x.AddPolicy("all",
                    builder => builder.WithOrigins("https://localhost").AllowAnyHeader().AllowAnyMethod()));
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment()) app.UseDeveloperExceptionPage();

            app.UseRouting();

            app.UseCors("all");

            app.UseEndpoints(endpoints => { endpoints.MapControllers(); });
        }
    }
}