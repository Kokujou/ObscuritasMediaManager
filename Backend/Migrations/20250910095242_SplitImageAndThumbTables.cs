using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ObscuritasMediaManager.Backend.Migrations
{
    /// <inheritdoc />
    public partial class SplitImageAndThumbTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
          

            migrationBuilder.CreateTable(
                name: "FoodThumbModel",
                columns: table => new
                {
                    RecipeId = table.Column<Guid>(type: "TEXT", nullable: false),
                    ThumbHash = table.Column<string>(type: "TEXT", maxLength: 32, nullable: false),
                    ThumbData = table.Column<byte[]>(type: "BLOB", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FoodThumbModel", x => new { x.RecipeId, x.ThumbHash });
                    table.ForeignKey(
                        name: "FK_FoodThumbModel_Recipes_RecipeId",
                        column: x => x.RecipeId,
                        principalTable: "Recipes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.Sql(@"
        INSERT INTO FoodThumbModel (RecipeId, ThumbData, ThumbHash)
        SELECT RecipeId, ThumbData,  lower(hex(randomblob(16))) as ThumbHash
        FROM FoodImageMapping
        WHERE ThumbData IS NOT NULL
    ");



            migrationBuilder.DropColumn(
                name: "ThumbData",
                table: "FoodImageMapping");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "FoodThumbModel");

            migrationBuilder.AddColumn<byte[]>(
                name: "ThumbData",
                table: "FoodImageMapping",
                type: "BLOB",
                nullable: true);
        }
    }
}
