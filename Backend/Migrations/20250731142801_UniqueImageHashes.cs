using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ObscuritasMediaManager.Backend.Migrations
{
    /// <inheritdoc />
    public partial class UniqueImageHashes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ImageHash",
                table: "Recipes",
                type: "TEXT",
                maxLength: 32,
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_Recipes_ImageHash",
                table: "Recipes",
                column: "ImageHash",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Recipes_ImageHash",
                table: "Recipes");

            migrationBuilder.DropColumn(
                name: "ImageHash",
                table: "Recipes");
        }
    }
}
