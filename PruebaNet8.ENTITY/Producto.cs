using System;
using System.Collections.Generic;

namespace PruebaNet8.ENTITY;

public partial class Producto
{
    public int Id { get; set; }

    public string? Nombre { get; set; }

    public string? Marca { get; set; }

    public string? Descripcion { get; set; }

    public int? Stock { get; set; }

    public decimal? Precio { get; set; }

    public bool? EsActivo { get; set; }

    public DateTime? FechaRegistro { get; set; }

    public int? IdCategoria { get; set; }

    public virtual ICollection<ImagenesProducto> ImagenesProductos { get; set; } = new List<ImagenesProducto>();
}
