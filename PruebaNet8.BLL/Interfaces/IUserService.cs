using PruebaNet8.ENTITY;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PruebaNet8.BLL.Interfaces
{
    public interface IUserService 
    {
        Task<bool> CrearUsuario(Usuario entidad);
    }
}
