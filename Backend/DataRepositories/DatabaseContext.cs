using Microsoft.EntityFrameworkCore;
using ObscuritasMediaManager.Backend.Data.Music;
using ObscuritasMediaManager.Backend.Extensions;
using ObscuritasMediaManager.Backend.Models;
using System.Reflection;

namespace ObscuritasMediaManager.Backend.DataRepositories;

public class DatabaseContext(DbContextOptions<DatabaseContext> options) : DbContext(options)
{
    public DbSet<MediaGenreModel> MediaGenres { get; set; }
    public DbSet<MediaModel> Media { get; set; }
    public DbSet<MusicModel> Music { get; set; }
    public DbSet<InstrumentModel> Instruments { get; set; }
    public DbSet<UserModel> Users { get; set; }
    public DbSet<PlaylistTrackMappingModel> PlaylistEntries { get; set; }
    public DbSet<PlaylistModel> Playlists { get; set; }
    public DbSet<RecipeModel> Recipes { get; set; }
    public DbSet<UserSettingsModel> UserSettings { get; set; }
    public DbSet<RecipeCookwareMappingModel> Cookware { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        MediaModel.Configure(modelBuilder);

        modelBuilder.Entity<MusicModel>()
            .Property(x => x.Genres)
            .HasConversion(
                x => string.Join(",", x),
                x => x.Split(",",
                    StringSplitOptions.RemoveEmptyEntries).Select(y => y.ParseEnumOrDefault<MusicGenre>()).ToList());

        PlaylistModel.Configure(modelBuilder);

        modelBuilder.Entity<MusicInstrumentMappingModel>();

        MusicModel.Configure(modelBuilder);

        modelBuilder.Entity<GenreModel>();

        modelBuilder.Entity<InstrumentModel>();

        modelBuilder.Entity<UserSettingsModel>();

        RecipeModelBase.Configure(modelBuilder);

        modelBuilder.AddEnumConversion();

        foreach (var entityType in modelBuilder.Model.GetEntityTypes())
        {
            foreach (var navigation in entityType.GetNavigations()
                         .Where(n => n.PropertyInfo?.GetCustomAttribute<IgnoreAutoIncludeAttribute>() is null))
                navigation.SetIsEagerLoaded(true);
            foreach (var navigation in entityType.GetSkipNavigations()
                         .Where(x => x.PropertyInfo is not null)
                         .Where(n => n.PropertyInfo!.GetCustomAttribute<IgnoreAutoIncludeAttribute>() is null))
                navigation.SetIsEagerLoaded(true);
        }
    }
}