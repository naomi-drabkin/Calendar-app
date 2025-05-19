# שלב 1: בנייה
FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src

# העתקת קבצי csproj
COPY MomentoServer/MomentoServer.Api.csproj MomentoServer/
COPY MementoServer.Service/MementoServer.Service.csproj MementoServer.Service/
COPY MementoServer.Data/MementoServer.Data.csproj MementoServer.Data/
COPY MementoServer.Core/MementoServer.Core.csproj MementoServer.Core/

# שחזור חבילות NuGet
RUN dotnet restore MomentoServer/MomentoServer.Api.csproj

# העתקת כל שאר הקבצים
COPY . .

# בניית הפרויקט
WORKDIR /src/MomentoServer
RUN dotnet publish MomentoServer.Api.csproj -c Release -o /app/publish

# שלב 2: הרצה
FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

# פתיחת פורט (Render מקשיב ל־80)
EXPOSE 80

# הפעלת האפליקציה
ENTRYPOINT ["dotnet", "MomentoServer.Api.dll"]
