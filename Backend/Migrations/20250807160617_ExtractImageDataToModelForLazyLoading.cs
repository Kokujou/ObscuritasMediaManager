using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ObscuritasMediaManager.Backend.Migrations
{
    /// <inheritdoc />
    public partial class ExtractImageDataToModelForLazyLoading : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "FoodImageMapping",
                columns: table => new
                {
                    RecipeId = table.Column<Guid>(type: "TEXT", nullable: false),
                    ImageData = table.Column<string>(type: "TEXT", nullable: true),
                    ImageHash = table.Column<string>(type: "TEXT", maxLength: 32, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FoodImageMapping", x => x.RecipeId);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Recipes_ImageRecipeId",
                table: "Recipes",
                column: "ImageRecipeId");

            migrationBuilder.CreateIndex(
                name: "IX_FoodImageMapping_ImageHash",
                table: "FoodImageMapping",
                column: "ImageHash",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Recipes_FoodImageMapping_ImageRecipeId",
                table: "Recipes",
                column: "ImageRecipeId",
                principalTable: "FoodImageMapping",
                principalColumn: "RecipeId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.Sql(@"
        INSERT INTO FoodImageMapping (RecipeId, ImageData, ImageHash)
        SELECT Id, ImageData, ImageHash FROM Recipes;
    ");

            migrationBuilder.DropIndex(
                name: "IX_Recipes_ImageHash",
                table: "Recipes");

            migrationBuilder.DropColumn(
                name: "ImageData",
                table: "Recipes");

            migrationBuilder.DropColumn(
                name: "ImageHash",
                table: "Recipes");

            migrationBuilder.AddColumn<Guid>(
                name: "ImageRecipeId",
                table: "Recipes",
                type: "TEXT",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Recipes_FoodImageMapping_ImageRecipeId",
                table: "Recipes");

            migrationBuilder.DropTable(
                name: "FoodImageMapping");

            migrationBuilder.DropIndex(
                name: "IX_Recipes_ImageRecipeId",
                table: "Recipes");

            migrationBuilder.DropColumn(
                name: "ImageRecipeId",
                table: "Recipes");

            migrationBuilder.AddColumn<byte[]>(
                name: "ImageData",
                table: "Recipes",
                type: "BLOB",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ImageHash",
                table: "Recipes",
                type: "TEXT",
                maxLength: 32,
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_Recipes_ImageHash",
                table: "Recipes",
                column: "ImageHash",
                unique: true);
        }
    }
}
