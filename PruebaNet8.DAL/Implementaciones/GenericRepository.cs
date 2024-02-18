using PruebaNet8.DAL.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace PruebaNet8.DAL.Implementaciones
{
    public class GenericRepository<entidad> : IGenericRepository<entidad> where entidad : class
    {

        // Inyección del contexto de bases de datos

        private readonly PruebaIdentityProyectoContext _context;

        public GenericRepository(PruebaIdentityProyectoContext context)
        {
            _context = context;
        }


        public async Task<IQueryable<entidad>> Consultar(Expression<Func<entidad, bool>> filtro = null)
        {
            IQueryable<entidad> queryEntidad = filtro == null ? _context.Set<entidad>() : _context.Set<entidad>().Where(filtro);

            return queryEntidad;
        }

        public async Task<entidad> Obtener(Expression<Func<entidad, bool>> filtro)
        {
            try
            {
                entidad entity = await _context.Set<entidad>().FirstOrDefaultAsync(filtro);

                return entity;
            }
            catch
            {
                throw;
            }
        }

        public async Task<entidad> Crear(entidad entity)
        {
            try
            {
                _context.Set<entidad>().Add(entity);
                await _context.SaveChangesAsync();
                return entity;
            }
            catch
            {
                throw;
            }
        }

        public async Task<bool> Editar(entidad entity)
        {
            try
            {
                _context.Set<entidad>().Update(entity);
                await _context.SaveChangesAsync();
                return true;
            }
            catch
            {
                throw;
            }
        }

        public async Task<bool> Eliminar(entidad entity)
        {
            try
            {
                _context.Set<entidad>().Remove(entity);
                await _context.SaveChangesAsync();
                return true;
            }
            catch
            {
                throw;
            }
        }

    }
}
