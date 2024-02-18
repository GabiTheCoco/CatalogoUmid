using PruebaNet8.ENTITY;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PruebaNet8.BLL.Interfaces
{
    public interface ICategoriaService
    {
        Task<List<Categoria>> Lista(); // Listar las categorías existentes
        Task<Categoria> Crear(Categoria entidad);
        Task<Categoria> Editar(Categoria entidad);
        Task<bool> Eliminar(int id);
    }
}
