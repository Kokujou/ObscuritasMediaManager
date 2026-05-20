using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ObscuritasMediaManager.Backend.Migrations
{
    /// <inheritdoc />
    public partial class RecipeText2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(name: "RecipeText", table: "Recipes");

            migrationBuilder.RenameColumn(
                name: "FormattedText",
                table: "Recipes",
                newName: "RecipeText");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "FormattedText",
                table: "Recipes",
                type: "TEXT",
                nullable: true);
        }
    }
}
