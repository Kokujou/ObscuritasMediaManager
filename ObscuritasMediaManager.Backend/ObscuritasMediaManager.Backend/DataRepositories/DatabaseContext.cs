using Microsoft.EntityFrameworkCore;
using ObscuritasMediaManager.Backend.Extensions;
using ObscuritasMediaManager.Backend.Models;

namespace ObscuritasMediaManager.Backend.DataRepositories
{
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

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<MediaModel>()
                .Property(x => x.GenreString).HasColumnName(nameof(MediaModel.Genres));

            modelBuilder.Entity<MusicModel>()
                .Property(x => x.GenreString).HasColumnName(nameof(MusicModel.Genres));
            modelBuilder.Entity<MusicModel>()
                .Property(x => x.InstrumentsString).HasColumnName("Instruments");

            modelBuilder.Entity<StreamingEntryModel>()
                .HasKey(x => new {x.Id, x.Season, x.Episode});

            modelBuilder.Entity<GenreModel>();

            modelBuilder.Entity<InstrumentModel>();

            modelBuilder.AddEnumConversion();
        }
    }
}