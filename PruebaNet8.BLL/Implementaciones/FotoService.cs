using PruebaNet8.BLL.Interfaces;
using PruebaNet8.DAL.Interfaces;
using PruebaNet8.ENTITY;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PruebaNet8.BLL.Implementaciones
{
    public class FotoService : IFotoService
    {
        private readonly IGenericRepository<ImagenesProducto> _repository;
        private readonly IFirebaseService _firebaseService;

        public FotoService(IGenericRepository<ImagenesProducto> repository, IFirebaseService firebaseService)
        {
            _repository = repository;
            _firebaseService = firebaseService;
        }

        public async Task<ImagenesProducto> CrearImagen(int idProducto, string nombre, string url)
        {
            ImagenesProducto imagenExistente = await _repository.Obtener(p => p.Nombre == nombre);

            if (imagenExistente != null)
                throw new TaskCanceledException("Ya existe la imagen que intenta subir, intente de nuevo");

            try
            {
                ImagenesProducto imagenCreada = await _repository.Crear(new ImagenesProducto
                {
                    IdProducto = idProducto,
                    Nombre = nombre,
                    UrlImagen = url
                });

                if (imagenCreada.Id == 0)
                    throw new TaskCanceledException("No se pudo crear la imagen");

                return imagenCreada;
            }
            catch
            {
                throw;
            }
        }

        public async Task<List<ImagenesProducto>> ListaImagenesProducto(int id)
        {
            IQueryable<ImagenesProducto> query = await _repository.Consultar(p => p.IdProducto == id);

            return query.ToList();
        }

        public async Task<ImagenesProducto> ImagenPrincipal(int id)
        {
            IQueryable<ImagenesProducto> query = await _repository.Consultar(p => p.IdProducto == id);

            return query.ToList().First();
        }

        public async Task<bool> EliminarImagenProducto(int id)
        {
            ImagenesProducto imagen = await _repository.Obtener(p => p.Id == id);

            bool respuesta = await _firebaseService.EliminarStorage("carpeta_producto", imagen.Nombre);

            if (respuesta)
                await _repository.Eliminar(imagen);

            return respuesta;

        }

        //public async Task<ImagenesProducto> EditarImagen(int idImagen, ImagenesProducto imagenEditada)
        //{
        //    ImagenesProducto imagen = await _repository.Obtener(p => p.Id == idImagen);

        //    if (imagen == null)
        //        throw new TaskCanceledException();

        //    try
        //    {
        //        imagen.Nombre = imagenEditada.Nombre;
        //        imagen.UrlImagen = imagenEditada.UrlImagen;

        //        bool respuesta = await _repository.Editar(imagen);

        //        if (!respuesta)
        //            throw new TaskCanceledException();

        //        return imagen;
        //    }
        //    catch
        //    {
        //        throw;
        //    }


        //}
    }
}
