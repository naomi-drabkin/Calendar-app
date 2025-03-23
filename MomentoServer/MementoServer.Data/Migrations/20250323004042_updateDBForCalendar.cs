using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MementoServer.Data.Migrations
{
    /// <inheritdoc />
    public partial class updateDBForCalendar : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CountCalendar",
                table: "Users",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "NumOfCalendar",
                table: "Images",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CountCalendar",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "NumOfCalendar",
                table: "Images");
        }
    }
}
