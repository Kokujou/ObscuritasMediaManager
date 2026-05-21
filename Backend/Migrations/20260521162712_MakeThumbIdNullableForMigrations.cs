using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ObscuritasMediaManager.Backend.Migrations
{
    /// <inheritdoc />
    public partial class MakeThumbIdNullableForMigrations : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FoodImageMapping_FoodThumbMapping_ThumbId",
                table: "FoodImageMapping");

            migrationBuilder.AlterColumn<int>(
                name: "ThumbId",
                table: "FoodImageMapping",
                type: "INTEGER",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "INTEGER");

            migrationBuilder.AddForeignKey(
                name: "FK_FoodImageMapping_FoodThumbMapping_ThumbId",
                table: "FoodImageMapping",
                column: "ThumbId",
                principalTable: "FoodThumbMapping",
                principalColumn: "Id");

        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FoodImageMapping_FoodThumbMapping_ThumbId",
                table: "FoodImageMapping");

            migrationBuilder.AlterColumn<int>(
                name: "ThumbId",
                table: "FoodImageMapping",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "INTEGER",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_FoodImageMapping_FoodThumbMapping_ThumbId",
                table: "FoodImageMapping",
                column: "ThumbId",
                principalTable: "FoodThumbMapping",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
