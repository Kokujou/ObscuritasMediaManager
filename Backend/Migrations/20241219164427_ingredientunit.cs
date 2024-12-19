using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ObscuritasMediaManager.Backend.Migrations
{
    /// <inheritdoc />
    public partial class ingredientunit : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Cookware_Recipes_RecipeModelId",
                table: "Cookware");

            migrationBuilder.DropForeignKey(
                name: "FK_RecipeIngredientMapping_Recipes_RecipeId",
                table: "RecipeIngredientMapping");

            migrationBuilder.DropIndex(
                name: "IX_Cookware_RecipeModelId",
                table: "Cookware");

            migrationBuilder.DropColumn(
                name: "RecipeModelId",
                table: "Cookware");

            migrationBuilder.AlterColumn<Guid>(
                name: "RecipeId",
                table: "RecipeIngredientMapping",
                type: "TEXT",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "TEXT");

            migrationBuilder.AddColumn<int>(
                name: "Unit_Measurement",
                table: "RecipeIngredientMapping",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.AddColumn<float>(
                name: "Unit_Multiplier",
                table: "RecipeIngredientMapping",
                type: "REAL",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Unit_Name",
                table: "RecipeIngredientMapping",
                type: "TEXT",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Unit_ShortName",
                table: "RecipeIngredientMapping",
                type: "TEXT",
                maxLength: 10,
                nullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Cookware_Recipes_RecipeId",
                table: "Cookware",
                column: "RecipeId",
                principalTable: "Recipes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_RecipeIngredientMapping_Recipes_RecipeId",
                table: "RecipeIngredientMapping",
                column: "RecipeId",
                principalTable: "Recipes",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Cookware_Recipes_RecipeId",
                table: "Cookware");

            migrationBuilder.DropForeignKey(
                name: "FK_RecipeIngredientMapping_Recipes_RecipeId",
                table: "RecipeIngredientMapping");

            migrationBuilder.DropColumn(
                name: "Unit_Measurement",
                table: "RecipeIngredientMapping");

            migrationBuilder.DropColumn(
                name: "Unit_Multiplier",
                table: "RecipeIngredientMapping");

            migrationBuilder.DropColumn(
                name: "Unit_Name",
                table: "RecipeIngredientMapping");

            migrationBuilder.DropColumn(
                name: "Unit_ShortName",
                table: "RecipeIngredientMapping");

            migrationBuilder.AlterColumn<Guid>(
                name: "RecipeId",
                table: "RecipeIngredientMapping",
                type: "TEXT",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "TEXT",
                oldNullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "RecipeModelId",
                table: "Cookware",
                type: "TEXT",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Cookware_RecipeModelId",
                table: "Cookware",
                column: "RecipeModelId");

            migrationBuilder.AddForeignKey(
                name: "FK_Cookware_Recipes_RecipeModelId",
                table: "Cookware",
                column: "RecipeModelId",
                principalTable: "Recipes",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_RecipeIngredientMapping_Recipes_RecipeId",
                table: "RecipeIngredientMapping",
                column: "RecipeId",
                principalTable: "Recipes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
