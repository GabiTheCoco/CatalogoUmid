const MODELO_BASE = {
    idProducto: 0,
    nombre: "",
    marca: "",
    descripcion: "",
    idCategoria: 0,
    stock: "",
    precio: "",
    esActivo: 1
}

$(document).ready(function () {

    const PRODUCTOS_CARRITO = JSON.parse(localStorage.getItem("productosCarrito")) || [];


    if (PRODUCTOS_CARRITO.length > 0) {
        $(".iconoCarrito").removeClass("fa-solid fa-cart-shopping");
        $(".iconoCarrito").addClass("fa-solid fa-cart-arrow-down iconoCarrito");
    }

    const valorBusqueda = sessionStorage.getItem("valorBusqueda") || "";

    console.log("el valor de la busqueda es: " + valorBusqueda);

    $(".busquedaInput").val(valorBusqueda);


    sessionStorage.setItem("ultimaPantalla", "Home/Productos");
    
    actualizarProductos();
    actualizarListaCategorias();
})

function actualizarProductos() {
    const orden = $(".filtroOrden").val();
    const estado = $(".filtroEstado").val();
    const input = sessionStorage.getItem("valorBusqueda") || $(".busquedaInput").val();

    $.ajax({
        url: `/Home/MostrarProductos/${orden}/${estado}?input=${encodeURIComponent(input)}`,
        method: 'GET',
        dataType: 'JSON',
        success: function (datos) {
            $(".contenidoPrincipal").empty();

            if (datos != null) {
                $(".labelError").remove();
                mostrarProductos(datos, $(".contenidoPrincipal"));
            } else {
                $(".seccionProductos").append($("<p>").text("No existen productos con los filtros aplicados").addClass("align-self-center d-flex align-items-center justify-content-center labelError"));
            }
        },
        error: function (error) {
            toastr.error("Error al obtener los productos buscados");
            console.log(error);
        }
    })
}

function actualizarListaCategorias() {
    fetch("/Categoria/ListaCategorias")

        .then(response => {
            return response.ok ? response.json() : Promise.reject(response);
        })

        .then(responseJson => {
            if (responseJson != null) {
                responseJson.forEach((item) => {
                    $("#cboCategoria").append($("<option>").val(item.id).text(item.nombreCategoria))
                })
            } else {
                $("#cboCategoria").append($("<option>").val(0).text("No existen categorias"));
            }

        });
}

function mostrarModal(modelo = MODELO_BASE) {
    $("#txtId").val(modelo.Id);
    $("#txtNombre").val(modelo.nombre);
    $("#txtMarca").val(modelo.marca);
    $("#txtDescripcion").val(modelo.descripcion);
    $("#cboCategoria").val(modelo.idCategoria == 0 ? $("#cboCategoria option:first").val() : modelo.idCategoria);
    $("#txtStock").val(modelo.stock);
    $("#txtPrecio").val(modelo.precio);
    $("#cboEstado").val(modelo.esActivo);
    $("#txtImagen").val("");


    $("#modalData").modal("show");
}
function mostrarProductos(productos, container) {

    console.log(productos);


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
}

$(".filtroOrden, .filtroEstado").on("change", function () {
    actualizarProductos();
})

$(".seccionProductos").on("click", ".opcionCrear", function () {
    mostrarModal();
})

$("#btnGuardar").click(function () {
    const inputs = $(".input-validar").serializeArray();
    const inputs_nulos = inputs.filter((item) => item.value.trim() === "" || item.value === null);

    const regexDefault = /^(?=.*[a-z])[A-Za-z0-9\d\s]{2,}$/;
    const regexDesc = /^[A-Za-záéíóúñÑ\d\s.,!€?'~*+&-_·":@|{}´$#$%()=¿]+$/;
    const regexNums = /^(?=.*\d)\d+$/;

    if (inputs_nulos.length > 0) {
        const mensaje = `Debe completar el campo: "${inputs_nulos[0].name}"`
        toastr.warning("", mensaje);
        $(`input[name="${inputs_nulos[0].name}"]`).focus();

        return;
    }

    const modelo = structuredClone(MODELO_BASE);

    modelo["nombre"] = $("#txtNombre").val();
    modelo["marca"] = $("#txtMarca").val();
    modelo["descripcion"] = $("#txtDescripcion").val();
    modelo["idCategoria"] = $("#cboCategoria").val();
    modelo["stock"] = $("#txtStock").val();
    modelo["precio"] = $("#txtPrecio").val();
    modelo["esActivo"] = $("#cboEstado").val();

    console.log(regexDefault.test(modelo.nombre));
    console.log(regexDefault.test(modelo.marca));
    console.log(regexDesc.test(modelo.descripcion));
    console.log(regexNums.test(modelo.stock));
    console.log(regexNums.test(modelo.precio));


    if (regexDefault.test(modelo.nombre) && regexDefault.test(modelo.marca) && regexDesc.test(modelo.descripcion)
        && regexNums.test(modelo.stock) && regexNums.test(modelo.precio))
    {
        const inputFotos = $("#txtImagen");

        const formData = new FormData;

        if (inputFotos[0].files.length > 0) {
            for (let i = 0; i < inputFotos[0].files.length; i++) {
                formData.append("fotos", inputFotos[0].files[i]);
            }
        }

        formData.append("modelo", JSON.stringify(modelo));

        $("#modalData").find("div .modal-content").LoadingOverlay("show");

        if (modelo.idProducto == 0) {

            fetch("/Producto/CrearProducto", {
                method: "POST",
                body: formData
            })
                .then(response => {
                    $("#modalData").find("div .modal-content").LoadingOverlay("hide");

                    return response.ok ? response.json() : Promise.reject(response);
                })
                .then(responseJSON => {
                    if (responseJSON.estado) {
                        $("#modalData").modal("hide");
                        swal("Listo!", "El producto fue creado", "success");
                        actualizarProductos();
                    } else {
                        swal("El producto no fue creado", "error");
                        console.log("el producto no se pudo crear!");
                    }
                })
        }
    } else {
        toastr.warning("", "Ingresar valores válidos en los campos correspondientes, por favor");
    }
})

$(".seccionProductos").on("change", ".filtroTipos", function () {
    const pantallaSeleccionada = $(this).val();
    sessionStorage.removeItem("valorBusqueda");
    window.location.href = `/Home/${pantallaSeleccionada}`;
});

$(".contenidoPrincipal").on("click", ".product", function () {
    const idProducto = $(this).data("idproducto");
    sessionStorage.setItem("idProducto", idProducto);

    window.location.href = "/Producto/pantallaProducto";
})

