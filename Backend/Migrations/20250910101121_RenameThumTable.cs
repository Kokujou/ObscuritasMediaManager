using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ObscuritasMediaManager.Backend.Migrations
{
    /// <inheritdoc />
    public partial class RenameThumTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FoodThumbModel_Recipes_RecipeId",
                table: "FoodThumbModel");

            migrationBuilder.DropPrimaryKey(
                name: "PK_FoodThumbModel",
                table: "FoodThumbModel");

            migrationBuilder.RenameTable(
                name: "FoodThumbModel",
                newName: "FoodThumbMapping");

            migrationBuilder.AddPrimaryKey(
                name: "PK_FoodThumbMapping",
                table: "FoodThumbMapping",
                columns: new[] { "RecipeId", "ThumbHash" });

            migrationBuilder.AddForeignKey(
                name: "FK_FoodThumbMapping_Recipes_RecipeId",
                table: "FoodThumbMapping",
                column: "RecipeId",
                principalTable: "Recipes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FoodThumbMapping_Recipes_RecipeId",
                table: "FoodThumbMapping");

            migrationBuilder.DropPrimaryKey(
                name: "PK_FoodThumbMapping",
                table: "FoodThumbMapping");

            migrationBuilder.RenameTable(
                name: "FoodThumbMapping",
                newName: "FoodThumbModel");

            migrationBuilder.AddPrimaryKey(
                name: "PK_FoodThumbModel",
                table: "FoodThumbModel",
                columns: new[] { "RecipeId", "ThumbHash" });

            migrationBuilder.AddForeignKey(
                name: "FK_FoodThumbModel_Recipes_RecipeId",
                table: "FoodThumbModel",
                column: "RecipeId",
                principalTable: "Recipes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
