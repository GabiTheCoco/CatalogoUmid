const MODELO_BASE = {
    id: 0,
    nombreCategoria: "",
    esActivo: 1
}

let idCategoriaSeleccionada;

$(document).ready(function () {
    $("#modalData").modal("hide");
    const PRODUCTOS_CARRITO = JSON.parse(localStorage.getItem("productosCarrito")) || [];


    if (PRODUCTOS_CARRITO.length > 0) {
        $(".iconoCarrito").removeClass("fa-solid fa-cart-shopping");
        $(".iconoCarrito").addClass("fa-solid fa-cart-arrow-down iconoCarrito");
    }

    sessionStorage.setItem("ultimaPantalla", "Home/Categorias");

    actualizarCategorias();
})

function actualizarCategorias() {
    const orden = $(".filtroOrden").val();

    $.ajax({
        url: `/Home/MostrarCategoriasyProductos/${orden}`, 
        method: 'GET',
        dataType: 'JSON',
        success: function (datos) {
            $(".contenidoPrincipal").empty();

            if (datos != null) {
                mostrarCategorias(datos);
            } else {
                $(".seccionCategorias").append($("<p>").text("No existen productos con los filtros aplicados").addClass("align-self-center d-flex align-items-center justify-content-center labelError"));
            }
        },
        error: function (error) {
            console.error('Error al obtener los datos:', error);
        }
    });
}


function mostrarModal(modelo = MODELO_BASE) {

    $("#txtId").val(modelo.id);
    $("#txtNombre").val(modelo.nombreCategoria);
    $("#cboEstado").val(modelo.esActivo);

    $("#modalData").modal("show");
}

function mostrarCategorias(categorias) {

    for (const item of categorias) {

        // crear el contenedor para la categoría
        const categoriaContainer = $("<div>").addClass("categoriaContainer");

        // crear el contenedor para el div de opciones  y el botón de ver todos los productos
        const categoriaProductosContainer = $("<div>").addClass("categoriaProductosContainer");

        // crear el contenedor de opciones para el titulo y las opciones crud para esa categoria en especifico
        const divOpciones = $("<div>").addClass("divOpciones");

        // crear el título para la categoría
        const nombreCategoria = $("<h2>").addClass("tituloCategoria").text(item.nombreCategoria).attr("data-estadocategoria", item.esActivo);

        const opcionEditar = $("<i>").addClass("fas fa-pencil-alt opcionEditar").attr("data-nombrecategoria", `${item.nombreCategoria}`);
        const opcionEliminar = $("<i>").addClass("fas fa-trash-alt opcionEliminar");


        // crear el botón para ver todos los productos de la categoría específica
        const btnVerProductos = $("<button>")
            .attr("data-idcategoria", `${item.id}`)
            .addClass("btnVerProductos")
            .html("ver todo<i class='fa-solid fa-arrow-right iconoFlecha'></i>");

        divOpciones.append(nombreCategoria, opcionEditar, opcionEliminar);

        categoriaProductosContainer.append(divOpciones, btnVerProductos);

        // crear el contenedor para la hilera de productos, dentro del div de categoría
        const productosContainer = $("<div>").addClass("productosContainer");

        mostrarProductos(item.productos, productosContainer);

        // agregar los productos al contenedor de la categoría específica
        categoriaContainer.append(categoriaProductosContainer, productosContainer);

        // agregar el contenedor de la categoría al contenido principal
        $(".contenidoPrincipal").append(categoriaContainer);
    }

}

function mostrarProductos(productos, container) {

    if (productos != null) {


        for (const item of productos) {

            const producto = $("<div>").addClass("product").attr("data-idproducto", `${item.idProducto}`);

            const imagediv = $("<div>").addClass("imageDiv");

            const imgproducto = $("<img>").attr("src", item.imagenProducto.url).addClass("imgProduct");

            const name = $("<p>").addClass("name").text(item.nombre);

            const price = $("<p>").addClass("price").text("$" + item.precio);

            imagediv.append(imgproducto)

            producto.append(imagediv, name, price);

            container.append(producto);
        }

    } else {
        container.append($("<p>").text("No existen productos asociados a esta categoria").addClass("align-self-center labelError")).addClass("d-flex align-items-center justify-content-center");
    }


}

$(".seccionCategorias").on("click", ".opcionCrear", function () {
    mostrarModal();
})

$("#btnGuardar").click(function () {
    // Si el campo de nombre de categoria esta vacio, no se ejecuta
    if ($("#txtNombre").val().trim() == "") {
        toastr.warning("", "Debe completar el campo: Nombre");
        $("#txtNombre").focus();
        return;
    }

    const regex = /^[a-zA-Z\s]+$/;

    const modelo = structuredClone(MODELO_BASE);

    modelo["id"] = parseInt($("#txtId").val());
    modelo["nombreCategoria"] = $("#txtNombre").val();
    modelo["esActivo"] = $("#cboEstado").val();

    if (regex.test(modelo.nombreCategoria)) {

        $("#modalData").find("div.modal-content").LoadingOverlay("show");

        if (modelo.id == 0) {
            // entonces se crea una nueva categoria

            fetch("/Categoria/CrearCategoria", {
                method: "POST",
                headers: { "Content-Type": "application/json; charset=utf-8" },
                body: JSON.stringify(modelo)
            })
                .then(response => {
                    $("#modalData").find("div.modal-content").LoadingOverlay("hide");
                    return response.ok ? response.json() : Promise.reject(response);

                })
                .then(responseJSON => {

                    if (responseJSON.estado) {
                        $("#modalData").modal("hide");
                        swal("Listo!", "La Categoria fue creada", "success");
                        actualizarCategorias();
                    } else {
                        swal("Lo sentimos", responseJSON.mensaje, "error")
                    }
                })

        } else {
            // entonces se edita una categoria existente

            fetch("/Categoria/EditarCategoria", {
                method: "PUT",
                headers: { "Content-Type": "application/json; charset=utf-8" },
                body: JSON.stringify(modelo)
            })
                .then(response => {
                    $("#modalData").find("div.modal-content").LoadingOverlay("hide");
                    return response.ok ? response.json() : Promise.reject(response);
                })
                .then(responseJSON => {
                    if (responseJSON.estado) {
                        $("#modalData").modal("hide");
                        swal("Listo!", "La Categoria fue modificada", "success");
                        actualizarCategorias();
                    } else {
                        swal("Lo sentimos", responseJson.mensaje, "error")
                    }
                })
        }
    } else {
        toastr.warning("", "Ingrese un nombre válido, por favor");
        $("#txtNombre").val("");
        $("#txtNombre").focus();
        return;
    }

})

$(".seccionCategorias").on("change", ".filtroTipos", function () {
    const pantallaSeleccionada = $(this).val();
    window.location.href = `/Home/${pantallaSeleccionada}`;
});

$(".filtroOrden, .filtroEstado").on("change", function () {
    actualizarCategorias();
})

$(".seccionCategorias").on("click", ".opcionEditar", function (datos = MODELO_BASE) {

    datos.id = $(this).closest('.categoriaProductosContainer').find('.btnVerProductos').attr("data-idcategoria");
    datos.nombreCategoria = $(this).closest('.categoriaProductosContainer').find('.tituloCategoria').text();
    datos.esActivo = $(this).closest('.categoriaProductosContainer').find('.tituloCategoria').attr("data-estadocategoria");
    mostrarModal(datos);
})

$(".seccionCategorias").on("click", ".opcionEliminar", function (datos = MODELO_BASE) {
    const categoriaContainer = $(this).closest('.categoriaContainer');

    datos.id = parseInt($(this).closest('.categoriaProductosContainer').find('.btnVerProductos').data("idcategoria"))
    datos.nombreCategoria = $(this).closest('.categoriaProductosContainer').find('.tituloCategoria').text();
    datos.esActivo = $(this).closest('.categoriaProductosContainer').find('.tituloCategoria').data("estadocategoria");

    swal({
        title: "¿Está seguro?",
        text: `¿Desea realizar un borrado lógico de la Categoría "${datos.nombreCategoria}"?`,
        type: "warning",
        showCancelButton: true,
        confirmButtonClass: "btn-danger",
        cancelButtonClass: "btn btn-primary",
        confirmButtonText: "Borrado físico",
        cancelButtonText: "Borrado lógico",
        closeOnConfirm: false,
        closeOnCancel: true
    },

        function (borradoFisico) {

            if (borradoFisico) {

                swal({
                    title: "¿Está seguro?",
                    text: `¿Desea eliminar permanentemente la Categoría "${datos.nombreCategoria}" de la base de datos?`,
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonClass: "btn-danger",
                    cancelButtonClass: "btn btn-primary",
                    confirmButtonText: "Sí, Eliminar",
                    cancelButtonText: "No, cancelar",
                    closeOnConfirm: false,
                    closeOnCancel: true
                },

                    function (respuesta) {
                        if (respuesta) {
                            $(".showSweetAlert").LoadingOverlay("show");

                            fetch(`/Categoria/EliminarCategoria?Id=${datos.id}`, {
                                method: "DELETE"
                            })
                                .then(response => {
                                    $(".showSweetAlert").LoadingOverlay("hide");
                                    categoriaContainer.remove();
                                    return response.ok ? response.json() : Promise.reject(response);
                                })
                                .then(responseJSON => {
                                    if (responseJSON.estado) {
                                        $("#modalData").modal("hide");

                                        swal("Listo!", "La Categoría fue eliminada", "success");
                                    } else {
                                        swal("Lo sentimos", responseJSON.mensaje, "error");
                                    }
                                })
                        }
                    });
            } else {

                if (datos.esActivo == 0) {
                    toastr.info("", "La Categoría seleccionada está oculta actualmente");
                } else {
                    datos.esActivo = 0;

                    fetch("/Categoria/EditarCategoria", {
                        method: "PUT",
                        headers: { "Content-Type": "application/json; charset=utf-8" },
                        body: JSON.stringify(datos)
                    })
                        .then(response => {
                            $("#modalData").find("div.modal-content").LoadingOverlay("hide");
                            return response.ok ? response.json() : Promise.reject(response);
                        })
                        .then(responseJSON => {
                            if (responseJSON.estado) {
                                $("#modalData").modal("hide");
                                toastr.info("", "La categoría se ocultò al usuario correctamente!");
                                actualizarCategorias();
                            } else {
                                toastr.error("Lo sentimos", responseJson.mensaje);
                            }
                        })
                }

            }



        });
});

$(".seccionCategorias").on("click", ".product", function () {
    const idProducto = $(this).data("idproducto");
    sessionStorage.setItem("idProducto", idProducto);
    sessionStorage.removeItem("valorBusqueda");
    window.location.href = "/Producto/pantallaProducto";
})

$(".seccionCategorias").on("click", ".btnVerProductos", function () {
    const idCategoria = $(this).data("idcategoria");

    const nombreCategoria = $(this).closest('.categoriaProductosContainer').find('.tituloCategoria').text();
    sessionStorage.removeItem("valorBusqueda");
    sessionStorage.setItem("idCategoria", idCategoria);
    sessionStorage.setItem("nombreCategoria", nombreCategoria);
    window.location.href = "/Categoria/pantallaCategoria";
})

$(".seccionCategorias").on("change", ".filtroTipos", function () {
    const pantallaSeleccionada = $(this).val();
    window.location.href = `/Home/${pantallaSeleccionada}`;
});



