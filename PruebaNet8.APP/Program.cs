using PruebaNet8.APP.Utilidades;
using PruebaNet8.BLL.Implementaciones;
using PruebaNet8.BLL.Interfaces;
using PruebaNet8.DAL;
using PruebaNet8.DAL.Implementaciones;
using PruebaNet8.DAL.Interfaces;
using PruebaNet8.ENTITY;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Drawing.Text;
using System.Text;


var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("politica",
        policy =>
        {
            policy.AllowAnyOrigin().WithMethods("GET").AllowAnyHeader();

        });
});

builder.Services.Configure<IdentityOptions>(options =>
{
    // Password settings.
    options.Password.RequireDigit = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireNonAlphanumeric = true;
    options.Password.RequireUppercase = true;
    options.Password.RequiredLength = 6;

    // User settings.
    options.User.AllowedUserNameCharacters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    options.User.RequireUniqueEmail = false;
});


builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(options =>
{
    options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
    };
});

// Add services to the container.
builder.Services.AddControllersWithViews();

// Agregar el contexto de base de datos
builder.Services.AddDbContext<PruebaIdentityProyectoContext>(
    opt => opt.UseSqlServer(builder.Configuration.GetConnectionString("cadenaSQL")));

builder.Services.AddAuthorization();

builder.Services.AddIdentityApiEndpoints<IdentityUser>()
    .AddEntityFrameworkStores<PruebaIdentityProyectoContext>();

//Inyectar las dependencias de Automapper
builder.Services.AddAutoMapper(typeof(AutoMapperProfile));

// Especificar que la implementacion de IGenericRepository es GenericRepository
builder.Services.AddTransient(typeof(IGenericRepository<>), typeof(GenericRepository<>));

// Especificar que la implementacion de ICategoriaService es CategoriaService
builder.Services.AddScoped<ICategoriaService, CategoriaService>();

//Especificar que la implementacion de IProductoService es ProductoService
builder.Services.AddScoped<IProductoService, ProductoService>();

// Especificar que la implementacion de IFirebaseService es FirebaseService
builder.Services.AddScoped<IFirebaseService, FirebaseService>();

// Especificar que la implementacion de IFotoService es FotoService
builder.Services.AddScoped<IFotoService, FotoService>();

// Especificar que la implementacion de IUserService es UserService
builder.Services.AddScoped<IUserService, UserService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.MapIdentityApi<IdentityUser>();

app.UseHttpsRedirection();

app.UseStaticFiles();

app.UseRouting();

app.UseAuthentication();

app.UseAuthorization();

app.UseCors("politica");

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Productos}/{id?}");

app.Run();
