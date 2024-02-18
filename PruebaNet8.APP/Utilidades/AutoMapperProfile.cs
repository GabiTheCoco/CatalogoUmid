using AutoMapper;
using PruebaNet8.APP.Models.ViewModels;
using PruebaNet8.ENTITY;
using Microsoft.AspNetCore.Http.HttpResults;
using System.Globalization;

namespace PruebaNet8.APP.Utilidades
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            #region Categorias

            // Cambia de true/false a 1/0 según corresponda (de Categoria a VMCategoria)

            CreateMap<Categoria, VMCategoria>()
                .ForMember(c => c.NombreCategoria, opt => opt.MapFrom(o => o.Nombre))
                .ForMember(c => c.EsActivo, opt => opt.MapFrom(o => o.EsActivo == true ? 1 : 0));

            // Cambia de 1/0 a true/false según corresponda (de VMCategoria a Categoria)

            CreateMap<VMCategoria, Categoria>()
                .ForMember(c => c.Nombre, opt => opt.MapFrom(o => o.NombreCategoria))
                .ForMember(c => c.EsActivo, opt => opt.MapFrom(p => p.EsActivo == 1 ? true : false));
            #endregion

            #region Productos

            CreateMap<Producto, VMProducto>()
                .ForMember(p => p.idProducto,
                            opt => opt.MapFrom(o => o.Id))
                .ForMember(p => p.precio,
                            opt => opt.MapFrom(o => Convert.ToString(o.Precio.Value, new CultureInfo("es-AR"))))
                .ForMember(P => P.esActivo,
                            opt => opt.MapFrom(o => o.EsActivo == true ? 1 : 0))
                .ForMember(p => p.imagenesRelacionadas,
                            opt => opt.MapFrom(o => o.ImagenesProductos));

            CreateMap<Producto, VMProductoMin>()
                .ForMember(p => p.idProducto,
                            opt => opt.MapFrom(o => o.Id))
                .ForMember(p => p.precio,
                            opt => opt.MapFrom(o => Convert.ToString(o.Precio.Value, new CultureInfo("es-AR"))))
                .ForMember(P => P.esActivo,
                            opt => opt.MapFrom(o => o.EsActivo == true ? 1 : 0));

            CreateMap<VMProducto, Producto>()
                .ForMember(p => p.Id,
                            opt => opt.MapFrom(o => o.idProducto))
                .ForMember(p => p.Precio,
                            opt => opt.MapFrom(o => Convert.ToDecimal(o.precio, new CultureInfo("es-AR"))))
                .ForMember(p => p.EsActivo,
                            opt => opt.MapFrom(o => o.esActivo == 1 ? true : false));

            #endregion

            #region Imagenes

            CreateMap<ImagenesProducto, VMImagen>()
                .ForMember(p => p.idImagen,
                            opt => opt.MapFrom(o => o.Id))
                .ForMember(p => p.nombre,
                            opt => opt.MapFrom(o => o.Nombre))
                .ForMember(p => p.url,
                            opt => opt.MapFrom(o => o.UrlImagen));

            #endregion
        }
    }
}
