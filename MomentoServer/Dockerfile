# שלב 1: בנייה
FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src

# העתק את קובץ ה-.csproj של ה-API
COPY MomentoServer/MomentoServer.Api/MomentoServer.Api.csproj ./MomentoServer.Api/

# שחזור חבילות NuGet
RUN dotnet restore MomentoServer.Api/MomentoServer.Api.csproj

# העתק את שאר הקבצים מהפרויקט
COPY . .

# פרסום (Publish) לקבצים הרצים
WORKDIR /src/MomentoServer.Api
RUN dotnet publish -c Release -o /app/publish

# שלב 2: הרצה
FROM mcr.microsoft.com/dotnet/aspnet:7.0
WORKDIR /app
COPY --from=build /app/publish .

# פתיחת פורט 80 (לשימוש ברנדר או בדוקר לוקאלי)
EXPOSE 80

# הפעלת האפליקציה
ENTRYPOINT ["dotnet", "MomentoServer.Api.dll"]
