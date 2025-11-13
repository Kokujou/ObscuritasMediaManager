using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ObscuritasMediaManager.Backend.Migrations
{
    /// <inheritdoc />
    public partial class Inventory : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Inventory",
                columns: table => new
                {
                    ItemId = table.Column<Guid>(type: "TEXT", nullable: false),
                    Target = table.Column<string>(type: "TEXT", nullable: false),
                    IngredientName = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    Quantity = table.Column<int>(type: "INTEGER", nullable: false),
                    Unit_Name = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    Unit_ShortName = table.Column<string>(type: "TEXT", maxLength: 10, nullable: false),
                    Unit_Multiplier = table.Column<float>(type: "REAL", nullable: false),
                    Unit_Measurement = table.Column<int>(type: "INTEGER", nullable: false),
                    Level = table.Column<int>(type: "INTEGER", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Inventory", x => x.ItemId);
                    table.ForeignKey(
                        name: "FK_Inventory_Ingredients_IngredientName",
                        column: x => x.IngredientName,
                        principalTable: "Ingredients",
                        principalColumn: "IngredientName",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Inventory_IngredientName",
                table: "Inventory",
                column: "IngredientName");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Inventory");
        }
    }
}
