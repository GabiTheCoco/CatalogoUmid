$(document).ready(function () {
    const PRODUCTOS_CARRITO = JSON.parse(localStorage.getItem("productosCarrito")) || [];


    if (PRODUCTOS_CARRITO.length > 0) {
        $(".iconoCarrito").removeClass("fa-solid fa-cart-shopping");
        $(".iconoCarrito").addClass("fa-solid fa-cart-arrow-down iconoCarrito");
    }
})
$(".iconoInstagram").click(function () {
    window.open("https://www.instagram.com/umid_velas/", "_blank");
})

$(".iconoTiktok").click(function () {
    window.open("https://www.tiktok.com/@umidvelas?_t=8e6UIqRHo0M&_r=1", "_blank");
})

$(".iconoEmail").click(function () {
    window.open("mailto:${`umidvelas@gmail.com`}", "_blank");
})

$(".btnConsultas").click(function () {
    window.open("https://api.whatsapp.com/send/?phone=5493426123703&text=Buen+d%C3%ADa%21+Me+comunico+para+hacer+la+siguiente+consulta%3A+&type=phone_number&app_absent=0", "_blank");
})

$(".busquedaInput").on("input keydown", function (event) {
    const idProducto = sessionStorage.getItem("idProducto")
    const valorInput = $(this).val();
    const regex = /^[a-zA-Z\s]+$/;

    if (event.type === "keydown" && event.keyCode == 13) {
        if ((isNaN(valorInput) && regex.test(valorInput)) || (event.type === "input" && valorInput === "")) {
            // Validación exitosa, realizar búsqueda
            sessionStorage.setItem("valorBusqueda", valorInput);
            realizarBusqueda();
        } else {
            // Mostrar alerta y limpiar el input
            alert("Input inválido, por favor ingréselo nuevamente");
            $(this).val("").focus();
            realizarBusqueda();
        }

        // Redirigir solo si no está en la página de productos
        if (window.location.pathname !== "/Home/Productos") {
            window.location.href = "/Home/Productos";
        }
    }

})

$(".iconoLupa").on("click", function (event) {
    const ultimaPantalla = sessionStorage.getItem("ultimaPantalla") || "";
    const valorInput = $(".busquedaInput").val();
    const regex = /^[a-zA-Z\s]+$/;

    if (event.type === "keydown" && event.keyCode == 13) {
        if ((isNaN(valorInput) && regex.test(valorInput)) || (event.type === "input" && valorInput === "")) {
            // Validación exitosa, realizar búsqueda
            sessionStorage.setItem("valorBusqueda", valorInput);
            realizarBusqueda();
        } else {
            // Mostrar alerta y limpiar el input
            alert("Input inválido, por favor ingréselo nuevamente");
            $(this).val("").focus();
        }

        // Redirigir solo si no está en la página de productos
        if (window.location.pathname !== "/Home/Productos") {
            window.location.href = "/Home/Productos";
        }
    }

    
})

function realizarBusqueda() {
    const input = sessionStorage.getItem("valorBusqueda") || "";
    const orden = $(".filtroOrden").val() || null;
    const estado = $(".filtroEstado").val() || 1;

    fetch(`/Home/MostrarProductos/${orden}/${estado}?input=${encodeURIComponent(input)}`, {
        method: "GET",
    })
        .then(response => {

            return response.ok ? response.json() : Promise.reject(response);
        })
        .then(responseJSON => {
            if (responseJSON.data.length > 0) {
                $(".contenidoPrincipal").empty();
                mostrarProductos(responseJSON.data, $(".contenidoPrincipal"));
            }
            else {
                alert("no hay productos consistentes con la busqueda");
            }
        })

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