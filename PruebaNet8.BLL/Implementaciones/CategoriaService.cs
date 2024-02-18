using PruebaNet8.BLL.Interfaces;
using PruebaNet8.DAL.Interfaces;
using PruebaNet8.ENTITY;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Internal;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PruebaNet8.BLL.Implementaciones
{
    public class CategoriaService : ICategoriaService
    {
        private readonly IGenericRepository<Categoria> _repository; // Inyección de los métodos genéricos para categoría

        public CategoriaService(IGenericRepository<Categoria> repository)
        {
            _repository = repository;
        }

        public async Task<Categoria> Crear(Categoria entidad)
        {
            try
            {
                Categoria nuevaCategoria = await _repository.Crear(entidad); // se crea una nueva categoria, utilizandoe el método del repositorio

                if (nuevaCategoria.Id == 0) // si la categoria no tiene id, se envía el mensaje de error pertinente
                    throw new TaskCanceledException("No se pudo crear la categoría deseada"); 

                return nuevaCategoria;
            }
            catch
            {
                throw;
            }
        }

        public async Task<Categoria> Editar(Categoria entidad)
        {
            try
            {
                // Se busca la categoria a editar
                Categoria busquedaCategoria = await _repository.Obtener(c => c.Id == entidad.Id);

                // Se editan las propiedades de la categoria encontrada, con las propiedades dadas en la entidad pasada por parámetro
                busquedaCategoria.Nombre = entidad.Nombre;
                busquedaCategoria.EsActivo = entidad.EsActivo;
                
                // Se edita la categoria, haciendo uso del método del repositorio genérico
                bool respuesta = await _repository.Editar(busquedaCategoria);

                if (!respuesta) // Si respuesta es falso, se comunica el error pertinente
                    throw new TaskCanceledException("No se puede editar la categoría deseada.");

                return busquedaCategoria;
            }
            catch
            {
                throw;
            }
        }

        public async Task<bool> Eliminar(int id)
        {
            try
            {
                // Se busca la categoria a eliminar por su id referido
                Categoria busquedaCategoria = await _repository.Obtener(c => c.Id == id); // Este sería el filtro por el cual se obtendría

                if (busquedaCategoria == null) // No se encontro la categoria necesaria
                    throw new TaskCanceledException("La cateogría que desea eliminar no existe");

                bool respuesta = await _repository.Eliminar(busquedaCategoria); // se envía al método eliminar del repositorio genérico

                return respuesta;
            }
            catch
            {
                throw;
            }
        }

        public async Task<List<Categoria>> Lista()
        {
            IQueryable<Categoria> query = await _repository.Consultar(); // Se hace una búsqueda de las categorías existentes en la base de datoss

            return query.ToList(); // Retorna una lista de la consulta realizada
        }

    }
}
