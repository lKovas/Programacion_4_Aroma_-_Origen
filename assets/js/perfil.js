function iniciarPerfil() {
    const formulario = document.getElementById("perfilFormulario");

    if (!formulario || formulario.dataset.inicializado === "true") {
        return;
    }

    formulario.dataset.inicializado = "true";

    const campos = document.getElementById("perfilCampos");
    const editar = document.getElementById("perfilEditar");
    const cancelar = document.getElementById("perfilCancelar");
    const acciones = document.getElementById("perfilAcciones");
    const mensaje = document.getElementById("perfilMensaje");

    function terminarEdicion() {
        campos.disabled = true;
        acciones.hidden = true;
        editar.hidden = false;
        editar.focus();
    }

    editar.addEventListener("click", function () {
        campos.disabled = false;
        acciones.hidden = false;
        editar.hidden = true;
        mensaje.textContent = "";

        document.getElementById("perfilNombre").focus();
    });

    cancelar.addEventListener("click", function () {
        formulario.reset();
        terminarEdicion();

        mensaje.textContent = "Edición cancelada.";
    });

    formulario.addEventListener("submit", function (evento) {
        evento.preventDefault();

        // Conservar los cambios como referencia para cancelar
        // futuras ediciones dentro de esta misma vista.
        formulario.querySelectorAll("input").forEach(input => {
            input.defaultValue = input.value;
        });

        terminarEdicion();

        mensaje.textContent =
            "Cambios de demostración aplicados. No se guardan al salir de esta vista.";
    });

    // Navegación interna de la cuenta
    document.querySelectorAll(".ao-perfil-opcion").forEach(enlace => {
        enlace.addEventListener("click", function (evento) {
            evento.preventDefault();

            const destino = document.querySelector(
                enlace.getAttribute("href")
            );

            if (!destino) {
                return;
            }

            document.querySelectorAll(".ao-perfil-opcion").forEach(item => {
                item.classList.remove("activa");
            });

            enlace.classList.add("activa");

            destino.scrollIntoView({
                behavior: window.matchMedia(
                    "(prefers-reduced-motion: reduce)"
                ).matches ? "instant" : "smooth",
                block: "start"
            });
        });
    });
}


// Abrir Mi cuenta dentro de index.html
document.addEventListener("click", async function (evento) {
    const boton = evento.target.closest(
        '#navbar [data-vista="perfil"]'
    );

    if (!boton) {
        return;
    }

    evento.preventDefault();

    await cargarArchivo(
        "contenido",
        "views/account/perfil.html"
    );

    if (!document.getElementById("perfilFormulario")) {
        return;
    }

    iniciarPerfil();

    document.title = "Mi cuenta | Aroma y Origen";

    document.querySelectorAll("#navbar .nav-link").forEach(enlace => {
        enlace.classList.remove("active");
        enlace.removeAttribute("aria-current");
    });

    const menu = document.getElementById("menuPrincipal");

    if (menu && menu.classList.contains("show")) {
        bootstrap.Collapse.getOrCreateInstance(menu).hide();
    }

    window.scrollTo(0, 0);
});