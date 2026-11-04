// Mostrar los productos en el catálogo
function mostrarProductos(lista) {
    const contenedor = document.getElementById("listaProductos");

    if (!contenedor) {
        return;
    }

    contenedor.innerHTML = "";

    if (lista.length === 0) {
        contenedor.innerHTML = `
            <div class="col-12">
                <div class="alert alert-warning" role="status">
                    No encontramos productos que coincidan con tu búsqueda.
                    Intenta con otro nombre o categoría.
                </div>
            </div>
        `;

        return;
    }

    lista.forEach(producto => {
        const tarjeta = `
            <div class="col-12 col-md-6 col-xl-4">
                <div class="card h-100">

                    <img
                        src="assets/img/${producto.imagen}"
                        class="card-img-top"
                        alt="${producto.nombre} de Aroma y Origen">

                    <div class="card-body d-flex flex-column">

                        <h3 class="h5 card-title">
                            ${producto.nombre}
                        </h3>

                        <p class="card-text text-secondary">
                            ${obtenerCategoria(producto.categoria)}
                        </p>

                        <p class="fw-bold">
                            ₡${producto.precio.toLocaleString("es-CR")}
                        </p>

                        <a
                            href="views/shop/product_list.html?id=${producto.id}"
                            class="btn btn-success mt-auto">
                            Ver producto
                        </a>

                    </div>
                </div>
            </div>
        `;

        contenedor.innerHTML += tarjeta;
    });
}


// Obtener el nombre de la categoría
function obtenerCategoria(categoria) {
    if (categoria === "cafe") {
        return "Café";
    }

    if (categoria === "te") {
        return "Té";
    }

    if (categoria === "accesorios") {
        return "Accesorios";
    }

    return categoria;
}


// Normalizar texto para buscar sin importar las tildes
function normalizarTexto(texto) {
    return texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();
}


// Activar el catálogo DESPUÉS de cargar su HTML
function iniciarCatalogo() {
    const contenedor = document.getElementById("listaProductos");
    const buscador = document.getElementById("buscarProducto");

    const botonesCategorias = document.querySelectorAll(
        "#contenido [data-categoria]"
    );

    // Evitar ejecutar el catálogo cuando su vista no está cargada
    if (!contenedor || !buscador) {
        return;
    }

    // Evitar duplicar eventos si se inicializa dos veces la misma vista
    if (contenedor.dataset.inicializado === "true") {
        return;
    }

    let categoriaActual = "todos";

    function filtrarProductos() {
        const textoBusqueda = normalizarTexto(buscador.value);

        const productosFiltrados = productos.filter(producto => {
            const nombreNormalizado = normalizarTexto(
                producto.nombre
            );

            const coincideNombre = nombreNormalizado.includes(
                textoBusqueda
            );

            const coincideCategoria =
                categoriaActual === "todos" ||
                producto.categoria === categoriaActual;

            return coincideNombre && coincideCategoria;
        });

        mostrarProductos(productosFiltrados);
    }

    // Buscar productos mientras escribimos
    buscador.addEventListener("input", filtrarProductos);

    // Cambiar categoría
    botonesCategorias.forEach(boton => {
        boton.classList.toggle(
            "active",
            boton.dataset.categoria === categoriaActual
        );

        boton.addEventListener("click", function () {
            categoriaActual = this.dataset.categoria;

            botonesCategorias.forEach(b => {
                b.classList.remove("active");
            });

            this.classList.add("active");

            filtrarProductos();
        });
    });

    // Mostrar los productos al entrar al catálogo
    filtrarProductos();

    contenedor.dataset.inicializado = "true";
}