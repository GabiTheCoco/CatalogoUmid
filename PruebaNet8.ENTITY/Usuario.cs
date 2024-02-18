using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;

namespace PruebaNet8.ENTITY;

public partial class Usuario
{
    public int IdUsuario { get; set; }

    public string? NombreUsuario { get; set; }

    public string? ClaveUsuario { get; set; }
}
