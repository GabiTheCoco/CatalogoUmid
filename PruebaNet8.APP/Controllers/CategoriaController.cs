using AutoMapper;
using PruebaNet8.APP.Models.ViewModels;
using PruebaNet8.APP.Utilidades;
using PruebaNet8.BLL.Implementaciones;
using PruebaNet8.BLL.Interfaces;
using PruebaNet8.ENTITY;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using System.Reflection.Metadata.Ecma335;
using Microsoft.AspNetCore.Authorization;

namespace PruebaNet8.APP.Controllers
{

    public class CategoriaController : Controller
    {
        private readonly IMapper _mapper;
        private readonly IProductoService _productoService;
        private readonly ICategoriaService _categoriaService;
        private readonly IFotoService _fotoService;


        public CategoriaController(IMapper mapper, IProductoService productoService, ICategoriaService categoriaService, IFotoService fotoService)
        {
            _mapper = mapper;
            _productoService = productoService;
            _categoriaService = categoriaService;
            _fotoService = fotoService;
        }

        [AllowAnonymous]
        public IActionResult pantallaCategoria()
        {
            return View();
        }

        [HttpGet("MostrarProductosCategoria/{id}/{orden}/{estado}"), AllowAnonymous]

        public async Task<IActionResult> MostrarProductosCategoria(int id, string orden, int estado)
        {
            try
            {
                List<VMProductoMin> productosCategoria = _mapper.Map<List<VMProductoMin>>(await _productoService.listaProductosCategoria(id, false));

                // Filtrar productos por estado
                productosCategoria = estado == 1 || estado == 0
                    ? productosCategoria.Where(p => p.esActivo == estado).ToList()
                    : productosCategoria;

                // Ordenar productos por precio ascendente o descendente
                productosCategoria = orden switch
                {
                    "asc" => productosCategoria.OrderBy(p => p.precio).ToList(),
                    "desc" => productosCategoria.OrderByDescending(p => p.precio).ToList(),
                    "-" => productosCategoria
                };

                foreach (var item in productosCategoria)
                {

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

                }

                return StatusCode(StatusCodes.Status200OK,
                    new
                    {
                        data = productosCategoria
                    });
            }
            catch
            {
                throw;
            }
        }


        [HttpGet, AllowAnonymous]

        public async Task<IActionResult> ListaCategorias()
        {
            List<VMCategoria> vmListaCategorias = _mapper.Map<List<VMCategoria>>(await _categoriaService.Lista());

            if (vmListaCategorias.Count != 0)
                return StatusCode(StatusCodes.Status200OK, vmListaCategorias);
            else
                return StatusCode(StatusCodes.Status204NoContent, null);

        }

        [HttpPost, Authorize]

        public async Task<IActionResult> CrearCategoria([FromBody] VMCategoria modelo)
        {
            GenericResponse<VMCategoria> respuesta = new GenericResponse<VMCategoria>();

            try
            {
                Categoria nuevaCategoria = await _categoriaService.Crear(_mapper.Map<Categoria>(modelo));
                modelo = _mapper.Map<VMCategoria>(nuevaCategoria);

                respuesta.Estado = true;
                respuesta.Objeto = modelo;
            }
            catch (Exception ex)
            {
                respuesta.Estado = false;
                respuesta.Mensaje = ex.Message;
            }

            return StatusCode(StatusCodes.Status200OK, respuesta);
        }

        [HttpPut, Authorize]

        public async Task<IActionResult> EditarCategoria([FromBody] VMCategoria modelo)
        {
            GenericResponse<VMCategoria> respuesta = new GenericResponse<VMCategoria>();

            try
            {
                Categoria categoriaEditada = await _categoriaService.Editar(_mapper.Map<Categoria>(modelo));
                modelo = _mapper.Map<VMCategoria>(categoriaEditada);

                respuesta.Estado = true;
                respuesta.Objeto = modelo;
            }
            catch (Exception ex)
            {
                respuesta.Estado = false;
                respuesta.Mensaje = ex.Message;
            }

            return StatusCode(StatusCodes.Status200OK, respuesta);
        }

        [HttpDelete, Authorize]

        public async Task<IActionResult> EliminarCategoria(int Id)
        {
            GenericResponse<string> respuesta = new GenericResponse<string>();

            try
            {
                respuesta.Estado = await _categoriaService.Eliminar(Id);
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
