using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ObscuritasMediaManager.Backend.Migrations
{
    /// <inheritdoc />
    public partial class IngredientPrice : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "IngredientPriceMapping",
                columns: table => new
                {
                    IngredientName = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    LowestKnownPrice = table.Column<float>(type: "REAL", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_IngredientPriceMapping", x => x.IngredientName);
                });

            migrationBuilder.CreateIndex(
                name: "IX_RecipeIngredientMapping_IngredientName",
                table: "RecipeIngredientMapping",
                column: "IngredientName");

            migrationBuilder.AddForeignKey(
                name: "FK_RecipeIngredientMapping_IngredientPriceMapping_IngredientName",
                table: "RecipeIngredientMapping",
                column: "IngredientName",
                principalTable: "IngredientPriceMapping",
                principalColumn: "IngredientName");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_RecipeIngredientMapping_IngredientPriceMapping_IngredientName",
                table: "RecipeIngredientMapping");

            migrationBuilder.DropTable(
                name: "IngredientPriceMapping");

            migrationBuilder.DropIndex(
                name: "IX_RecipeIngredientMapping_IngredientName",
                table: "RecipeIngredientMapping");
        }
    }
}
