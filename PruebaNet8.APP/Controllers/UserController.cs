using AutoMapper;
using PruebaNet8.APP.Utilidades;
using PruebaNet8.BLL.Interfaces;
using PruebaNet8.DAL.Interfaces;
using PruebaNet8.ENTITY;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Security.Claims;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;


namespace PruebaNet8.APP.Controllers
{
    [AllowAnonymous]
    public class UserController : Controller
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly SignInManager<IdentityUser> _signInManager;
        private readonly IUserService _userService;
        public IConfiguration _configuration;

        public UserController(IUserService userService, IConfiguration configuration, UserManager<IdentityUser> userManager,
            SignInManager<IdentityUser> signInManager)
        {
            _userService = userService;
            _configuration = configuration;
            _userManager = userManager;
            _signInManager = signInManager;
        }


        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]

        public async Task<IActionResult> IniciarSesion([FromForm] string modelo)
        {
            GenericResponse<string> respuesta = new GenericResponse<string>();

            try
            {
                Usuario usuarioIngresado = JsonConvert.DeserializeObject<Usuario>(modelo);

                var result = await _signInManager.PasswordSignInAsync(usuarioIngresado.NombreUsuario, usuarioIngresado.ClaveUsuario, false, false);

                if (result.Succeeded)
                {
                    // Obtener el usuario autenticado
                    var usuarioAutenticado = await _userManager.FindByNameAsync(usuarioIngresado.NombreUsuario);

                    // Crear claims para el token JWT
                    var claims = new List<Claim>
                    {
                        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                        new Claim(JwtRegisteredClaimNames.Iat, DateTime.Now.ToString()),
                        new Claim(ClaimTypes.Name, usuarioIngresado.NombreUsuario)
                        // Puedes agregar más claims según tus necesidades
                    };

                    // Obtener roles del usuario y agregarlos como claims

                    var jwt = _configuration.GetSection("Jwt").Get<Jwt>();

                    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwt.Key));
                    var inicioSesion = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

                    var token = new JwtSecurityToken(
                            jwt.Issuer,
                            jwt.Audience,
                            claims,
                            expires: DateTime.Now.AddMinutes(5),
                            signingCredentials: inicioSesion
                        );

                    respuesta.Estado = true;
                    respuesta.Objeto = new JwtSecurityTokenHandler().WriteToken(token);
                }
                else
                {
                    respuesta.Estado = false;
                    respuesta.Mensaje = "Inicio de sesión fallido";
                }

            } catch(Exception ex)
            {
                respuesta.Estado = false;
                respuesta.Mensaje = ex.Message;
            }

            return StatusCode(StatusCodes.Status200OK, respuesta);

        }

        [HttpPost]

        public async Task<IActionResult> CrearAdmin([FromForm] string modelo)
        {
            GenericResponse<string> respuesta = new GenericResponse<string>();

            try
            {
                Usuario usuario_a_crear = JsonConvert.DeserializeObject<Usuario>(modelo);

                if (string.IsNullOrEmpty(usuario_a_crear.NombreUsuario) || string.IsNullOrEmpty(usuario_a_crear.ClaveUsuario))
                {
                    return BadRequest("El nombre de usuario y la contraseña son obligatorios.");
                }

                var usuarioExistente = _userManager.FindByNameAsync(usuario_a_crear.NombreUsuario);

                if(usuarioExistente == null)
                {
                    bool resultado = await _userService.CrearUsuario(usuario_a_crear);

                    if (!resultado)
                    {
                        return StatusCode(StatusCodes.Status500InternalServerError, "Error al crear el usuario.");
                    }


                    respuesta.Estado = true;
                    respuesta.Objeto = "Se creo exitosamente el usuario che";
                }
                else
                {
                    respuesta.Estado = false;
                    respuesta.Mensaje = "El usuario a crear ya existe";
                }

            }
            catch (Exception ex)
            {
                respuesta.Estado = false;
                respuesta.Mensaje = ex.Message;
            }

            return StatusCode(StatusCodes.Status200OK, respuesta);
        }
    }
}
