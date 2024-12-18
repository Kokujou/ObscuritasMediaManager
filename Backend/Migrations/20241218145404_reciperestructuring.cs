using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ObscuritasMediaManager.Backend.Migrations
{
    /// <inheritdoc />
    public partial class reciperestructuring : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Ingredients_Recipes_RecipeId",
                table: "Ingredients");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Cookware",
                table: "Cookware");

            migrationBuilder.DropIndex(
                name: "IX_Cookware_RecipeId",
                table: "Cookware");

            migrationBuilder.DropColumn(
                name: "MainIngredient",
                table: "Recipes");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "Cookware");

            migrationBuilder.AddColumn<string>(
                name: "Category",
                table: "Ingredients",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Cookware",
                table: "Cookware",
                column: "RecipeId");

            migrationBuilder.CreateTable(
                name: "RecipeIngredientMapping",
                columns: table => new
                {
                    IngredientId = table.Column<Guid>(type: "TEXT", nullable: false),
                    RecipeId = table.Column<Guid>(type: "TEXT", nullable: false),
                    IngredientsId = table.Column<Guid>(type: "TEXT", nullable: false),
                    RecipeModelId = table.Column<Guid>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.ForeignKey(
                        name: "FK_RecipeIngredientMapping_Ingredients_IngredientId",
                        column: x => x.IngredientId,
                        principalTable: "Ingredients",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_RecipeIngredientMapping_Ingredients_IngredientsId",
                        column: x => x.IngredientsId,
                        principalTable: "Ingredients",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_RecipeIngredientMapping_Recipes_RecipeModelId",
                        column: x => x.RecipeModelId,
                        principalTable: "Recipes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_RecipeIngredientMapping_IngredientId",
                table: "RecipeIngredientMapping",
                column: "IngredientId");

            migrationBuilder.CreateIndex(
                name: "IX_RecipeIngredientMapping_IngredientsId",
                table: "RecipeIngredientMapping",
                column: "IngredientsId");

            migrationBuilder.CreateIndex(
                name: "IX_RecipeIngredientMapping_RecipeModelId",
                table: "RecipeIngredientMapping",
                column: "RecipeModelId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "RecipeIngredientMapping");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Cookware",
                table: "Cookware");

            migrationBuilder.DropColumn(
                name: "Category",
                table: "Ingredients");

            migrationBuilder.AddColumn<string>(
                name: "MainIngredient",
                table: "Recipes",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<Guid>(
                name: "Id",
                table: "Cookware",
                type: "TEXT",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddPrimaryKey(
                name: "PK_Cookware",
                table: "Cookware",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_Ingredients_RecipeId",
                table: "Ingredients",
                column: "RecipeId");

            migrationBuilder.CreateIndex(
                name: "IX_Cookware_RecipeId",
                table: "Cookware",
                column: "RecipeId");

            migrationBuilder.AddForeignKey(
                name: "FK_Ingredients_Recipes_RecipeId",
                table: "Ingredients",
                column: "RecipeId",
                principalTable: "Recipes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
