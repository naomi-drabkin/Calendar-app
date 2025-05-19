# שלב 1: בנייה
FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src

# העתקת קבצי csproj לפי השכבות
COPY MomentoServer/MomentoServer.Api/MomentoServer.Api.csproj MomentoServer.Api/
COPY MomentoServer/MomentoServer.Service/MomentoServer.Service.csproj MomentoServer.Service/
COPY MomentoServer/MomentoServer.Data/MomentoServer.Data.csproj MomentoServer.Data/
COPY MomentoServer/MomentoServer.Core/MomentoServer.Core.csproj MomentoServer.Core/

# שחזור חבילות NuGet
RUN dotnet restore MomentoServer.Api/MomentoServer.Api.csproj

# העתקת כל שאר הקבצים
COPY . .

# בניית הפרויקט
WORKDIR /src/MomentoServer/MomentoServer.Api
RUN dotnet publish -c Release -o /app/publish

# שלב 2: הרצה
FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

# פתיחת פורטים - Render מקשיב ל־80
EXPOSE 80

# הפעלת האפליקציה
ENTRYPOINT ["dotnet", "MomentoServer.Api.dll"]
