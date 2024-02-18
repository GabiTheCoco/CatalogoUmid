
$(document).ready(function () {
    const PRODUCTOS_CARRITO = JSON.parse(localStorage.getItem("productosCarrito")) || [];


    if (PRODUCTOS_CARRITO.length > 0) {
        $(".iconoCarrito").removeClass("fa-solid fa-cart-shopping");
        $(".iconoCarrito").addClass("fa-solid fa-cart-arrow-down iconoCarrito");
    }

    actualizarCatalogo();
})

function actualizarCatalogo() {
    var id = sessionStorage.getItem("idCategoria");
    const orden = $(".filtroOrden").val();
    const estado = $(".filtroEstado").val();

    console.log(orden);
    console.log(estado);

    $.ajax({
        url: `/MostrarProductosCategoria/${id}/${orden}/${estado}`,
        method: 'GET',
        dataType: 'JSON',
        success: function (datos) {
            sessionStorage.setItem("ultimaPantalla", "Categoria/pantallaCategoria");
            $(".productosContainerCategoria").empty();
            mostrarProductosCategoria(datos.data);
        },
        error: function (error) {
            console.error('Error al obtener los datos:', error);
        }
    });
}

function mostrarProductosCategoria(productos) {
    const productosContainer = $(".productosContainerCategoria");
    const pantallaCategoria = $(".pantallaCategoria");
    const nombreCategoria = sessionStorage.getItem("nombreCategoria");

    $(".tituloCategoria").text(nombreCategoria);
    $(".labelError").remove();

    if (productos.length != 0) {
        mostrarProductos(productos, productosContainer);
    } else {
        pantallaCategoria.append($("<p>").text("No hay productos coincidentes con los filtros seleccionados").addClass("align-self-center justify-self-center labelError"));
    }
}

function mostrarProductos(productos, container) {

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

$(".pantallaCategoria").on("click", ".btnVolver", function () {
    window.location.href = `/Home/Categorias`;
})

$(".filtroOrden, .filtroEstado").on("change", function () {
    actualizarCatalogo();
})

$(".pantallaCategoria").on("click", ".product", function () {
    const idProducto = $(this).data("idproducto");
    sessionStorage.setItem("idProducto", idProducto);

    window.location.href = "/Producto/pantallaProducto";
})

