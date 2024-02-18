using AutoMapper;
using PruebaNet8.APP.Models.ViewModels;
using PruebaNet8.APP.Utilidades;
using PruebaNet8.BLL.Interfaces;
using PruebaNet8.ENTITY;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.SqlServer.Query.Internal;
using Newtonsoft.Json;

namespace PruebaNet8.APP.Controllers
{

    public class ProductoController : Controller
    {
        private readonly IMapper _mapper;
        private readonly IProductoService _productoService;
        private readonly ICategoriaService _categoriaService;
        private readonly IFotoService _fotoService;
        private readonly IFirebaseService _firebaseService;


        public ProductoController(IMapper mapper,IProductoService productoService, ICategoriaService categoriaService, IFotoService fotoService, IFirebaseService firebaseService)
        {
            _mapper = mapper;
            _productoService = productoService;
            _categoriaService = categoriaService;
            _fotoService = fotoService;
            _firebaseService = firebaseService;
        }

        public IActionResult pantallaProducto()
        {
            return View();
        }

        [EnableCors("politica")]
        [HttpGet("MostrarProducto/{id}")]

        public async Task<IActionResult> MostrarProducto(int id) {

            try
            {
                VMProducto producto = _mapper.Map<VMProducto>(await _productoService.BuscarProducto(id));

                producto.imagenesRelacionadas = _mapper.Map<List<VMImagen>>(await _fotoService.ListaImagenesProducto(id));

                return StatusCode(StatusCodes.Status200OK,
                        new
                        {
                            data = producto
                        });
            }
            catch
            {
                throw;
            }

        }

        [DisableCors]
        [HttpPost]

        public async Task<IActionResult> CrearProducto([FromForm] List<IFormFile> fotos, [FromForm] string modelo)
        {
            try
            {
                VMProducto vmProducto = JsonConvert.DeserializeObject<VMProducto>(modelo);

                if (fotos != null && fotos.Count > 0)
                {
                    var nombreImagenes = new List<string>();
                    var streamImagenes = new List<Stream>();

                    foreach (var foto in fotos)
                    {
                        var nombreCodificado = Guid.NewGuid().ToString("N");
                        var extension = Path.GetExtension(foto.FileName);
                        var nombreImagen = string.Concat(nombreCodificado, extension);
                        nombreImagenes.Add(nombreImagen);

                        var fotoStream = foto.OpenReadStream();
                        streamImagenes.Add(fotoStream);
                    }

                    var nuevoProducto = await _productoService.Crear(_mapper.Map<Producto>(vmProducto), nombreImagenes, streamImagenes);
                    var vmNuevoProducto = _mapper.Map<VMProducto>(nuevoProducto);

                    return StatusCode(StatusCodes.Status200OK, new GenericResponse<VMProducto>
                    {
                        Estado = true,
                        Objeto = vmNuevoProducto
                    });
                }
                else
                {
                    return BadRequest("No se proporcionaron imágenes.");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new GenericResponse<VMProducto>
                {
                    Estado = false,
                    Mensaje = ex.Message
                });
            }
        }


        [DisableCors]
        [HttpPut]

        public async Task<IActionResult> Editar([FromForm] string modelo)
        {
            GenericResponse<VMProducto> respuesta = new GenericResponse<VMProducto>();

            try
            {
                VMProducto vmProducto = JsonConvert.DeserializeObject<VMProducto>(modelo);

                Producto producto_editado = await _productoService.Editar(_mapper.Map<Producto>(vmProducto));

                vmProducto = _mapper.Map<VMProducto>(producto_editado);

                respuesta.Estado = true;
                respuesta.Objeto = vmProducto;

            }
            catch (Exception ex)
            {
                respuesta.Estado = false;
                respuesta.Mensaje = ex.Message;
            }

            return StatusCode(StatusCodes.Status200OK, respuesta);
        }

        [DisableCors]
        [HttpDelete("Eliminar/{id}")]

        public async Task<IActionResult> Eliminar(int id)
        {
            GenericResponse<VMProducto> respuesta = new GenericResponse<VMProducto>();

            try
            {
                respuesta.Estado = await _productoService.Eliminar(id);
            }
            catch (Exception ex)
            {
                respuesta.Estado = false;
                respuesta.Mensaje = ex.Message;
            }

            return StatusCode(StatusCodes.Status200OK, respuesta);
        }

        [DisableCors]
        [HttpPost("AgregarImagen/{id}")]

        public async Task<IActionResult> AgregarImagen([FromForm] IFormFile foto, int id)
        {
            GenericResponse<VMImagen> respuesta = new GenericResponse<VMImagen>();

            if (foto == null)
                throw new TaskCanceledException();

            try
            {

                string nombre_codificado = Guid.NewGuid().ToString("N");
                string extension = Path.GetExtension(foto.FileName);
                string nombreImagen = string.Concat(nombre_codificado, extension);

                Stream fotoStream = foto.OpenReadStream();

                string urlImagen = await _firebaseService.SubirStorage(fotoStream, "carpeta_producto", nombreImagen);
                ImagenesProducto nuevaImagen = await _fotoService.CrearImagen(id, nombreImagen, urlImagen);

                VMImagen imagenAgregada = _mapper.Map<VMImagen>(nuevaImagen);

                respuesta.Estado = true;
                respuesta.Objeto = imagenAgregada;

            }
            catch (Exception ex)
            {
                respuesta.Estado = false;
                respuesta.Mensaje = ex.Message;
            }

            return StatusCode(StatusCodes.Status200OK, respuesta);
        }

        [DisableCors]
        [HttpDelete("EliminarImagen/{id}")]

        public async Task<IActionResult> EliminarImagen(int id)
        {
            GenericResponse<VMImagen> respuesta = new GenericResponse<VMImagen>();

            try
            {
                respuesta.Estado = await _fotoService.EliminarImagenProducto(id);
            }
            catch (Exception ex)
            {
                respuesta.Estado = false;
                respuesta.Mensaje = ex.Message;
            }

            return StatusCode(StatusCodes.Status200OK, respuesta);
        }




        //[HttpPut("EditarImagen/{id}")]

        //public async Task<IActionResult> EditarImagen(int id)
        //{

        //}

    }


}
