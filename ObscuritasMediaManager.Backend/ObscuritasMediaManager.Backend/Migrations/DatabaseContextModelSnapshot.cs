using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using ObscuritasMediaManager.Backend.DataRepositories;
using System;

namespace ObscuritasMediaManager.Backend.Migrations;

[DbContext(typeof(DatabaseContext))]
partial class DatabaseContextModelSnapshot : ModelSnapshot
{
    protected override void BuildModel(ModelBuilder modelBuilder)
    {
#pragma warning disable 612, 618
        modelBuilder
            .HasAnnotation("ProductVersion", "5.0.7");

        modelBuilder.Entity(
            "ObscuritasMediaManager.Backend.Models.GenreModel",
            b =>
            {
                b.Property<Guid>("Id").ValueGeneratedOnAdd().HasColumnType("TEXT");

                b.Property<string>("Name").HasColumnType("TEXT");

                b.Property<string>("Section").HasColumnType("TEXT");

                b.HasKey("Id");

                b.ToTable("Genres");
            });

        modelBuilder.Entity(
            "ObscuritasMediaManager.Backend.Models.InstrumentModel",
            b =>
            {
                b.Property<string>("Name").HasColumnType("TEXT");

                b.Property<string>("Type").IsRequired().HasColumnType("TEXT");

                b.HasKey("Name");

                b.ToTable("Instruments");
            });

        modelBuilder.Entity(
            "ObscuritasMediaManager.Backend.Models.MediaModel",
            b =>
            {
                b.Property<Guid>("Id").ValueGeneratedOnAdd().HasColumnType("TEXT");

                b.Property<string>("Description").HasColumnType("TEXT");

                b.Property<string>("GenreString").HasColumnType("TEXT").HasColumnName("Genres");

                b.Property<string>("Image").HasColumnType("TEXT");

                b.Property<string>("Name").HasColumnType("TEXT");

                b.Property<int>("Rating").HasColumnType("INTEGER");

                b.Property<int>("Release").HasColumnType("INTEGER");

                b.Property<int>("State").HasColumnType("INTEGER");

                b.Property<string>("Type").HasColumnType("TEXT");

                b.HasKey("Id");

                b.ToTable("Media");
            });

        modelBuilder.Entity(
            "ObscuritasMediaManager.Backend.Models.MusicModel",
            b =>
            {
                b.Property<Guid>("Id").ValueGeneratedOnAdd().HasColumnType("TEXT");

                b.Property<string>("Author").HasColumnType("TEXT");

                b.Property<string>("GenreString").HasColumnType("TEXT").HasColumnName("Genres");

                b.Property<string>("Instrumentation").IsRequired().HasColumnType("TEXT");

                b.Property<string>("InstrumentsString").HasColumnType("TEXT").HasColumnName("Instruments");

                b.Property<string>("Language").IsRequired().HasColumnType("TEXT");

                b.Property<string>("Mood").IsRequired().HasColumnType("TEXT");

                b.Property<string>("Name").HasColumnType("TEXT");

                b.Property<string>("Nation").IsRequired().HasColumnType("TEXT");

                b.Property<string>("Participants").IsRequired().HasColumnType("TEXT");

                b.Property<string>("Source").HasColumnType("TEXT");

                b.Property<string>("Src").HasColumnType("TEXT");

                b.HasKey("Id");

                b.ToTable("Music");
            });

        modelBuilder.Entity(
            "ObscuritasMediaManager.Backend.Models.StreamingEntryModel",
            b =>
            {
                b.Property<Guid>("Id").HasColumnType("TEXT");

                b.Property<string>("Season").HasColumnType("TEXT");

                b.Property<int>("Episode").HasColumnType("INTEGER");

                b.Property<string>("Src").HasColumnType("TEXT");

                b.HasKey("Id", "Season", "Episode");

                b.ToTable("StreamingEntries");
            });
#pragma warning restore 612, 618
    }
}
