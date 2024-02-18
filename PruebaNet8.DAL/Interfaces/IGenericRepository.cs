using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace PruebaNet8.DAL.Interfaces
{
    public interface IGenericRepository<entidad> where entidad : class
    {
        Task<entidad> Obtener(Expression<Func<entidad, bool>> filtro);

        Task<IQueryable<entidad>> Consultar(Expression<Func<entidad, bool>> filtro = null);

        Task<entidad> Crear(entidad entity);
        Task<bool> Editar(entidad entity);
        Task<bool> Eliminar(entidad entity);
    }
}
