
$(document).ready(function () {
    const PRODUCTOS_CARRITO = JSON.parse(localStorage.getItem("productosCarrito")) || [];


    if (PRODUCTOS_CARRITO.length > 0) {
        $(".iconoCarrito").removeClass("fa-solid fa-cart-shopping");
        $(".iconoCarrito").addClass("fa-solid fa-cart-arrow-down iconoCarrito");
    }


    sessionStorage.removeItem("valorBusqueda");
});

$(".seccionLogin").on("click", ".btnVolver", function () {
    const pantallaAnterior = sessionStorage.getItem("ultimaPantalla");

    window.location.href = `/${pantallaAnterior}`;
})

$(".crearAdmin").click(function () {
    const mensajeAuth = $("#mensajeAuth");
    const password = $("#txtPassword").val();
    const usuario = $("#txtNombreUsuario").val();
    const regexUsr = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/;
    const regexPwd = /^(?=.*[A-Z])(?=.*\d.*\d)[A-Za-z\d@$!%*?&-_#]{8,16}$/;

    const modelo = {
        NombreUsuario: usuario,
        claveUsuario: password
    };

    if (regexPwd.test(password) && regexUsr.test(usuario)) {
        mensajeAuth.text("");

        const formData = new FormData;

        formData.append("modelo", JSON.stringify(modelo));

        console.log(modelo);
        console.log(formData);

        fetch("/User/CrearAdmin", {
            method: "POST",
            body: formData
        })
            .then(response => {
                return response.ok ? response.json() : Promise.reject(response);
            })
            .then(responseJSON => {
                if (responseJSON.estado) {
                    console.log(responseJSON);
                    toastr.success("", "Se creo el usuario correctamente!");
                } else {
                    swal("Error", `${responseJSON.mensaje}`, "error");
                }
            })


    } else {
        mensajeAuth.text("Nombre de usuario o contraseña incorrectos");
        mensajeAuth.css("color", "red");
    }
})

$("#btnEnviarDatos").click(function () {

    const mensajeAuth = $("#mensajeAuth");
    const password = $("#txtPassword").val();
    const usuario = $("#txtNombreUsuario").val();
    const regexUsr = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/;
    const regexPwd = /^(?=.*[A-Z])(?=.*\d.*\d)[A-Za-z\d@$!%*?&-_#]{8,16}$/;
    const existeToken = sessionStorage.getItem("Token") || "";

    const modelo = {
        NombreUsuario: usuario,
        claveUsuario: password
    };

    if (existeToken !== "") {
        mensajeAuth.text("Un usuario ya tiene una sesión activa");
        mensajeAuth.css("color", "red");
        toastr.info("", "Ya hay una cuenta con una sesión activa");
        return;
    }

    if (!regexPwd.test(password) || !regexUsr.test(usuario)) {
        mensajeAuth.text("Nombre de usuario o contraseña incorrectos");
        mensajeAuth.css("color", "red");
        return;
    }

    mensajeAuth.text("");

    const formData = new FormData;

    formData.append("modelo", JSON.stringify(modelo));

    console.log(modelo);
    console.log(formData);

    fetch("/User/IniciarSesion", {
        method: "POST",
        body: formData
    })
        .then(response => {
            return response.ok ? response.json() : Promise.reject(response);
        })
        .then(responseJSON => {
            if (responseJSON.estado) {
                console.log(responseJSON);
                sessionStorage.setItem("Token", responseJSON.objeto);
                toastr.success("", "Sesión iniciada correctamente!");
            } else {
                mensajeAuth.text("Nombre de usuario o contraseña incorrectos");
                mensajeAuth.css("color", "red");
            }
        })
        .catch(error => {
            console.error(error);
            mensajeAuth.text("Error en la solicitud");
            mensajeAuth.css("color", "red");
        });

})


$(".seccionLogin").on('click', '.toggle-password', function () {
    var input = $($(this).attr('toggle'));
    if (input.attr('type') === 'password') {
        input.attr('type', 'text');
        $(this).find("i").removeClass("fa-solid fa-eye").addClass("fa-solid fa-eye-slash");
    } else {
        input.attr('type', 'password');
        $(this).find("i").removeClass("fa-solid fa-eye-slash").addClass("fa-solid fa-eye");
    }
});

