using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ObscuritasMediaManager.Backend.Migrations
{
    /// <inheritdoc />
    public partial class MakeImagesKeylessSinceOneToMany : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_FoodImageMapping",
                table: "FoodImageMapping");

            migrationBuilder.AddPrimaryKey(
                name: "PK_FoodImageMapping",
                table: "FoodImageMapping",
                columns: new[] { "RecipeId", "ImageHash" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_FoodImageMapping",
                table: "FoodImageMapping");

            migrationBuilder.AddPrimaryKey(
                name: "PK_FoodImageMapping",
                table: "FoodImageMapping",
                column: "RecipeId");
        }
    }
}
