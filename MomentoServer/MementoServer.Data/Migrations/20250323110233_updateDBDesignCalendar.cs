using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MementoServer.Data.Migrations
{
    /// <inheritdoc />
    public partial class updateDBDesignCalendar : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "numOfCalendarToUser",
                table: "Calendars",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "numOfCalendarToUser",
                table: "Calendars");
        }
    }
}
