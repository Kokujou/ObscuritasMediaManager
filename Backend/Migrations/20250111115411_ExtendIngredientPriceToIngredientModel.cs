using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ObscuritasMediaManager.Backend.Migrations
{
    /// <inheritdoc />
    public partial class ExtendIngredientPriceToIngredientModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_RecipeIngredientMapping_IngredientPriceMapping_IngredientName",
                table: "RecipeIngredientMapping");

            migrationBuilder.DropTable(
                name: "IngredientPriceMapping");

            migrationBuilder.DropColumn(
                name: "IngredientCategory",
                table: "RecipeIngredientMapping");

            migrationBuilder.CreateTable(
                name: "Ingredients",
                columns: table => new
                {
                    IngredientName = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    Nation = table.Column<string>(type: "TEXT", nullable: false),
                    Category = table.Column<string>(type: "TEXT", nullable: false),
                    LowestKnownPrice = table.Column<float>(type: "REAL", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Ingredients", x => x.IngredientName);
                });

            migrationBuilder.AddForeignKey(
                name: "FK_RecipeIngredientMapping_Ingredients_IngredientName",
                table: "RecipeIngredientMapping",
                column: "IngredientName",
                principalTable: "Ingredients",
                principalColumn: "IngredientName");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_RecipeIngredientMapping_Ingredients_IngredientName",
                table: "RecipeIngredientMapping");

            migrationBuilder.DropTable(
                name: "Ingredients");

            migrationBuilder.AddColumn<string>(
                name: "IngredientCategory",
                table: "RecipeIngredientMapping",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

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

            migrationBuilder.AddForeignKey(
                name: "FK_RecipeIngredientMapping_IngredientPriceMapping_IngredientName",
                table: "RecipeIngredientMapping",
                column: "IngredientName",
                principalTable: "IngredientPriceMapping",
                principalColumn: "IngredientName");
        }
    }
}
