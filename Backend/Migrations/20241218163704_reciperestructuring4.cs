using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ObscuritasMediaManager.Backend.Migrations
{
    /// <inheritdoc />
    public partial class reciperestructuring4 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Cookware_Recipes_RecipeId",
                table: "Cookware");

            migrationBuilder.DropForeignKey(
                name: "FK_RecipeIngredientMapping_Ingredients_IngredientId",
                table: "RecipeIngredientMapping");

            migrationBuilder.DropTable(
                name: "Ingredients");

            migrationBuilder.DropPrimaryKey(
                name: "PK_RecipeIngredientMapping",
                table: "RecipeIngredientMapping");

            migrationBuilder.DropIndex(
                name: "IX_RecipeIngredientMapping_IngredientId",
                table: "RecipeIngredientMapping");

            migrationBuilder.RenameColumn(
                name: "IngredientId",
                table: "RecipeIngredientMapping",
                newName: "IngredientCategory");

            migrationBuilder.AddColumn<Guid>(
                name: "Id",
                table: "RecipeIngredientMapping",
                type: "TEXT",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<float>(
                name: "Amount",
                table: "RecipeIngredientMapping",
                type: "REAL",
                nullable: false,
                defaultValue: 0f);

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "RecipeIngredientMapping",
                type: "TEXT",
                maxLength: 9999,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "GroupName",
                table: "RecipeIngredientMapping",
                type: "TEXT",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "IngredientName",
                table: "RecipeIngredientMapping",
                type: "TEXT",
                maxLength: 255,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "Order",
                table: "RecipeIngredientMapping",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<Guid>(
                name: "RecipeModelId",
                table: "Cookware",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_RecipeIngredientMapping",
                table: "RecipeIngredientMapping",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_RecipeIngredientMapping_RecipeId",
                table: "RecipeIngredientMapping",
                column: "RecipeId");

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
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Cookware_Recipes_RecipeModelId",
                table: "Cookware");

            migrationBuilder.DropPrimaryKey(
                name: "PK_RecipeIngredientMapping",
                table: "RecipeIngredientMapping");

            migrationBuilder.DropIndex(
                name: "IX_RecipeIngredientMapping_RecipeId",
                table: "RecipeIngredientMapping");

            migrationBuilder.DropIndex(
                name: "IX_Cookware_RecipeModelId",
                table: "Cookware");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "RecipeIngredientMapping");

            migrationBuilder.DropColumn(
                name: "Amount",
                table: "RecipeIngredientMapping");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "RecipeIngredientMapping");

            migrationBuilder.DropColumn(
                name: "GroupName",
                table: "RecipeIngredientMapping");

            migrationBuilder.DropColumn(
                name: "IngredientName",
                table: "RecipeIngredientMapping");

            migrationBuilder.DropColumn(
                name: "Order",
                table: "RecipeIngredientMapping");

            migrationBuilder.DropColumn(
                name: "RecipeModelId",
                table: "Cookware");

            migrationBuilder.RenameColumn(
                name: "IngredientCategory",
                table: "RecipeIngredientMapping",
                newName: "IngredientId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_RecipeIngredientMapping",
                table: "RecipeIngredientMapping",
                columns: new[] { "RecipeId", "IngredientId" });

            migrationBuilder.CreateTable(
                name: "Ingredients",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    Amount = table.Column<double>(type: "REAL", nullable: false),
                    Category = table.Column<string>(type: "TEXT", nullable: true),
                    Description = table.Column<string>(type: "TEXT", maxLength: 9999, nullable: true),
                    GroupName = table.Column<string>(type: "TEXT", maxLength: 255, nullable: true),
                    Measurement = table.Column<string>(type: "TEXT", nullable: false),
                    Name = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    Order = table.Column<int>(type: "INTEGER", nullable: false),
                    RecipeId = table.Column<Guid>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Ingredients", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_RecipeIngredientMapping_IngredientId",
                table: "RecipeIngredientMapping",
                column: "IngredientId");

            migrationBuilder.AddForeignKey(
                name: "FK_Cookware_Recipes_RecipeId",
                table: "Cookware",
                column: "RecipeId",
                principalTable: "Recipes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_RecipeIngredientMapping_Ingredients_IngredientId",
                table: "RecipeIngredientMapping",
                column: "IngredientId",
                principalTable: "Ingredients",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
