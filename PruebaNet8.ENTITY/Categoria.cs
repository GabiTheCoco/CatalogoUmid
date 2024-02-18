using System;
using System.Collections.Generic;

namespace PruebaNet8.ENTITY;

public partial class Categoria
{
    public int Id { get; set; }

    public string? Nombre { get; set; }

    public bool? EsActivo { get; set; }

    public DateTime? FechaRegistro { get; set; }
}
