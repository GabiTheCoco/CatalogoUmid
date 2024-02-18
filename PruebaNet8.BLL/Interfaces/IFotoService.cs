using PruebaNet8.ENTITY;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PruebaNet8.BLL.Interfaces
{
    public interface IFotoService
    {
        Task<ImagenesProducto> CrearImagen(int idProducto, string nombre, string url);

        Task<List<ImagenesProducto>> ListaImagenesProducto(int id);

        Task<ImagenesProducto> ImagenPrincipal(int id);

        Task<bool> EliminarImagenProducto(int id);

        //Task<ImagenesProducto> EditarImagen(int idImagen);
    }
}
