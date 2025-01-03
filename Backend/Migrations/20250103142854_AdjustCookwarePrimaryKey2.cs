using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ObscuritasMediaManager.Backend.Migrations
{
    /// <inheritdoc />
    public partial class AdjustCookwarePrimaryKey2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_Cookware",
                table: "Cookware");

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
                name: "IX_Cookware_RecipeId",
                table: "Cookware",
                column: "RecipeId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_Cookware",
                table: "Cookware");

            migrationBuilder.DropIndex(
                name: "IX_Cookware_RecipeId",
                table: "Cookware");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "Cookware");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Cookware",
                table: "Cookware",
                columns: new[] { "RecipeId", "Name" });
        }
    }
}
