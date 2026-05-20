using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ObscuritasMediaManager.Backend.Migrations
{
    /// <inheritdoc />
    public partial class RecipeText : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "RecipeText",
                table: "Recipes",
                type: "TEXT",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RecipeText",
                table: "Recipes");
        }
    }
}
