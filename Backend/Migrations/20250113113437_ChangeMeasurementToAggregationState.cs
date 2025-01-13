using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ObscuritasMediaManager.Backend.Migrations
{
    /// <inheritdoc />
    public partial class ChangeMeasurementToAggregationState : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Measurement",
                table: "Ingredients");

            migrationBuilder.AddColumn<bool>(
                name: "IsFluid",
                table: "Ingredients",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsFluid",
                table: "Ingredients");

            migrationBuilder.AddColumn<string>(
                name: "Measurement",
                table: "Ingredients",
                type: "TEXT",
                nullable: false,
                defaultValue: "");
        }
    }
}
