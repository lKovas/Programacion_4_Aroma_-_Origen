// Productos de Aroma y Origen
// Datos ficticios para el Avance 1

// Mostrar los productos en el catálogo
function mostrarProductos(lista) {

    // Obtener el contenedor donde aparecerán las tarjetas
    const contenedor = document.getElementById("listaProductos");

    // Limpiar el contenido anterior
    contenedor.innerHTML = "";

    // Mostrar un mensaje si no hay productos
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

    // Recorrer la lista de productos
    lista.forEach(producto => {

        // Crear una tarjeta para cada producto
        const tarjeta = `
            <div class="col-12 col-md-6 col-xl-4">

                <div class="card h-100">

                    <img
                        src="../../assets/img/${producto.imagen}"
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

                        <a href="product_list.html?id=${producto.id}"
                            class="btn btn-success mt-auto">
                            Ver producto
                        </a>

                    </div>

                </div>

            </div>
        `;

        // Agregar la tarjeta al catálogo
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


// Mostrar todos los productos al abrir la página
mostrarProductos(productos);

// Categoría seleccionada inicialmente
let categoriaActual = "todos";

// Obtener el buscador
const buscador = document.getElementById("buscarProducto");

// Obtener los botones de categorías
const botonesCategorias = document.querySelectorAll("[data-categoria]");

// Normalizar texto para buscar sin importar las tildes
function normalizarTexto(texto) {

    return texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();

}
// Función para filtrar productos
function filtrarProductos() {

    // Obtener el texto escrito y normalizarlo
    const textoBusqueda = normalizarTexto(buscador.value);

    // Filtrar según nombre y categoría
    const productosFiltrados = productos.filter(producto => {

        // Normalizar el nombre del producto
        const nombreNormalizado = normalizarTexto(producto.nombre);

        // Comprobar coincidencia con la búsqueda
        const coincideNombre = nombreNormalizado.includes(textoBusqueda);

        // Comprobar coincidencia con la categoría
        const coincideCategoria =
            categoriaActual === "todos" ||
            producto.categoria === categoriaActual;

        return coincideNombre && coincideCategoria;

    });

    // Mostrar los productos encontrados
    mostrarProductos(productosFiltrados);

}


// Buscar productos mientras escribimos
buscador.addEventListener("input", filtrarProductos);


// Cambiar categoría al presionar un botón
botonesCategorias.forEach(boton => {

    boton.addEventListener("click", function() {

        // Obtener la categoría seleccionada
        categoriaActual = this.dataset.categoria;

        // Quitar la clase active de todos los botones
        botonesCategorias.forEach(b => {
            b.classList.remove("active");
        });

        // Resaltar el botón seleccionado
        this.classList.add("active");

        // Actualizar los productos mostrados
        filtrarProductos();

    });

});