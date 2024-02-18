using AutoMapper;
using PruebaNet8.APP.Models;
using PruebaNet8.APP.Models.ViewModels;
using PruebaNet8.APP.Utilidades;
using PruebaNet8.BLL.Interfaces;
using PruebaNet8.ENTITY;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Data;
using System.Diagnostics;

namespace PruebaNet8.APP.Controllers
{
    public class HomeController : Controller
    {
        private readonly IMapper _mapper;
        private readonly ICategoriaService _categoriaService;
        private readonly IProductoService _productoService;
        private readonly IFotoService _fotoService;

        public HomeController(IMapper mapper, ICategoriaService categoriaService, IProductoService productoService, IFotoService fotoService)
        {
            _mapper = mapper;
            _categoriaService = categoriaService;
            _productoService = productoService;
            _fotoService = fotoService;
        }
 
        public IActionResult Productos()
        {
            return View();
        }

        public IActionResult Categorias()
        {
            return View();
        }


        // Endpoints para obtener info

        [EnableCors("politica")]
        [HttpGet("Home/MostrarProductos/{orden}/{estado}")] //obtener productos

        public async Task<IActionResult> MostrarProductos(string orden, int estado, [FromQuery] string input)
        {

            try
            {
                List<VMProductoMin> vmProductos = _mapper.Map<List<VMProductoMin>>(await _productoService.Lista(input));

                vmProductos = (estado == null || estado == 1 || estado == 0) ? vmProductos.Where(p => p.esActivo == estado).ToList() : vmProductos;

                if (vmProductos.Count == 0)
                    return StatusCode(StatusCodes.Status204NoContent, null);



                vmProductos = orden switch
                {
                    "asc" => vmProductos.OrderBy(p => p.precio).ToList(),
                    "desc" => vmProductos.OrderByDescending(p => p.precio).ToList(),
                    _ => vmProductos // Default para otros casos
                };


                // Obtener imágenes principales en paralelo
                var imagenTasks = vmProductos.Select(async item =>
                {
                    var imagenPrincipal = await _fotoService.ImagenPrincipal(item.idProducto);
                    return _mapper.Map<VMImagen>(imagenPrincipal);
                });

                // Esperar a que todas las tareas se completen
                var imagenes = await Task.WhenAll(imagenTasks);

                // Asignar las imágenes a los productos
                for (int i = 0; i < vmProductos.Count; i++)
                {
                    vmProductos[i].imagenProducto = imagenes[i];
                }


                return StatusCode(StatusCodes.Status200OK, vmProductos);
            }
            catch
            {
                throw;
            }
        }

        [EnableCors("politica")]
        [HttpGet("Home/MostrarCategoriasyProductos/{orden}/")] 

        public async Task<IActionResult> MostrarCategoriasyProductos(string orden)
        {
            try
            {
                List<VMCategoria> vmListaCategorias = _mapper.Map<List<VMCategoria>>(await _categoriaService.Lista());

                if(vmListaCategorias.Count > 0) {
                    foreach (var item in vmListaCategorias)
                    {
                        var productosCategoria = _mapper.Map<List<VMProductoMin>>(await _productoService.listaProductosCategoria(item.Id, true));

                        if (productosCategoria.Count == 0)
                            break;

                        // Ordenar productos por precio ascendente o descendente
                        productosCategoria = orden switch
                        {
                            "asc" => productosCategoria.OrderBy(p => p.precio).ToList(),
                            "desc" => productosCategoria.OrderByDescending(p => p.precio).ToList(),
                            "-" => productosCategoria
                        };

                        // Obtener imágenes principales en paralelo
                        var imagenTasks = productosCategoria.Select(async producto =>
                        {
                            var imagenPrincipal = await _fotoService.ImagenPrincipal(producto.idProducto);
                            return _mapper.Map<VMImagen>(imagenPrincipal);
                        });

                        // Esperar a que todas las tareas se completen
                        var imagenes = await Task.WhenAll(imagenTasks);

                        // Asignar las imágenes a los productos
                        for (int i = 0; i < productosCategoria.Count; i++)
                        {
                            productosCategoria[i].imagenProducto = imagenes[i];
                        }

                        item.Productos = productosCategoria;
                    }

                    return StatusCode(StatusCodes.Status200OK, vmListaCategorias);
                }
                else
                {
                    return StatusCode(StatusCodes.Status204NoContent, null);
                }

                
            }
            catch
            {
                throw;
            }
        }

    }
}
