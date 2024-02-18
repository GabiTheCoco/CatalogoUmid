using PruebaNet8.ENTITY;
using Microsoft.AspNetCore.Components.Forms;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PruebaNet8.BLL.Interfaces
{
    public interface IProductoService
    {
        Task<List<Producto>> Lista(string input); // listar productos
        Task<List<Producto>> listaProductosCategoria(int id, bool controlador); // lista de productos por su categoria limitado a 5
        Task<Producto> BuscarProducto(int id);
        Task<Producto> Crear(Producto entidad, List<string> nombreImagenes, List<Stream> streamImagenes = null); // crear productos
        Task<Producto> Editar(Producto entidad); // editar productos
        Task<bool> Eliminar(int idProducto); // eliminar productos
    }
}
