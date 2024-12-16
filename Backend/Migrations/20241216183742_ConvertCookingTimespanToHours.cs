using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ObscuritasMediaManager.Backend.Migrations
{
    /// <inheritdoc />
    public partial class ConvertCookingTimespanToHours : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CookingTime",
                table: "Recipes");

            migrationBuilder.DropColumn(
                name: "PreparationTime",
                table: "Recipes");

            migrationBuilder.AddColumn<float>(
                name: "CookingHours",
                table: "Recipes",
                type: "REAL",
                nullable: false,
                defaultValue: 0f);

            migrationBuilder.AddColumn<float>(
                name: "PreparationHours",
                table: "Recipes",
                type: "REAL",
                nullable: false,
                defaultValue: 0f);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CookingHours",
                table: "Recipes");

            migrationBuilder.DropColumn(
                name: "PreparationHours",
                table: "Recipes");

            migrationBuilder.AddColumn<TimeSpan>(
                name: "CookingTime",
                table: "Recipes",
                type: "TEXT",
                nullable: false,
                defaultValue: new TimeSpan(0, 0, 0, 0, 0));

            migrationBuilder.AddColumn<TimeSpan>(
                name: "PreparationTime",
                table: "Recipes",
                type: "TEXT",
                nullable: false,
                defaultValue: new TimeSpan(0, 0, 0, 0, 0));
        }
    }
}
