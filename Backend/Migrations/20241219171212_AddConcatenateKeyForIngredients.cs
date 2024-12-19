using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ObscuritasMediaManager.Backend.Migrations
{
    /// <inheritdoc />
    public partial class AddConcatenateKeyForIngredients : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_RecipeIngredientMapping_Recipes_RecipeId",
                table: "RecipeIngredientMapping");

            migrationBuilder.DropPrimaryKey(
                name: "PK_RecipeIngredientMapping",
                table: "RecipeIngredientMapping");

            migrationBuilder.DropIndex(
                name: "IX_RecipeIngredientMapping_RecipeId",
                table: "RecipeIngredientMapping");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "RecipeIngredientMapping");

            migrationBuilder.AlterColumn<string>(
                name: "Unit_ShortName",
                table: "RecipeIngredientMapping",
                type: "TEXT",
                maxLength: 10,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "TEXT",
                oldMaxLength: 10,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Unit_Name",
                table: "RecipeIngredientMapping",
                type: "TEXT",
                maxLength: 255,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "TEXT",
                oldMaxLength: 255,
                oldNullable: true);

            migrationBuilder.AlterColumn<float>(
                name: "Unit_Multiplier",
                table: "RecipeIngredientMapping",
                type: "REAL",
                nullable: false,
                defaultValue: 0f,
                oldClrType: typeof(float),
                oldType: "REAL",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "Unit_Measurement",
                table: "RecipeIngredientMapping",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "INTEGER",
                oldNullable: true);

            migrationBuilder.AlterColumn<Guid>(
                name: "RecipeId",
                table: "RecipeIngredientMapping",
                type: "TEXT",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "TEXT",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "GroupName",
                table: "RecipeIngredientMapping",
                type: "TEXT",
                maxLength: 255,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "TEXT",
                oldMaxLength: 255,
                oldNullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_RecipeIngredientMapping",
                table: "RecipeIngredientMapping",
                columns: new[] { "RecipeId", "IngredientName", "GroupName", "Order" });

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

            migrationBuilder.DropPrimaryKey(
                name: "PK_RecipeIngredientMapping",
                table: "RecipeIngredientMapping");

            migrationBuilder.AlterColumn<string>(
                name: "Unit_ShortName",
                table: "RecipeIngredientMapping",
                type: "TEXT",
                maxLength: 10,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "TEXT",
                oldMaxLength: 10);

            migrationBuilder.AlterColumn<string>(
                name: "Unit_Name",
                table: "RecipeIngredientMapping",
                type: "TEXT",
                maxLength: 255,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "TEXT",
                oldMaxLength: 255);

            migrationBuilder.AlterColumn<float>(
                name: "Unit_Multiplier",
                table: "RecipeIngredientMapping",
                type: "REAL",
                nullable: true,
                oldClrType: typeof(float),
                oldType: "REAL");

            migrationBuilder.AlterColumn<int>(
                name: "Unit_Measurement",
                table: "RecipeIngredientMapping",
                type: "INTEGER",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "INTEGER");

            migrationBuilder.AlterColumn<string>(
                name: "GroupName",
                table: "RecipeIngredientMapping",
                type: "TEXT",
                maxLength: 255,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "TEXT",
                oldMaxLength: 255);

            migrationBuilder.AlterColumn<Guid>(
                name: "RecipeId",
                table: "RecipeIngredientMapping",
                type: "TEXT",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "TEXT");

            migrationBuilder.AddColumn<Guid>(
                name: "Id",
                table: "RecipeIngredientMapping",
                type: "TEXT",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddPrimaryKey(
                name: "PK_RecipeIngredientMapping",
                table: "RecipeIngredientMapping",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_RecipeIngredientMapping_RecipeId",
                table: "RecipeIngredientMapping",
                column: "RecipeId");

            migrationBuilder.AddForeignKey(
                name: "FK_RecipeIngredientMapping_Recipes_RecipeId",
                table: "RecipeIngredientMapping",
                column: "RecipeId",
                principalTable: "Recipes",
                principalColumn: "Id");
        }
    }
}
