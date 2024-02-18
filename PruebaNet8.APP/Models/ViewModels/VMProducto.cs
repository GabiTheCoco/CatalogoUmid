namespace PruebaNet8.APP.Models.ViewModels
{
    public class VMProducto
    {
        public int idProducto { get; set; }

        public string? nombre { get; set; }

        public string? marca { get; set; }

        public string? descripcion { get; set; }

        public int? idCategoria { get; set; }

        public string? nombreCategoria { get; set; }

        public int? stock { get; set; }

        public decimal? precio { get; set; }

        public int esActivo { get; set; }

        public List<VMImagen>? imagenesRelacionadas { get; set; }
    }
}
