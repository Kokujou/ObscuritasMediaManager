using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ObscuritasMediaManager.Backend.Migrations
{
    /// <inheritdoc />
    public partial class initial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "FoodThumbMapping",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    RecipeId = table.Column<Guid>(type: "TEXT", nullable: false, collation: "NOCASE"),
                    ImagePath = table.Column<string>(type: "TEXT", maxLength: 255, nullable: true),
                    ThumbData = table.Column<byte[]>(type: "BLOB", nullable: true),
                    ThumbHash = table.Column<string>(type: "TEXT", maxLength: 32, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FoodThumbMapping", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Ingredients",
                columns: table => new
                {
                    IngredientName = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    LowestKnownPrice = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    Nation = table.Column<string>(type: "TEXT", nullable: false),
                    Category = table.Column<string>(type: "TEXT", nullable: false),
                    IsFluid = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Ingredients", x => x.IngredientName);
                });

            migrationBuilder.CreateTable(
                name: "Instruments",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    Type = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Instruments", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Media",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false, collation: "NOCASE"),
                    ContentWarnings = table.Column<string>(type: "TEXT", nullable: false),
                    Description = table.Column<string>(type: "TEXT", maxLength: 9999, nullable: true),
                    Name = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    RomajiName = table.Column<string>(type: "TEXT", maxLength: 255, nullable: true),
                    KanjiName = table.Column<string>(type: "TEXT", maxLength: 255, nullable: true),
                    GermanName = table.Column<string>(type: "TEXT", maxLength: 255, nullable: true),
                    EnglishName = table.Column<string>(type: "TEXT", maxLength: 255, nullable: true),
                    Language = table.Column<string>(type: "TEXT", nullable: false),
                    Rating = table.Column<int>(type: "INTEGER", nullable: false),
                    Release = table.Column<int>(type: "INTEGER", nullable: false),
                    Status = table.Column<string>(type: "TEXT", nullable: false),
                    TargetGroup = table.Column<string>(type: "TEXT", nullable: false),
                    Type = table.Column<string>(type: "TEXT", nullable: false),
                    RootFolderPath = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    Deleted = table.Column<bool>(type: "INTEGER", nullable: false),
                    Complete = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Media", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "MediaGenres",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false, collation: "NOCASE"),
                    Section = table.Column<string>(type: "TEXT", nullable: false),
                    Name = table.Column<string>(type: "TEXT", maxLength: 250, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MediaGenres", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Music",
                columns: table => new
                {
                    Hash = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    Name = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    Author = table.Column<string>(type: "TEXT", maxLength: 255, nullable: true),
                    Source = table.Column<string>(type: "TEXT", maxLength: 255, nullable: true),
                    Mood1 = table.Column<string>(type: "TEXT", nullable: false),
                    Mood2 = table.Column<string>(type: "TEXT", nullable: false),
                    Language = table.Column<string>(type: "TEXT", nullable: false),
                    Instrumentation = table.Column<string>(type: "TEXT", nullable: false),
                    Participants = table.Column<string>(type: "TEXT", nullable: false),
                    Genres = table.Column<string>(type: "TEXT", nullable: false),
                    Path = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    Lyrics = table.Column<string>(type: "TEXT", maxLength: 9000, nullable: true),
                    Rating = table.Column<byte>(type: "INTEGER", nullable: false),
                    Complete = table.Column<bool>(type: "INTEGER", nullable: false),
                    FileBytes = table.Column<long>(type: "INTEGER", nullable: false),
                    Deleted = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Music", x => x.Hash);
                });

            migrationBuilder.CreateTable(
                name: "Playlists",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false, collation: "NOCASE"),
                    Name = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    Author = table.Column<string>(type: "TEXT", maxLength: 255, nullable: true),
                    Image = table.Column<string>(type: "TEXT", maxLength: 255, nullable: true),
                    Rating = table.Column<byte>(type: "INTEGER", nullable: false),
                    Language = table.Column<string>(type: "TEXT", nullable: false),
                    Genres = table.Column<string>(type: "TEXT", nullable: false),
                    Complete = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Playlists", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Recipes",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false, collation: "NOCASE"),
                    Title = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    Description = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    Difficulty = table.Column<int>(type: "INTEGER", nullable: false),
                    Rating = table.Column<int>(type: "INTEGER", nullable: false),
                    Deleted = table.Column<bool>(type: "INTEGER", nullable: false),
                    FavoriteImageHash = table.Column<string>(type: "TEXT", maxLength: 32, nullable: true),
                    Type = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    RecipeText = table.Column<string>(type: "TEXT", nullable: true),
                    PreparationTime = table.Column<TimeSpan>(type: "TEXT", nullable: true),
                    CookingTime = table.Column<TimeSpan>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Recipes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false, collation: "NOCASE"),
                    Password = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    Name = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "UserSettings",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false, collation: "NOCASE"),
                    Volume = table.Column<int>(type: "INTEGER", nullable: false),
                    MusicFilter = table.Column<string>(type: "TEXT", maxLength: 9999, nullable: true),
                    MediaFilter = table.Column<string>(type: "TEXT", maxLength: 9999, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserSettings", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Inventory",
                columns: table => new
                {
                    ItemId = table.Column<Guid>(type: "TEXT", nullable: false, collation: "NOCASE"),
                    Target = table.Column<string>(type: "TEXT", nullable: false),
                    IngredientName = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    Quantity = table.Column<float>(type: "REAL", nullable: false),
                    Unit_Name = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    Unit_ShortName = table.Column<string>(type: "TEXT", maxLength: 10, nullable: false),
                    Unit_Multiplier = table.Column<float>(type: "REAL", nullable: false),
                    Unit_Measurement = table.Column<int>(type: "INTEGER", nullable: false),
                    Level = table.Column<int>(type: "INTEGER", nullable: true),
                    IsSide = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Inventory", x => x.ItemId);
                    table.ForeignKey(
                        name: "FK_Inventory_Ingredients_IngredientName",
                        column: x => x.IngredientName,
                        principalTable: "Ingredients",
                        principalColumn: "IngredientName",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "MediaGenreMapping",
                columns: table => new
                {
                    GenreId = table.Column<Guid>(type: "TEXT", nullable: false, collation: "NOCASE"),
                    MediaId = table.Column<Guid>(type: "TEXT", nullable: false, collation: "NOCASE")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MediaGenreMapping", x => new { x.GenreId, x.MediaId });
                    table.ForeignKey(
                        name: "FK_MediaGenreMapping_MediaGenres_GenreId",
                        column: x => x.GenreId,
                        principalTable: "MediaGenres",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MediaGenreMapping_Media_MediaId",
                        column: x => x.MediaId,
                        principalTable: "Media",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "MusicInstrumentMapping",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    TrackHash = table.Column<string>(type: "TEXT", maxLength: 250, nullable: false),
                    InstrumentId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MusicInstrumentMapping", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MusicInstrumentMapping_Instruments_InstrumentId",
                        column: x => x.InstrumentId,
                        principalTable: "Instruments",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MusicInstrumentMapping_Music_TrackHash",
                        column: x => x.TrackHash,
                        principalTable: "Music",
                        principalColumn: "Hash",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PlaylistTrackMapping",
                columns: table => new
                {
                    PlaylistId = table.Column<Guid>(type: "TEXT", nullable: false, collation: "NOCASE"),
                    TrackHash = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    PlaylistName = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    TrackName = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    Order = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PlaylistTrackMapping", x => new { x.PlaylistId, x.TrackHash });
                    table.ForeignKey(
                        name: "FK_PlaylistTrackMapping_Music_TrackHash",
                        column: x => x.TrackHash,
                        principalTable: "Music",
                        principalColumn: "Hash",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PlaylistTrackMapping_Playlists_PlaylistId",
                        column: x => x.PlaylistId,
                        principalTable: "Playlists",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Cookware",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false, collation: "NOCASE"),
                    RecipeId = table.Column<Guid>(type: "TEXT", nullable: false, collation: "NOCASE"),
                    Name = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Cookware", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Cookware_Recipes_RecipeId",
                        column: x => x.RecipeId,
                        principalTable: "Recipes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "FoodTagMapping",
                columns: table => new
                {
                    RecipeId = table.Column<Guid>(type: "TEXT", nullable: false, collation: "NOCASE"),
                    Key = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    Value = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FoodTagMapping", x => new { x.RecipeId, x.Key, x.Value });
                    table.ForeignKey(
                        name: "FK_FoodTagMapping_Recipes_RecipeId",
                        column: x => x.RecipeId,
                        principalTable: "Recipes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "RecipeIngredientMapping",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false, collation: "NOCASE"),
                    RecipeId = table.Column<Guid>(type: "TEXT", nullable: true, collation: "NOCASE"),
                    IngredientName = table.Column<string>(type: "TEXT", maxLength: 255, nullable: true),
                    Description = table.Column<string>(type: "TEXT", maxLength: 9999, nullable: true),
                    GroupName = table.Column<string>(type: "TEXT", maxLength: 255, nullable: true),
                    Unit_Name = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    Unit_ShortName = table.Column<string>(type: "TEXT", maxLength: 10, nullable: false),
                    Unit_Multiplier = table.Column<float>(type: "REAL", nullable: false),
                    Unit_Measurement = table.Column<int>(type: "INTEGER", nullable: false),
                    Amount = table.Column<float>(type: "REAL", nullable: false),
                    Order = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RecipeIngredientMapping", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RecipeIngredientMapping_Ingredients_IngredientName",
                        column: x => x.IngredientName,
                        principalTable: "Ingredients",
                        principalColumn: "IngredientName");
                    table.ForeignKey(
                        name: "FK_RecipeIngredientMapping_Recipes_RecipeId",
                        column: x => x.RecipeId,
                        principalTable: "Recipes",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Cookware_RecipeId",
                table: "Cookware",
                column: "RecipeId");

            migrationBuilder.CreateIndex(
                name: "IX_Inventory_IngredientName",
                table: "Inventory",
                column: "IngredientName");

            migrationBuilder.CreateIndex(
                name: "IX_MediaGenreMapping_MediaId",
                table: "MediaGenreMapping",
                column: "MediaId");

            migrationBuilder.CreateIndex(
                name: "IX_MusicInstrumentMapping_InstrumentId",
                table: "MusicInstrumentMapping",
                column: "InstrumentId");

            migrationBuilder.CreateIndex(
                name: "IX_MusicInstrumentMapping_TrackHash",
                table: "MusicInstrumentMapping",
                column: "TrackHash");

            migrationBuilder.CreateIndex(
                name: "IX_PlaylistTrackMapping_TrackHash",
                table: "PlaylistTrackMapping",
                column: "TrackHash");

            migrationBuilder.CreateIndex(
                name: "IX_RecipeIngredientMapping_IngredientName",
                table: "RecipeIngredientMapping",
                column: "IngredientName");

            migrationBuilder.CreateIndex(
                name: "IX_RecipeIngredientMapping_RecipeId",
                table: "RecipeIngredientMapping",
                column: "RecipeId");

            migrationBuilder.CreateIndex(
                name: "IX_Recipes_Title",
                table: "Recipes",
                column: "Title",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Cookware");

            migrationBuilder.DropTable(
                name: "FoodTagMapping");

            migrationBuilder.DropTable(
                name: "FoodThumbMapping");

            migrationBuilder.DropTable(
                name: "Inventory");

            migrationBuilder.DropTable(
                name: "MediaGenreMapping");

            migrationBuilder.DropTable(
                name: "MusicInstrumentMapping");

            migrationBuilder.DropTable(
                name: "PlaylistTrackMapping");

            migrationBuilder.DropTable(
                name: "RecipeIngredientMapping");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "UserSettings");

            migrationBuilder.DropTable(
                name: "MediaGenres");

            migrationBuilder.DropTable(
                name: "Media");

            migrationBuilder.DropTable(
                name: "Instruments");

            migrationBuilder.DropTable(
                name: "Music");

            migrationBuilder.DropTable(
                name: "Playlists");

            migrationBuilder.DropTable(
                name: "Ingredients");

            migrationBuilder.DropTable(
                name: "Recipes");
        }
    }
}
