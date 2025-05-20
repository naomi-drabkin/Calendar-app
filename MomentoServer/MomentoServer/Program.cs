using System.Text;
using MementoServer.Data;
using MementoServer.Data.Repositories;
using MementoServer.Service;
using Microsoft.EntityFrameworkCore;
using MomentoServer.Core;
using MomentoServer.Core.IRepositories;
using MomentoServer.Core.IServices;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.Extensions.Options;
using Amazon.S3;
using Amazon.Runtime;
using DotNetEnv;
using MomentoServer.Api.Controllers;

//var builder = WebApplication.CreateBuilder(args);
//Console.WriteLine(builder.Configuration["AWS:AccessKey"]);
//Console.WriteLine(builder.Configuration["AWS:SecretKey"]);
//Console.WriteLine(builder.Configuration["AWS:Region"]);




DotNetEnv.Env.Load();

var builder = WebApplication.CreateBuilder(args);



var credentials = new BasicAWSCredentials(
    builder.Configuration["AWS:AccessKey"],
    builder.Configuration["AWS:SecretKey"]
);





builder.Services.AddControllers();


builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


//builder.Services.AddControllers()
//    .AddJsonOptions(x =>
//    {
//        x.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.Preserve;
//        x.JsonSerializerOptions.WriteIndented = true;
//    });

builder.Services.AddControllers()
    .AddJsonOptions(x =>
    {
        x.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
        x.JsonSerializerOptions.WriteIndented = true; // זה סתם לפורמט יפה, לא חובה
    });



//Env.Load();

////var AccessKey = Environment.GetEnvironmentVariable("ACCESS");
////var SecretAccess = Environment.GetEnvironmentVariable("SECRET");
//var awsRegion = Environment.GetEnvironmentVariable("AWS_REGION");

//var credentials = new BasicAWSCredentials(
//builder.Configuration["AWS:AccessKey"],
//builder.Configuration["AWS:SecretKey"]
////AccessKey,
////SecretAccess
//);


var region = Amazon.RegionEndpoint.GetBySystemName(builder.Configuration["AWS:Region"]); // בדקי שהאזור נכון

//var region = Amazon.RegionEndpoint.GetBySystemName(awsRegion);

var s3Client = new AmazonS3Client(credentials, region);

builder.Services.AddSingleton<IAmazonS3>(s3Client);
Console.WriteLine(s3Client);

//builder.Services.AddScoped<TemplateController, UploadFiles>();
builder.Services.AddScoped<UploadFiles>();

builder.Services.AddScoped<ITokenService, TokenService>();

builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IUserRepository, UserRepository>();


builder.Services.AddScoped<ITemplateService, TemplateService>();
builder.Services.AddScoped<ITemplateRepository, TemplateRepository>();


builder.Services.AddScoped<IImageRepository, ImageRepository>();
builder.Services.AddScoped<IImageService, ImageService>();


builder.Services.AddScoped<ICalendarRepository, CalendarRepository>();
builder.Services.AddScoped<ICalendarService, CalendarService>();


//var builder = WebApplication.CreateBuilder(args);

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"])
            ),
            ValidateIssuer = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidateAudience = true,
            ValidAudience = builder.Configuration["Jwt:Audience"],
            ValidateLifetime = true
        };
    });
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("Admin", policy => policy.RequireRole("Admin"));
    options.AddPolicy("User", policy => policy.RequireRole("User"));
}
);

builder.Services.AddHttpClient();

// הוספת שירותי ה-MailService (שירות לשליחת מיילים דרך Mailchimp או שירותים אחרים)
//builder.Services.AddTransient<IMailService, MailService>();

builder.Services.AddDbContext<DataContext>();

builder.Services.AddAutoMapper(typeof(MappingProfile));

//builder.Services.AddCors(options =>
//{
//    options.AddPolicy("AllowAll", policy =>

//    policy.SetIsOriginAllowed(_ => true)
//        .AllowAnyMethod().AllowAnyHeader().AllowCredentials()
//        );

//});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowClients", policy =>
    {
        policy.WithOrigins(
                "https://calendar-react-client.onrender.com",
                "https://calendar-admin-client.onrender.com")
              .AllowAnyHeader()
              .AllowAnyMethod().AllowCredentials();
    });
});

builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Memento API", Version = "v1" });

    // ?? הוספת תמיכה ב- JWT Authorization
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "נא להזין טוקן JWT (ללא המילה 'Bearer')"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});



//builder.Services.AddSwaggerGen(c =>
//{
//    c.OperationFilter<SwaggerFileUploadOperationFilter>();
//});

//builder.Services.Configure<FormOptions>(options =>
//{
//    options.MultipartBodyLengthLimit = 10 * 1024 * 1024; // מגבלת העלאה של 10MB
//});

var app = builder.Build();

// Configure the HTTP request pipeline.
//if (app.Environment.IsDevelopment())
//{
app.UseSwagger();
app.UseSwaggerUI();
//}

app.MapGet("/", () => "server is running");


app.UseHttpsRedirection();
app.UseCors("AllowClients");

//app.UseAuthorization();
app.UseAuthentication();
app.UseAuthorization();


app.MapControllers();

app.Run();
