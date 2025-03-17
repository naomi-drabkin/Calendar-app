using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MementoServer.Data.Migrations
{
    /// <inheritdoc />
    public partial class UpdateDB : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FileName",
                table: "Images");

            migrationBuilder.RenameColumn(
                name: "PdfUrl",
                table: "Templates",
                newName: "Url");

            migrationBuilder.RenameColumn(
                name: "FilePath",
                table: "Images",
                newName: "Url");

            migrationBuilder.AddColumn<DateTime>(
                name: "EventDate",
                table: "Images",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdateUpload",
                table: "Images",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EventDate",
                table: "Images");

            migrationBuilder.DropColumn(
                name: "UpdateUpload",
                table: "Images");

            migrationBuilder.RenameColumn(
                name: "Url",
                table: "Templates",
                newName: "PdfUrl");

            migrationBuilder.RenameColumn(
                name: "Url",
                table: "Images",
                newName: "FilePath");

            migrationBuilder.AddColumn<string>(
                name: "FileName",
                table: "Images",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
