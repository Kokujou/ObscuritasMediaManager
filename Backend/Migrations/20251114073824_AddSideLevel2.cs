using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ObscuritasMediaManager.Backend.Migrations
{
    /// <inheritdoc />
    public partial class AddSideLevel2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SideLevel",
                table: "Inventory");

            migrationBuilder.AddColumn<bool>(
                name: "IsSide",
                table: "Inventory",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsSide",
                table: "Inventory");

            migrationBuilder.AddColumn<int>(
                name: "SideLevel",
                table: "Inventory",
                type: "INTEGER",
                nullable: true);
        }
    }
}
