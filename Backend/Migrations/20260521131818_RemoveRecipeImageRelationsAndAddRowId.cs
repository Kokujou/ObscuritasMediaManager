using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ObscuritasMediaManager.Backend.Migrations
{
    /// <inheritdoc />
    public partial class RemoveRecipeImageRelationsAndAddRowId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FoodImageMapping_Recipes_RecipeId",
                table: "FoodImageMapping");

            migrationBuilder.DropForeignKey(
                name: "FK_FoodThumbMapping_Recipes_RecipeId",
                table: "FoodThumbMapping");

            migrationBuilder.DropPrimaryKey(
                name: "PK_FoodThumbMapping",
                table: "FoodThumbMapping");

            migrationBuilder.DropPrimaryKey(
                name: "PK_FoodImageMapping",
                table: "FoodImageMapping");

            migrationBuilder.AddColumn<string>(
                name: "FavoriteImageHash",
                table: "Recipes",
                type: "TEXT",
                maxLength: 32,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Id",
                table: "FoodThumbMapping",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0)
                .Annotation("Sqlite:Autoincrement", true);

            migrationBuilder.AddColumn<int>(
                name: "Id",
                table: "FoodImageMapping",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0)
                .Annotation("Sqlite:Autoincrement", true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_FoodThumbMapping",
                table: "FoodThumbMapping",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_FoodImageMapping",
                table: "FoodImageMapping",
                column: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_FoodThumbMapping",
                table: "FoodThumbMapping");

            migrationBuilder.DropPrimaryKey(
                name: "PK_FoodImageMapping",
                table: "FoodImageMapping");

            migrationBuilder.DropColumn(
                name: "FavoriteImageHash",
                table: "Recipes");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "FoodThumbMapping");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "FoodImageMapping");

            migrationBuilder.AddPrimaryKey(
                name: "PK_FoodThumbMapping",
                table: "FoodThumbMapping",
                columns: new[] { "RecipeId", "ThumbHash" });

            migrationBuilder.AddPrimaryKey(
                name: "PK_FoodImageMapping",
                table: "FoodImageMapping",
                columns: new[] { "RecipeId", "ImageHash" });

            migrationBuilder.AddForeignKey(
                name: "FK_FoodImageMapping_Recipes_RecipeId",
                table: "FoodImageMapping",
                column: "RecipeId",
                principalTable: "Recipes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_FoodThumbMapping_Recipes_RecipeId",
                table: "FoodThumbMapping",
                column: "RecipeId",
                principalTable: "Recipes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
