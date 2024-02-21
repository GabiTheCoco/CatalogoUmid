const MODELO_BASE = {
    idProducto: 0,
    nombre: "",
    marca: "",
    descripcion: '',
    idCategoria: 0,
    stock: "",
    precio: "",
    esActivo: 1
}

const MODELO_CARRITO = {
    idProducto: 0,
    nombre: "",
    marca: "",
    idCategoria: 0,
    stock: "",
    precio: "",
    esActivo: 1,
    urlImagen: "",
    cantidadProducto: 1
}

$(document).ready(function () {
    $("#modalData").modal("hide");

    const PRODUCTOS_CARRITO = JSON.parse(localStorage.getItem("productosCarrito")) || "";

    if (PRODUCTOS_CARRITO.length > 0) {
        $(".iconoCarrito").removeClass("fa-solid fa-cart-shopping");
        $(".iconoCarrito").addClass("fa-solid fa-cart-arrow-down iconoCarrito");
    }

    const idProducto = sessionStorage.getItem("idProducto");
    actualizarProducto(idProducto);
    actualizarListaCategorias();

    const Token = sessionStorage.getItem("Token") || null;


    if (Token != null) {
        $(".divOpciones").removeClass("oculto");
    }

})

function mostrarModal(modelo = MODELO_BASE) {
    $("#txtId").val(modelo.idProducto);
    $("#txtNombre").val(modelo.nombre);
    $("#txtMarca").val(modelo.marca);
    $('#txtDescripcion').val(modelo.descripcion);
    $("#cboCategoria").val(modelo.idCategoria == 0 ? $("#cboCategoria option:first").val() : modelo.idCategoria);
    $("#txtStock").val(modelo.stock);
    $("#txtPrecio").val(modelo.precio);
    $("#cboEstado").val(parseInt(modelo.esActivo));

    const Token = sessionStorage.getItem("Token") || null;

    if (Token != null) {
        $("#modalData").modal("show");
    }
    else {
        toastr.warning("No se tiene autorización para llevar a cabo esta acción, inicie sesión por favor");
    }
}

function actualizarProducto(id) {
    $.ajax({
        url: `/MostrarProducto/${id}`,
        method: 'GET',
        dataType: 'JSON',
        success: function (datos) {
            $(".bloqueImagenes").empty();
            agregarInfo(datos.data);
            cambiarImgGrande();
        },
        error: function (error) {
            console.error('Error al obtener los datos:', error);
        }
    })
}

function actualizarListaCategorias() {
    fetch("/Categoria/ListaCategorias")

        .then(response => {
            return response.ok ? response.json() : Promise.reject(response);
        })

        .then(responseJson => {
            if (responseJson.length > 0) {
                responseJson.forEach((item) => {
                    $("#cboCategoria").append($("<option>").val(item.id).text(item.nombreCategoria))
                })
            }
        });
}

function cambiarImgGrande() {
    const imgGrande = $(".imgGrande");

    $(".imgRelacionadas").each(function () {
        $(this).on("click", function (event) {
            $(".imgRelacionadas").removeClass("img-active");
            $(this).addClass("img-active");
            imgGrande.attr("src", $(this).attr("src"));
        });
    });

    // Resetear sombras de imágenes relacionadas
    $(".imgRelacionadas").removeClass("img-active");
    $(".imgRelacionadas").first().addClass("img-active");
}

function agregarInfo(producto) {

    console.log(producto);
    $(".nombreProducto").text(producto.nombre).attr("data-nombremarca", producto.marca).attr("data-idcategoria", producto.idCategoria).attr("data-estado", producto.esActivo);
    $(".descripcionProducto").text(producto.descripcion);
    $(".stockProducto").text("Stock: " + producto.stock);;
    $(".precioProducto").text("$ " + producto.precio);
    $(".textCantidadProducto").text("1");
    $(".imgGrande").attr("src", producto.imagenesRelacionadas[0].url);

    let cont = 1;
    $(".bloqueImagenes").append($("<p>").text("+").addClass("agregarImagen oculto"))

    producto.imagenesRelacionadas.forEach((imagen) => {
        const contentImg = $("<contentImg>").addClass("contentImg");

        const divImg = $(".divImg")
        const itemImg = $("<img>").attr("src", imagen.url).addClass("imgRelacionadas").attr("data-idimagen", imagen.idImagen);


        const Token = sessionStorage.getItem("Token") || null;

        divImg.append(itemImg);

        if (Token != null) {
            const opciones = $("<div>").addClass("opcionesImg");
            const editarImagen = $("<i>").addClass("editarImagen fas fa-pencil-alt");
            const eliminarImagen = $("<i>").addClass("eliminarImagen fas fa-trash-alt");

            opciones.append(editarImagen, eliminarImagen);

            contentImg.append(itemImg, opciones);
            $(".agregarImagen").removeClass("oculto");
        } else {
            contentImg.append(itemImg);
        }

        if (cont == 4)
            $(".agregarImagen").remove();

        $(".bloqueImagenes").append(contentImg);
        cont++;
    })
}


$(".pantallaProducto").on("click", ".btnVolver", function () {
    const pantallaAnterior = sessionStorage.getItem("ultimaPantalla");
    sessionStorage.removeItem("valorBusqueda");
    window.location.href = `/${pantallaAnterior}`;
})


$(".pantallaProducto").on("click", ".iconoMenos" , function () {
    const textCantidad = $(".textCantidadProducto");
    var cantidadActual = parseInt(textCantidad.text());

    if (!isNaN(cantidadActual) && cantidadActual > 1) {
        cantidadActual--;
        textCantidad.text(cantidadActual);
    }
    console.log(cantidadActual);
})

$(".pantallaProducto").on("click", ".iconoMas", function () {

    const textCantidad = $(".textCantidadProducto");

    var stockProducto = parseInt($(".stockProducto").text().replace("Stock: ", ""));

    var cantidadActual = parseInt(textCantidad.text());

    if (!isNaN(cantidadActual) && cantidadActual < stockProducto) {
        cantidadActual++;
        textCantidad.text(cantidadActual);
    }
})

$(".pantallaProducto").on("click", ".editarImagen", function () {
    const idProducto = sessionStorage.getItem("idProducto");
    const idImagen = $(this).closest(".contentImg").find(".imgRelacionadas").data("idimagen");

    const Token = sessionStorage.getItem("Token") || null;

    if (Token != null) {
        $("#txtId").val(idImagen);
        $("#txtImagen").val("");
        $("#modalImg").modal("show");
    } else {
        toastr.warning("No se tiene autorización para llevar a cabo esta acción, inicie sesión por favor");
    }
})

$(".pantallaProducto").on("click", ".eliminarImagen", function () {
    const idProducto = sessionStorage.getItem("idProducto");
    const id = parseInt($(this).closest(".contentImg").find(".imgRelacionadas").data("idimagen"));

    const Token = sessionStorage.getItem("Token") || null;

    if (Token != null) {

        const headers = new Headers();

        headers.append("Authorization", Token);

        swal({
            title: "¿Está seguro?",
            text: `¿Eliminar la imagen seleccionada?`,
            type: "warning",
            showCancelButton: true,
            confirmButtonClass: "btn-danger",
            confirmButtonText: "Si, Eliminar",
            cancelButtonText: "No, cancelar",
            closeOnConfirm: false,
            closeOnCancel: true
        },

            function (respuesta) {

                if (respuesta) {
                    $(".showSweetAlert").LoadingOverlay("show");

                    fetch(`/EliminarImagen/${id}`, {
                        method: "DELETE",
                        headers: headers
                    })
                        .then(response => {
                            $(".showSweetAlert").LoadingOverlay("hide");
                            return response.ok ? response.json() : Promise.reject(response);
                        })
                        .then(responseJSON => {
                            if (responseJSON.estado) {
                                swal("!Imagen eliminada con exito!", responseJSON.mensaje, "success");
                                actualizarProducto(idProducto);
                            } else {
                                swal("Lo sentimos", responseJSON.mensaje, "error")
                            }
                        })
                }

            });
    }
    else {
        toastr.warning("No se tiene autorización para llevar a cabo esta acción, inicie sesión por favor");
    }

    
})

$(".pantallaProducto").on("click", ".agregarImagen", function () {
    const Token = sessionStorage.getItem("Token") || null;

    if (Token != null) {
        $("#txtId").val(0);
        $("#modalImg").modal("show");
    }
    else {
        toastr.warning("No se tiene autorización para llevar a cabo esta acción, inicie sesión por favor");
    }
})

$("#btnEditarImg").click(function () {
    const id = sessionStorage.getItem("idProducto");

    const inputFoto = $("#txtImagen")[0];
    const idImagen = $("#txtId").val();

    if (inputFoto.files.length != 0) {
        const formData = new FormData;

        formData.append("foto", inputFoto.files[0]);

        const Token = sessionStorage.getItem("Token") || null;

        const headers = new Headers();

        headers.append("Authorization", Token);

        $("#modalImg").find("div.modal-content").LoadingOverlay("show");

        if (idImagen == 0) {
            fetch(`/AgregarImagen/${id}`, {
                method: "POST",
                headers: headers,
                body: formData
            })
                .then(response => {
                    $("#modalImg").find("div.modal-content").LoadingOverlay("hide");
                    return response.ok ? response.json() : Promise.reject(response);
                })
                .then(responseJSON => {
                    if (responseJSON.estado) {
                        swal("Imagen agregada con exito", responseJSON.mensaje, "success");
                        $("#modalImg").modal("hide");
                        actualizarProducto(id);
                    } else {
                        swal("Lo sentimos", responseJSON.mensaje, "error");
                    }
                })
        } else {

            fetch(`/EditarImagen/${idImagen}`, {
                method: "PUT",
                headers: headers,
                body: formData
            })
                .then(response => {
                    $("#modalImg").find("div.modal-content").LoadingOverlay("hide");
                    return response.ok ? response.json() : Promise.reject(response);
                })
                .then(responseJSON => {
                    if (responseJSON.estado) {
                        swal("Imagen editada con exito", responseJSON.mensaje, "success");
                        $("#modalImg").modal("hide");
                        actualizarProducto(id);
                    } else {
                        swal("Lo sentimos", responseJSON.mensaje, "error");
                    }
                })
        }
    } else {
        toastr.warning("", "Seleccione una foto, por favor")
    }

    
})


$(".pantallaProducto").on("click", ".btnEditar", function (datos = MODELO_BASE) {
    const idProd = parseInt(sessionStorage.getItem("idProducto"));

    datos.idProducto = idProd;
    datos.nombre = $(".nombreProducto").text();
    datos.marca = $(".nombreProducto").attr("data-nombremarca");
    datos.descripcion = $(".descripcionProducto").text();
    datos.idCategoria = parseInt($(".nombreProducto").attr("data-idcategoria"));
    datos.stock = parseInt($(".stockProducto").text().replace("Stock: ", ""));
    datos.precio = parseInt($(".precioProducto").text().replace("$ ", ""));
    datos.esActivo = $(".nombreProducto").attr("data-estado");

    mostrarModal(datos);
})

$("#btnGuardar").click(function () {
    const inputs = $('.input-validar').serializeArray();
    const inputs_nulos = inputs.filter((item) => item.value.trim() === "" || item.value === null);

    if (inputs_nulos.length > 0) {
        const mensaje = `Debe completar el campo: "${inputs_nulos[0].name}"`
        toastr.warning("", mensaje);
        $(`input[name="${inputs_nulos[0].name}"]`).focus();

        return;
    }

    const regexDefault = /^(?=.*[a-z])[A-Za-zzáéíóúñÑ0-9\d\s]{2,}$/;
    const regexDesc = /^[A-Za-záéíóúñÑ\d\s.,!€?'~*+&-_·":@|{}´$#$%()=¿]+$/;
    const regexNums = /^(?=.*\d)\d+$/;

    const modelo = structuredClone(MODELO_BASE);

    modelo["idProducto"] = $("#txtId").val();
    modelo["nombre"] = $("#txtNombre").val();
    modelo["marca"] = $("#txtMarca").val();
    modelo['descripcion'] = $('#txtDescripcion').val();
    modelo["idCategoria"] = $("#cboCategoria").val();
    modelo["stock"] = $("#txtStock").val();
    modelo["precio"] = $("#txtPrecio").val();
    modelo["esActivo"] = $("#cboEstado").val();

    console.log(regexDefault.test(modelo.nombre));
    console.log(regexDefault.test(modelo.marca))
    console.log(regexDesc.test(modelo.descripcion))
    console.log(regexNums.test(modelo.stock))
    console.log(regexNums.test(modelo.precio))

    if (regexDefault.test(modelo.nombre) && regexDefault.test(modelo.marca) && regexDesc.test(modelo.descripcion) && regexNums.test(modelo.stock) && regexNums.test(modelo.precio)) {
        const formData = new FormData;

        formData.append("modelo", JSON.stringify(modelo));

        const Token = sessionStorage.getItem("Token") || null;

        const headers = new Headers();

        headers.append("Authorization", Token);

        $("#modalData").find("div .modal-content").LoadingOverlay("show");


        fetch("/Producto/Editar", {
            method: "PUT",
            headers: headers,
            body: formData
        })
            .then(response => {
                $("#modalData").find("div .modal-content").LoadingOverlay("hide");

                return response.ok ? response.json() : Promise.reject(response);
            })
            .then(responseJSON => {
                if (responseJSON.estado) {
                    $("#modalData").modal("hide");
                    swal("Listo!", "El producto fue editado", "success");
                    actualizarProducto(modelo.idProducto);
                } else {
                    swal("El producto no fue editado", "error");
                }
            })
    } else {
        toastr.warning("", "Ingresar valores válidos en los campos correspondientes, por favor");
    }


    

})


$(".pantallaProducto").on("click", ".btnEliminar", function (datos = MODELO_BASE) {
    const idProd = sessionStorage.getItem("idProducto");

    datos.idProducto = parseInt(idProd);
    datos.nombre = $(".nombreProducto").text();
    datos.esActivo = parseInt($(".nombreProducto").data("esactivo"));


    const Token = sessionStorage.getItem("Token") || null;

    const headers = new Headers();

    headers.append("Authorization", Token);

    if (Token != null) {
        swal({
            title: "¿Está seguro?",
            text: `¿Desea realizar un borrado lógico del producto "${datos.nombre}"?`,
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
                        text: `Eliminar el Producto "${datos.nombre}"`,
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonClass: "btn-danger",
                        cancelButtonClass: "btn btn-primary",
                        confirmButtonText: "Si, Eliminar",
                        cancelButtonText: "No, cancelar",
                        closeOnConfirm: false,
                        closeOnCancel: true
                    },

                        function (respuesta) {

                            if (respuesta) {
                                $(".showSweetAlert").LoadingOverlay("show");

                                fetch(`/Eliminar/${datos.idProducto}`, {
                                    method: "DELETE",
                                    headers: headers
                                })
                                    .then(response => {
                                        $(".showSweetAlert").LoadingOverlay("hide");
                                        return response.ok ? response.json() : Promise.reject(response);
                                    })
                                    .then(responseJSON => {
                                        if (responseJSON.estado) {
                                            $("#modalData").modal("hide");
                                            window.location.href = "/Home/Productos";
                                            toastr.success("", "El producto fue eliminado correctamente!")
                                        } else {
                                            swal("Lo sentimos", responseJSON.mensaje, "error")
                                        }
                                    })
                            }

                        });

                } else {

                    if (datos.esActivo == 0) {
                        toastr.info("", "El Producto seleccionado está oculto actualmente");
                    } else {

                        datos.esActivo = 0;

                        formData = new FormData();

                        formData.append("modelo", datos);

                        fetch("/Producto/Editar", {
                            method: "PUT",
                            headers: headers,
                            body: formData
                        })
                            .then(response => {
                                $("#modalData").find("div .modal-content").LoadingOverlay("hide");

                                return response.ok ? response.json() : Promise.reject(response);
                            })
                            .then(responseJSON => {
                                if (responseJSON.estado) {
                                    $("#modalData").modal("hide");
                                    toastr.info("", "El Producto se ocultó al usuario correctamente!");
                                    actualizarProducto($("#txtId").val());
                                } else {
                                    toastr.error("", "El Producto no se pudo ocultar correctamente");
                                    console.log("Lo sentimos", responseJSON.mensaje);
                                }
                            })
                    }

                }

            });
    }
    else {
        toastr.warning("No se tiene autorización para llevar a cabo esta acción, inicie sesión por favor");
    }

})

$(".btnCarrito").click(function () {

    const datos = MODELO_CARRITO;

    const idProd = parseInt(sessionStorage.getItem("idProducto"));

    const PRODUCTOS_CARRITO = JSON.parse(localStorage.getItem("productosCarrito")) || [];

    if (PRODUCTOS_CARRITO.length === 0 || !PRODUCTOS_CARRITO.some(producto => producto.idProducto === idProd)) {

        datos.idProducto = idProd;
        datos.nombre = $(".nombreProducto").text();
        datos.marca = $(".nombreProducto").data("nombremarca");
        datos.idCategoria = parseInt($(".nombreProducto").data("idcategoria"));
        datos.stock = parseInt($(".stockProducto").text().replace("Stock: ", ""));
        datos.precio = parseInt($(".precioProducto").text().replace("$ ", ""));
        datos.esActivo = parseInt($(".nombreProducto").data("esactivo"));
        datos.urlImagen = $(".imgGrande").attr("src");
        datos.cantidadProducto = parseInt($(".textCantidadProducto").text());

        PRODUCTOS_CARRITO.push(datos);

        localStorage.setItem("productosCarrito", JSON.stringify(PRODUCTOS_CARRITO));


        $(".iconoCarrito").removeClass("fa-solid fa-cart-shopping");
        $(".iconoCarrito").addClass("fa-solid fa-cart-arrow-down");

        toastr.success("!El producto fue agregado al carrito con éxito!");
    } else {
        toastr.info("Este producto ya existe dentro del carrito de compras, seleccione otro por favor")
    }

});