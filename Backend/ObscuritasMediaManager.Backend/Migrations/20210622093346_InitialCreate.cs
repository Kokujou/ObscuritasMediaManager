using Microsoft.EntityFrameworkCore.Migrations;
using System;

namespace ObscuritasMediaManager.Backend.Migrations;

public partial class InitialCreate : Migration
{
    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropTable(name: "Genres");

        migrationBuilder.DropTable(name: "Instruments");

        migrationBuilder.DropTable(name: "Media");

        migrationBuilder.DropTable(name: "Music");

        migrationBuilder.DropTable(name: "StreamingEntries");
    }

    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.CreateTable(name: "Genres", columns: table =>
                                                  new
                                                  {
                                                      Id = table.Column<Guid>(type: "TEXT", nullable: false),
                                                      Section = table.Column<string>(type: "TEXT", nullable: true),
                                                      Name = table.Column<string>(type: "TEXT", nullable: true)
                                                  },
                                     constraints: table => table.PrimaryKey("PK_Genres", x => x.Id));

        migrationBuilder.CreateTable(name: "Instruments", columns: table =>
                                                  new
                                                  {
                                                      Name = table.Column<string>(type: "TEXT", nullable: false),
                                                      Type = table.Column<string>(type: "TEXT", nullable: false)
                                                  },
                                     constraints: table => table.PrimaryKey("PK_Instruments", x => x.Name));

        migrationBuilder.CreateTable(name: "Media", columns: table =>
                                                  new
                                                  {
                                                      Id = table.Column<Guid>(type: "TEXT", nullable: false),
                                                      Name = table.Column<string>(type: "TEXT", nullable: true),
                                                      Type = table.Column<string>(type: "TEXT", nullable: true),
                                                      Rating = table.Column<int>(type: "INTEGER", nullable: false),
                                                      Release = table.Column<int>(type: "INTEGER", nullable: false),
                                                      Genres = table.Column<string>(type: "TEXT", nullable: true),
                                                      State = table.Column<int>(type: "INTEGER", nullable: false),
                                                      Description = table.Column<string>(type: "TEXT", nullable: true),
                                                      Image = table.Column<string>(type: "TEXT", nullable: true)
                                                  },
                                     constraints: table => table.PrimaryKey("PK_Media", x => x.Id));

        migrationBuilder.CreateTable(name: "Music", columns: table =>
                                                  new
                                                  {
                                                      Id = table.Column<Guid>(type: "TEXT", nullable: false),
                                                      Name = table.Column<string>(type: "TEXT", nullable: true),
                                                      Author = table.Column<string>(type: "TEXT", nullable: true),
                                                      Source = table.Column<string>(type: "TEXT", nullable: true),
                                                      Mood = table.Column<string>(type: "TEXT", nullable: false),
                                                      Language = table.Column<string>(type: "TEXT", nullable: false),
                                                      Nation = table.Column<string>(type: "TEXT", nullable: false),
                                                      Instrumentation = table.Column<string>(type: "TEXT", nullable: false),
                                                      Participants = table.Column<string>(type: "TEXT", nullable: false),
                                                      Instruments = table.Column<string>(type: "TEXT", nullable: true),
                                                      Genres = table.Column<string>(type: "TEXT", nullable: true),
                                                      Src = table.Column<string>(type: "TEXT", nullable: true)
                                                  },
                                     constraints: table => table.PrimaryKey("PK_Music", x => x.Id));

        migrationBuilder.CreateTable(name: "StreamingEntries", columns: table =>
                                                  new
                                                  {
                                                      Id = table.Column<Guid>(type: "TEXT", nullable: false),
                                                      Season = table.Column<string>(type: "TEXT", nullable: false),
                                                      Episode = table.Column<int>(type: "INTEGER", nullable: false),
                                                      Src = table.Column<string>(type: "TEXT", nullable: true)
                                                  },
                                     constraints: table =>
                                                      table.PrimaryKey("PK_StreamingEntries",
                                                                       x => new { x.Id, x.Season, x.Episode }));
    }
}
