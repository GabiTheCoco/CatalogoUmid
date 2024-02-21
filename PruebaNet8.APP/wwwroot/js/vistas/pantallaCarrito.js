
$(document).ready(function () {

    let PRODUCTOS_CARRITO = JSON.parse(localStorage.getItem("productosCarrito")) || [];


    if (PRODUCTOS_CARRITO.length > 0) {
        $(".iconoCarrito").removeClass("fa-solid fa-cart-shopping");
        $(".iconoCarrito").addClass("fa-solid fa-cart-arrow-down iconoCarrito");
    }

    const arrayIds = JSON.stringify(PRODUCTOS_CARRITO.map(item => parseInt(item.idProducto))) || null;


    $.ajax({
        url: `/Carrito/ConsultarExistencia/`,
        method: 'POST',
        data: arrayIds,
        contentType: "application/json",
        success: function (datos) {
            console.log(datos.objeto)

            datos.objeto.forEach((item) => {
                PRODUCTOS_CARRITO = PRODUCTOS_CARRITO.filter(p => p.idProducto != item);
                console.log(PRODUCTOS_CARRITO);
            })

            crearTarjetas(PRODUCTOS_CARRITO);
            crearResumen(PRODUCTOS_CARRITO);
        },
        error: function (error) {
            toastr.error("Error al obtener los productos buscados");
            console.log(error);
        }
    })

})


function crearTarjetas(productos) {
    const seccionProductos = $(".seccionProductos");

    if (productos.length != 0) {
        for (let i = 0; i < productos.length; i++) {

            const tarjetaProducto = $("<div>").addClass("tarjetaProducto").attr("data-idproducto", productos[i].idProducto);;
            const divImagen = $("<div>").addClass("divImagen");
            const imgProducto = $("<img>").attr("src", productos[i].urlImagen);

            const infoProducto = $("<div>").addClass("infoProducto");

            const divArriba = $("<div>").addClass("divArriba");
            //const divAbajo = $("<div>").addClass("divAbajo"); 
            const nombreProducto = $("<p>").addClass("nombreProducto").text(productos[i].nombre);
            const precioProducto = $("<p>").addClass("precioProducto").text("$ " + productos[i].precio);
            const stockProducto = $("<p>").addClass("stockProducto").text("Stock: " + productos[i].stock);

            //divArriba.append(nombreProducto precioProducto, , stockProducto);

            const divOpciones = $("<div>").addClass("divOpciones ");
            const opcionEliminar = $("<i>").addClass("btnEliminar fas fa-trash-alt");

            const divCantidad = $("<div>").addClass("divCantidad");
            const iconoMas = $("<i>").addClass("fa-solid fa-plus iconoMas");
            const iconoMenos = $("<i>").addClass("fa-solid fa-minus iconoMenos");
            const textCantidad = $("<p>").addClass("cantidadProducto").text(productos[i].cantidadProducto);


            divCantidad.append(iconoMenos, textCantidad, iconoMas);
            divOpciones.append(divCantidad, opcionEliminar);
            infoProducto.append(nombreProducto, precioProducto, stockProducto);
            divImagen.append(imgProducto);
            tarjetaProducto.append(divImagen, infoProducto, divOpciones);

            seccionProductos.append(tarjetaProducto);
        }
    } else {
        const aviso = $("<p>").text("No existen productos dentro del carrito.")
        seccionProductos.append(aviso);
    }
    
}

function crearResumen(productos) {
    const contenedor = $(".divCampos");
    

    if (productos.length != 0) {
        var precioFinalResumen = 0;
        const totalResumen = $(".txtTotalResumen");

        for (let i = 0; i < productos.length; i++) {
            var precioFinalProducto = productos[i].cantidadProducto * productos[i].precio;

            const resumenProducto = $("<div>").addClass("resumenProducto");
            const divTexto = $("<div>").addClass("divTexto");
            const nombreProducto = $("<p>").addClass("entradaProducto").text(productos[i].nombre);
            const cantidadProducto = $("<p>").addClass("cantProducto").text(" x " + productos[i].cantidadProducto).attr("data-idproducto", productos[i].idProducto);
            const precioProducto = $("<p>").addClass("totalProducto").text("$ " + precioFinalProducto).attr("data-idproducto", productos[i].idProducto);

            precioFinalResumen += precioFinalProducto;

            divTexto.append(nombreProducto, cantidadProducto)
            resumenProducto.append(divTexto, precioProducto);

            contenedor.append(resumenProducto);
        }

        totalResumen.text("$ " + precioFinalResumen);
    } else {
        const aviso = $("<p>").text("No existen productos dentro del carrito.")
        contenedor.append(aviso);
    }
    
}

$(".pantallaCarrito").on("click", ".btnVolver", function () {
    const ultimaPantalla = sessionStorage.getItem("ultimaPantalla");


    window.location.href = `/${ultimaPantalla}`;
})

$(".pantallaCarrito").on("click", ".btnPedido", function () {

    const texto = $(".seccionPedido").text();


    let textoModificado = texto
        // Eliminar "Limpiar Carrito" y "Hacer Pedido"
        .replace(/Limpiar Carrito|Hacer Pedido|Resumen de pedido/g, '')
        // Reemplazar cada línea de producto
        .replace(/([\w\s]+) x (\d+)\$ (\d+)/g, '$1 x $2 ----> $ $3\n')
        .replace(/Total: \$(\d+)/g, 'Total: $ $1')
        .replace(/\s+/g, ' ') // Eliminar espacios adicionales
        .replace(/(Resumen de pedido\s+\$\s\d+)/g, '$1\n') // Agregar salto de línea después de cada bloque principal
        .replace(/(Total:\s+\$\s\d+)/g, '\n\n$1');

    console.log(textoModificado);

    const consultaCodificada = encodeURIComponent("Buen día! Me comunico para consultar la disponibilidad de los siguientes productos: \n\n" + textoModificado);


    window.open(`https://api.whatsapp.com/send/?phone=5493426123703&text=${consultaCodificada}&type=phone_number & app_absent=0`, "_blank");
})

$(".seccionProductos").on("click", ".btnEliminar", function () {

    const idProd = parseInt($(this).closest(".tarjetaProducto").data("idproducto"));

    const PRODUCTOS_CARRITO = JSON.parse(localStorage.getItem("productosCarrito"));

    swal({
        title: "¿Está seguro?",
        text: `¿Eliminar el producto seleccionado del carrito?`,
        type: "warning",
        showCancelButton: true,
        confirmButtonClass: "btn-danger",
        confirmButtonText: "Si, Eliminar",
        cancelButtonText: "No, cancelar",
        closeOnConfirm: true,
        closeOnCancel: true
    },

        function (respuesta) {

            if (respuesta) {
                const PRODUCTOS_CARRITO_ACTUALIZADO = PRODUCTOS_CARRITO.filter(producto => producto.idProducto != idProd);

                localStorage.setItem("productosCarrito", JSON.stringify(PRODUCTOS_CARRITO_ACTUALIZADO));

                $(".iconoCarrito").removeClass("fa-solid fa-cart-arrow-down");
                $(".iconoCarrito").addClass("fa-solid fa-cart-shopping");

                $(".seccionProductos").empty();
                $(".divCampos").empty();
                $(".txtTotalResumen").text("$ 0");


                crearTarjetas(PRODUCTOS_CARRITO_ACTUALIZADO);
                crearResumen(PRODUCTOS_CARRITO_ACTUALIZADO);
            }

        }
    );
})

$(".pantallaCarrito").on("click", ".btnLimpiar", function () {

    swal({
        title: "¿Está seguro?",
        text: `¿Eliminar los productos del carrito?`,
        type: "warning",
        showCancelButton: true,
        confirmButtonClass: "btn-danger",
        confirmButtonText: "Si, Eliminar",
        cancelButtonText: "No, cancelar",
        closeOnConfirm: true,
        closeOnCancel: true
    },

        function (respuesta) {

            if (respuesta) {
                localStorage.clear();

                $(".seccionProductos").empty();
                $(".divCampos").empty();

                $(".iconoCarrito").removeClass("fa-solid fa-cart-arrow-down");
                $(".iconoCarrito").addClass("fa-solid fa-cart-shopping");
                $(".txtTotalResumen").text("$ 0");
                crearTarjetas([]);
                crearResumen([]);
            }

        }
    );
    

})

$(".bloquePrincipal").on("click", ".iconoMenos", function () {
    const idProducto = $(this).closest(".tarjetaProducto").data("idproducto");
    const totalResumen = $(".txtTotalResumen");

    const textCantidad = $(this).closest(".tarjetaProducto").find(".cantidadProducto");
    const precioProducto = parseInt($(this).closest(".tarjetaProducto").find(".precioProducto").text().replace("$ ", ""));
    var cantidadActual = parseInt(textCantidad.text());

    const cantidadResumen = $(".infoPedido").find(`[data-idproducto="${idProducto}"].cantProducto`);
    const precioResumen = $(".infoPedido").find(`[data-idproducto="${idProducto}"].totalProducto`);


    if (!isNaN(cantidadActual) && cantidadActual > 1) {
        const nuevoPrecio = parseInt(precioResumen.text().replace("$ ", "")) - precioProducto;
        const nuevoPrecioFinal = parseInt(totalResumen.text().replace("$ ", "")) - precioProducto;

        cantidadActual--;
        cantidadResumen.text(" x " + cantidadActual);
        precioResumen.text("$ " + nuevoPrecio);
        totalResumen.text("$ " + nuevoPrecioFinal);
        textCantidad.text(cantidadActual);
    }

})

$(".bloquePrincipal").on("click", ".iconoMas", function () {
    const idProducto = $(this).closest(".tarjetaProducto").data("idproducto");
    const totalResumen = $(".txtTotalResumen");

    const textCantidad = $(this).closest(".tarjetaProducto").find(".cantidadProducto");
    const stockProducto = parseInt($(this).closest(".tarjetaProducto").find(".stockProducto").text().replace("Stock: ", ""));
    const precioProducto = parseInt($(this).closest(".tarjetaProducto").find(".precioProducto").text().replace("$ ", ""));
    var cantidadActual = parseInt(textCantidad.text());

    const cantidadResumen = $(".infoPedido").find(`[data-idproducto="${idProducto}"].cantProducto`);
    const precioResumen = $(".infoPedido").find(`[data-idproducto="${idProducto}"].totalProducto`);


    if (!isNaN(cantidadActual) && cantidadActual < stockProducto) {
        const nuevoPrecio = parseInt(precioResumen.text().replace("$ ", "")) + precioProducto;
        const nuevoPrecioFinal = parseInt(totalResumen.text().replace("$ ", "")) + precioProducto;

        cantidadActual++;
        cantidadResumen.text(" x " + cantidadActual);
        precioResumen.text("$ " + nuevoPrecio);
        totalResumen.text("$ " + nuevoPrecioFinal);
        textCantidad.text(cantidadActual);
    }
})