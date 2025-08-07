using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ObscuritasMediaManager.Backend.Migrations
{
    /// <inheritdoc />
    public partial class NewImageTableIndexFix : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Recipes_FoodImageMapping_ImageRecipeId",
                table: "Recipes");

            migrationBuilder.DropIndex(
                name: "IX_Recipes_ImageRecipeId",
                table: "Recipes");

            migrationBuilder.DropColumn(
                name: "ImageRecipeId",
                table: "Recipes");

            migrationBuilder.AddForeignKey(
                name: "FK_Recipes_FoodImageMapping_Id",
                table: "Recipes",
                column: "Id",
                principalTable: "FoodImageMapping",
                principalColumn: "RecipeId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Recipes_FoodImageMapping_Id",
                table: "Recipes");

            migrationBuilder.AddColumn<Guid>(
                name: "ImageRecipeId",
                table: "Recipes",
                type: "TEXT",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_Recipes_ImageRecipeId",
                table: "Recipes",
                column: "ImageRecipeId");

            migrationBuilder.AddForeignKey(
                name: "FK_Recipes_FoodImageMapping_ImageRecipeId",
                table: "Recipes",
                column: "ImageRecipeId",
                principalTable: "FoodImageMapping",
                principalColumn: "RecipeId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
