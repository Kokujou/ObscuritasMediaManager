using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ObscuritasMediaManager.Backend.Migrations
{
    /// <inheritdoc />
    public partial class reciperestructuring2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_RecipeIngredientMapping_Ingredients_IngredientsId",
                table: "RecipeIngredientMapping");

            migrationBuilder.DropForeignKey(
                name: "FK_RecipeIngredientMapping_Recipes_RecipeModelId",
                table: "RecipeIngredientMapping");

            migrationBuilder.DropIndex(
                name: "IX_RecipeIngredientMapping_IngredientsId",
                table: "RecipeIngredientMapping");

            migrationBuilder.DropIndex(
                name: "IX_RecipeIngredientMapping_RecipeModelId",
                table: "RecipeIngredientMapping");

            migrationBuilder.DropColumn(
                name: "IngredientsId",
                table: "RecipeIngredientMapping");

            migrationBuilder.DropColumn(
                name: "RecipeModelId",
                table: "RecipeIngredientMapping");

            migrationBuilder.CreateIndex(
                name: "IX_RecipeIngredientMapping_RecipeId",
                table: "RecipeIngredientMapping",
                column: "RecipeId");

            migrationBuilder.AddForeignKey(
                name: "FK_RecipeIngredientMapping_Recipes_RecipeId",
                table: "RecipeIngredientMapping",
                column: "RecipeId",
                principalTable: "Recipes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_RecipeIngredientMapping_Recipes_RecipeId",
                table: "RecipeIngredientMapping");

            migrationBuilder.DropIndex(
                name: "IX_RecipeIngredientMapping_RecipeId",
                table: "RecipeIngredientMapping");

            migrationBuilder.AddColumn<Guid>(
                name: "IngredientsId",
                table: "RecipeIngredientMapping",
                type: "TEXT",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<Guid>(
                name: "RecipeModelId",
                table: "RecipeIngredientMapping",
                type: "TEXT",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_RecipeIngredientMapping_IngredientsId",
                table: "RecipeIngredientMapping",
                column: "IngredientsId");

            migrationBuilder.CreateIndex(
                name: "IX_RecipeIngredientMapping_RecipeModelId",
                table: "RecipeIngredientMapping",
                column: "RecipeModelId");

            migrationBuilder.AddForeignKey(
                name: "FK_RecipeIngredientMapping_Ingredients_IngredientsId",
                table: "RecipeIngredientMapping",
                column: "IngredientsId",
                principalTable: "Ingredients",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_RecipeIngredientMapping_Recipes_RecipeModelId",
                table: "RecipeIngredientMapping",
                column: "RecipeModelId",
                principalTable: "Recipes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
