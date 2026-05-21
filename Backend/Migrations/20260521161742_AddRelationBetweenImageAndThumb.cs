using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ObscuritasMediaManager.Backend.Migrations
{
    /// <inheritdoc />
    public partial class AddRelationBetweenImageAndThumb : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_FoodImageMapping_ImageHash",
                table: "FoodImageMapping");

            migrationBuilder.DropColumn(
                name: "FavoriteThumbHash",
                table: "Recipes");

            migrationBuilder.DropColumn(
                name: "RecipeId",
                table: "FoodThumbMapping");

            migrationBuilder.AddColumn<int>(
                name: "ThumbId",
                table: "FoodImageMapping",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_FoodImageMapping_ImageHash_RecipeId",
                table: "FoodImageMapping",
                columns: new[] { "ImageHash", "RecipeId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_FoodImageMapping_ThumbId",
                table: "FoodImageMapping",
                column: "ThumbId");

            migrationBuilder.AddForeignKey(
                name: "FK_FoodImageMapping_FoodThumbMapping_ThumbId",
                table: "FoodImageMapping",
                column: "ThumbId",
                principalTable: "FoodThumbMapping",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FoodImageMapping_FoodThumbMapping_ThumbId",
                table: "FoodImageMapping");

            migrationBuilder.DropIndex(
                name: "IX_FoodImageMapping_ImageHash_RecipeId",
                table: "FoodImageMapping");

            migrationBuilder.DropIndex(
                name: "IX_FoodImageMapping_ThumbId",
                table: "FoodImageMapping");

            migrationBuilder.DropColumn(
                name: "ThumbId",
                table: "FoodImageMapping");

            migrationBuilder.AddColumn<string>(
                name: "FavoriteThumbHash",
                table: "Recipes",
                type: "TEXT",
                maxLength: 32,
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "RecipeId",
                table: "FoodThumbMapping",
                type: "TEXT",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_FoodImageMapping_ImageHash",
                table: "FoodImageMapping",
                column: "ImageHash",
                unique: true);
        }
    }
}
