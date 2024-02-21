using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Primitives;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using PruebaNet8.APP.Models.ViewModels;
using PruebaNet8.APP.Utilidades;
using PruebaNet8.DAL.Interfaces;
using PruebaNet8.ENTITY;
using System.Runtime.InteropServices;

namespace PruebaNet8.APP.Controllers
{
    
    [AllowAnonymous]
    public class CarritoController : Controller
    {

        private readonly IGenericRepository<Producto> _repository;

        public CarritoController(IGenericRepository<Producto> repository)
        {
            _repository = repository;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]

        public async Task<IActionResult> ConsultarExistencia ([FromBody] List<int> Productos)
        {
            GenericResponse<List<int>> respuesta = new GenericResponse<List<int>>();

            if (Productos.Count == 0)
            {
                respuesta.Estado = false;
                respuesta.Objeto = null;

                return StatusCode(StatusCodes.Status204NoContent, respuesta);
            }
                

            try {
                List<int> productosEliminados = new List<int>();
                
                foreach (var item in Productos)
                {
                    Producto productoExistente = await _repository.Obtener(p => p.Id == item);

                    if (productoExistente == null)
                    {
                        productosEliminados.Add(item);
                    }
                }

                respuesta.Estado = true;
                respuesta.Objeto = productosEliminados;
            }
            catch(Exception ex)
            {
                respuesta.Estado = false;
                respuesta.Mensaje = ex.Message;
                respuesta.Objeto = null;
            }

            return StatusCode(StatusCodes.Status200OK, respuesta);
        }
    }
}
