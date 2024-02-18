namespace PruebaNet8.APP.Models.ViewModels
{
    public class VMCategoria
    {
        public int Id { get; set; }

        public string? NombreCategoria { get; set; }

        public int? EsActivo { get; set; }

        public List<VMProductoMin>? Productos { get; set; }

    }
}
