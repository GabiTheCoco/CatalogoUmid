using System;
using System.Collections.Generic;

namespace PruebaNet8.ENTITY;

public partial class ImagenesProducto
{
    public int Id { get; set; }

    public string? Nombre { get; set; }

    public string? UrlImagen { get; set; }

    public int? IdProducto { get; set; }

    public virtual Producto? IdProductoNavigation { get; set; }
}
