using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ObscuritasMediaManager.Backend.Migrations
{
    /// <inheritdoc />
    public partial class reciperestructuring3 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_RecipeIngredientMapping_RecipeId",
                table: "RecipeIngredientMapping");

            migrationBuilder.AddPrimaryKey(
                name: "PK_RecipeIngredientMapping",
                table: "RecipeIngredientMapping",
                columns: new[] { "RecipeId", "IngredientId" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_RecipeIngredientMapping",
                table: "RecipeIngredientMapping");

            migrationBuilder.CreateIndex(
                name: "IX_RecipeIngredientMapping_RecipeId",
                table: "RecipeIngredientMapping",
                column: "RecipeId");
        }
    }
}
