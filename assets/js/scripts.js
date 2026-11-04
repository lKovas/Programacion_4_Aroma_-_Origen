async function cargarArchivo(id, ruta) {
    const contenedor = document.getElementById(id);

    try {
        const respuesta = await fetch(ruta);

        if (!respuesta.ok) {
            throw new Error(
                `No se pudo cargar ${ruta}. Estado: ${respuesta.status}`
            );
        }

        const contenido = await respuesta.text();

        if (!contenido.trim()) {
            throw new Error(`El archivo ${ruta} está vacío.`);
        }

        contenedor.innerHTML = contenido;
    } catch (error) {
        console.error(error);

        contenedor.innerHTML = "";

        const mensaje = document.createElement("p");
        mensaje.className = "text-center p-3 text-danger";
        mensaje.textContent = error.message;

        contenedor.appendChild(mensaje);
    }
}

async function iniciarPagina() {
    await Promise.all([
        cargarArchivo("navbar", "views/main/navbar/navbar.html"),
        cargarArchivo("contenido", "views/main/body/body.html"),
        cargarArchivo("footer", "views/main/footer/footer.html"),
        cargarArchivo("catalog", "views/shop/catalog.html")
    ]);
}

iniciarPagina(); 

// Mostrar el catálogo dentro de index.html
document.addEventListener("click", async function (evento) {
    const enlace = evento.target.closest(
        'a[href="views/shop/catalog.html"]'
    );

    if (!enlace) {
        return;
    }

    // Respetar abrir enlaces en otra pestaña
    if (
        evento.ctrlKey ||
        evento.metaKey ||
        evento.shiftKey ||
        evento.altKey
    ) {
        return;
    }

    // Evitar abrir catalog.html como una página independiente
    evento.preventDefault();

    // Cargar únicamente el contenido del catálogo
    await cargarArchivo(
        "contenido",
        "views/shop/catalog.html"
    );

    // Comprobar que la vista se cargó
    if (!document.getElementById("listaProductos")) {
        return;
    }

    // Activar productos, buscador y categorías
    iniciarCatalogo();

    // Actualizar el enlace activo del navbar
    document.querySelectorAll("#navbar .nav-link").forEach(link => {
        const esCatalogo =
            link.getAttribute("href") === "views/shop/catalog.html";

        link.classList.toggle("active", esCatalogo);

        if (esCatalogo) {
            link.setAttribute("aria-current", "page");
        } else {
            link.removeAttribute("aria-current");
        }
    });

    document.title = "Catálogo | Aroma y Origen";

    // Cerrar el menú móvil si está abierto
    const menu = document.getElementById("menuPrincipal");

    if (menu && menu.classList.contains("show")) {
        bootstrap.Collapse.getOrCreateInstance(menu).hide();
    }

    window.scrollTo(0, 0);
});

// Mostrar Inicio sin recargar toda la página
document.addEventListener("click", async function (evento) {
    const enlace = evento.target.closest(
        '#navbar a[href="index.html"], #footer a[href="index.html"]'
    );

    if (!enlace) {
        return;
    }

    // Permitir abrir el enlace en otra pestaña
    if (
        evento.ctrlKey ||
        evento.metaKey ||
        evento.shiftKey ||
        evento.altKey
    ) {
        return;
    }

    evento.preventDefault();

    // Cargar la vista de inicio
    await cargarArchivo(
        "contenido",
        "views/main/body/body.html"
    );

    // Actualizar el enlace activo del navbar
    document.querySelectorAll("#navbar .nav-link").forEach(link => {
        const esInicio =
            link.getAttribute("href") === "index.html";

        link.classList.toggle("active", esInicio);

        if (esInicio) {
            link.setAttribute("aria-current", "page");
        } else {
            link.removeAttribute("aria-current");
        }
    });

    document.title = "Inicio | Aroma y Origen";

    // Cerrar el menú móvil si está abierto
    const menu = document.getElementById("menuPrincipal");

    if (menu && menu.classList.contains("show")) {
        bootstrap.Collapse.getOrCreateInstance(menu).hide();
    }

    window.scrollTo(0, 0);
});


// Ir al contacto de Inicio sin recargar la página
document.addEventListener("click", async function (evento) {
    const enlace = evento.target.closest(
        '#navbar a[href="#contacto"], #footer a[href="#contacto"]'
    );

    if (!enlace) {
        return;
    }

    if (
        evento.ctrlKey ||
        evento.metaKey ||
        evento.shiftKey ||
        evento.altKey
    ) {
        return;
    }

    evento.preventDefault();

    // Si Contacto no está en la vista actual, cargar Inicio
    if (!document.querySelector("#contenido #contacto")) {
        await cargarArchivo(
            "contenido",
            "views/main/body/body.html"
        );
    }

    const contacto = document.querySelector("#contenido #contacto");

    if (!contacto) {
        console.error(
            'No se encontró un elemento con id="contacto" en Inicio.'
        );
        return;
    }

    document.title = "Inicio | Aroma y Origen";

    // Resaltar Contacto en el navbar
    document.querySelectorAll("#navbar .nav-link").forEach(link => {
        const esContacto =
            link.getAttribute("href") === "#contacto";

        link.classList.toggle("active", esContacto);

        if (esContacto) {
            link.setAttribute("aria-current", "location");
        } else {
            link.removeAttribute("aria-current");
        }
    });

    // Cerrar el menú móvil antes de desplazarse
    const menu = document.getElementById("menuPrincipal");

    if (menu && menu.classList.contains("show")) {
        await new Promise(resolve => {
            menu.addEventListener(
                "hidden.bs.collapse",
                resolve,
                { once: true }
            );

            bootstrap.Collapse.getOrCreateInstance(menu).hide();
        });
    }

    contacto.scrollIntoView({
        behavior: window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches ? "instant" : "smooth",
        block: "start"
    });
});