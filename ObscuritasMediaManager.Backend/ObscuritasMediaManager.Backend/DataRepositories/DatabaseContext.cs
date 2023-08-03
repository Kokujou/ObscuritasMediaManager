using Microsoft.EntityFrameworkCore;
using ObscuritasMediaManager.Backend.Data.Music;
using ObscuritasMediaManager.Backend.Extensions;
using ObscuritasMediaManager.Backend.Models;

namespace ObscuritasMediaManager.Backend.DataRepositories;

public class DatabaseContext : DbContext
{
    public DatabaseContext(DbContextOptions<DatabaseContext> options)
        : base(options)
    {
    }

    public DbSet<GenreModel> Genres { get; set; }
    public DbSet<MediaModel> Media { get; set; }
    public DbSet<StreamingEntryModel> StreamingEntries { get; set; }
    public DbSet<MusicModel> Music { get; set; }
    public DbSet<InstrumentModel> Instruments { get; set; }
    public DbSet<UserModel> Users { get; set; }
    public DbSet<PlaylistTrackMappingModel> PlaylistEntries { get; set; }
    public DbSet<PlaylistModel> Playlists { get; set; }
    public DbSet<RecipeModel> Recipes { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<MediaModel>()
            .Property(x => x.Genres).HasConversion(x => string.Join(",", x),
                x => x.Split(",", StringSplitOptions.RemoveEmptyEntries));

        modelBuilder.Entity<MusicModel>()
            .Property(x => x.Genres).HasConversion(x => string.Join(",", x),
                x => x.Split(",", StringSplitOptions.RemoveEmptyEntries)
                    .Select(y => ParseEnumOrDefault<MusicGenre>(y))
                    .ToList());

        PlaylistModel.Configure(modelBuilder);

        modelBuilder.Entity<MusicModel>()
            .Property(x => x.Instruments).HasConversion(x => string.Join(",", x),
                x => x.Split(",", StringSplitOptions.RemoveEmptyEntries));

        modelBuilder.Entity<StreamingEntryModel>()
            .HasKey(x => new { x.Id, x.Season, x.Episode });

        modelBuilder.Entity<GenreModel>();

        modelBuilder.Entity<InstrumentModel>();

        RecipeModel.Configure(modelBuilder);

        modelBuilder.AddEnumConversion();
    }

    private static T ParseEnumOrDefault<T>(string value) where T : Enum
    {
        if (Enum.TryParse(typeof(T), value, out var result))
            return (T)result;
        return (T)(object)0;
    }
}