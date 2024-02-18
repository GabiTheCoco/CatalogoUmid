namespace PruebaNet8.APP.Models.ViewModels
{
    public class VMProductoMin
    {
        public int idProducto { get; set; }

        public string? nombre { get; set; }

        public string? nombreCategoria { get; set; }

        public decimal? precio { get; set; }

        public int esActivo { get; set; }

        public VMImagen? imagenProducto { get; set; }
    }
}
