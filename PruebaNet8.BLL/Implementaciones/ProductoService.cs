using PruebaNet8.BLL.Interfaces;
using PruebaNet8.DAL.Interfaces;
using PruebaNet8.ENTITY;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static System.Net.Mime.MediaTypeNames;

namespace PruebaNet8.BLL.Implementaciones
{
    public class ProductoService : IProductoService
    {
        private readonly IGenericRepository<Producto> _repository;
        private readonly IFotoService _fotoService;
        private readonly IFirebaseService _firebaseService;
        public ProductoService(IGenericRepository<Producto> repository, IFotoService fotoService, IFirebaseService firebaseService)
        {
            _repository = repository;
            _fotoService = fotoService;
            _firebaseService = firebaseService;
        }

        public async Task<Producto> Crear(Producto entidad, List<string> nombreImagenes, List<Stream> streamImagenes)
        {
            // Se busca que el producto que se quiere crear no exista anteriormente
            Producto productoExistente = await _repository.Obtener(p => p.Id == entidad.Id);

            if (productoExistente != null)
                throw new TaskCanceledException("Ya existe un producto como este, ingrese uno nuevo");

            // Si el producto no fue creado, pasa a hacerlo
            try
            {
                Producto nuevoProducto = await _repository.Crear(entidad);

                if (nuevoProducto.Id == 0)
                    throw new TaskCanceledException("No se pudo crear el producto");

                for (int i = 0; i < streamImagenes.Count(); i++)
                {
                    string urlImagen = await _firebaseService.SubirStorage(streamImagenes[i], "carpeta_producto", nombreImagenes[i]);
                    ImagenesProducto nuevaImagen = await _fotoService.CrearImagen(nuevoProducto.Id, nombreImagenes[i], urlImagen);
                }

                return nuevoProducto;
            }
            catch
            {
                throw;
            }

        }

        public async Task<Producto> Editar(Producto entidad)
        {
            Producto producto_existente = await _repository.Obtener(p => p.Id == entidad.Id);

            if (producto_existente == null)
                throw new TaskCanceledException("El producto a editar no existe");

            try
            {
                Producto producto_a_editar = await _repository.Obtener(p => p.Id == entidad.Id);

                producto_a_editar.Nombre = entidad.Nombre;
                producto_a_editar.Marca = entidad.Marca;
                producto_a_editar.Descripcion = entidad.Descripcion;
                producto_a_editar.Stock = entidad.Stock;
                producto_a_editar.Precio = entidad.Precio;
                producto_a_editar.EsActivo = entidad.EsActivo;
                producto_a_editar.IdCategoria = entidad.IdCategoria;

                bool respuesta = await _repository.Editar(producto_a_editar);


                if (!respuesta)
                    throw new TaskCanceledException("No se pudo editar el producto");

                return producto_a_editar;

            } catch
            {
                throw;
            }
        }

        public async Task<bool> Eliminar(int idProducto)
        {
            try
            {
                Producto producto_encontrado = await _repository.Obtener(p => p.Id == idProducto);

                if (producto_encontrado == null)
                    throw new TaskCanceledException("No existe el producto a eliminar");

                List<ImagenesProducto> listaImagenes = await _fotoService.ListaImagenesProducto(idProducto);

                foreach(var imagen in listaImagenes)
                {
                    await _fotoService.EliminarImagenProducto(imagen.Id);                    
                }

                return await _repository.Eliminar(producto_encontrado); ;
            }
            catch
            {
                throw;
            }
        }

        public async Task<List<Producto>> Lista(string input)
        {
            IQueryable<Producto> query;

            if (string.IsNullOrEmpty(input) || input.ToLower() == "undefined")
            {
                // Si el input está vacío o es null, busca todos los productos
                query = await _repository.Consultar();
            }
            else
            {
                // Si el input no está vacío ni es null, busca por nombre
                query = await _repository.Consultar(p => p.Nombre.Contains(input) || p.Marca.Contains(input));
            }

            return query.ToList();
        }


        public async Task<Producto> BuscarProducto(int id)
        {
            IQueryable<Producto> query = await _repository.Consultar(p => p.Id == id);

            return query.First();
        }

        public async Task<List<Producto>> listaProductosCategoria(int id, bool controlador)
        {
            IQueryable<Producto> query = await _repository.Consultar(p => p.IdCategoria == id);

            if(controlador)
                return query.Take(5).ToList(); 
            else
                return query.ToList();

        }

    }
}
