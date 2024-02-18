using PruebaNet8.BLL.Interfaces;
using PruebaNet8.DAL.Interfaces;
using PruebaNet8.ENTITY;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore.Internal;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.EntityFrameworkCore;

namespace PruebaNet8.BLL.Implementaciones
{
    public class UserService : IUserService
    {
        private readonly IGenericRepository<Usuario> _repository;
        private readonly UserManager<IdentityUser> _userManager;

        public UserService(IGenericRepository<Usuario> repository, UserManager<IdentityUser> userManager)
        {
            _repository = repository;
            _userManager = userManager;
        }

        public async Task<bool> CrearUsuario(Usuario entidad)
        {

            var usuario = new IdentityUser {UserName = entidad.NombreUsuario, Email = ""};

            var resultado =  await _userManager.CreateAsync(usuario, entidad.ClaveUsuario);

            return resultado.Succeeded;
        }
    }
}
