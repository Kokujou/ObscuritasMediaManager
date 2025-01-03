using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ObscuritasMediaManager.Backend.Migrations
{
    /// <inheritdoc />
    public partial class AdjustCookwarePrimaryKey : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_Cookware",
                table: "Cookware");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Cookware",
                table: "Cookware",
                columns: new[] { "RecipeId", "Name" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_Cookware",
                table: "Cookware");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Cookware",
                table: "Cookware",
                column: "RecipeId");
        }
    }
}
