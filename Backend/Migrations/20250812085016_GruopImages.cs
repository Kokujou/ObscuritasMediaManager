using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ObscuritasMediaManager.Backend.Migrations
{
    /// <inheritdoc />
    public partial class GruopImages : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Recipes_FoodImageMapping_Id",
                table: "Recipes");

            migrationBuilder.AddForeignKey(
                name: "FK_FoodImageMapping_Recipes_RecipeId",
                table: "FoodImageMapping",
                column: "RecipeId",
                principalTable: "Recipes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FoodImageMapping_Recipes_RecipeId",
                table: "FoodImageMapping");

            migrationBuilder.AddForeignKey(
                name: "FK_Recipes_FoodImageMapping_Id",
                table: "Recipes",
                column: "Id",
                principalTable: "FoodImageMapping",
                principalColumn: "RecipeId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
