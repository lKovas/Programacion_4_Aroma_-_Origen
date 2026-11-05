// Mostrar el producto después de cargar la vista
function iniciarDetalleProducto(idProducto) {
    idProducto = Number(idProducto);

    const productoSeleccionado = productos.find(producto => {
        return producto.id === idProducto;
    });

    const contenedorDetalle = document.getElementById("detalleProducto");

    if (!contenedorDetalle) {
        return;
    }

    if (!productoSeleccionado) {
        contenedorDetalle.innerHTML = `
            <div class="alert alert-warning" role="alert">
                No encontramos el producto solicitado.
                Puedes regresar al catálogo para consultar otros artículos.
            </div>
        `;

        return;
    }

    contenedorDetalle.innerHTML = `
        <div class="row g-5 align-items-center">

            <!-- Fotografía -->
            <div class="col-12 col-lg-6">
                <img
                    src="assets/img/${productoSeleccionado.imagen}"
                    class="img-fluid rounded"
                    alt="${productoSeleccionado.nombre} de Aroma y Origen">
            </div>

            <!-- Información -->
            <div class="col-12 col-lg-6">

                <p class="text-secondary mb-2">
                    ${obtenerNombreCategoria(productoSeleccionado.categoria)}
                </p>

                <h1 class="mb-3">
                    ${productoSeleccionado.nombre}
                </h1>

                <p class="fs-3 fw-bold">
                    ₡${productoSeleccionado.precio.toLocaleString("es-CR")}
                </p>

                <p class="lead">
                    ${productoSeleccionado.descripcion}
                </p>

                <hr>

                <p>
                    <strong>Origen:</strong>
                    ${productoSeleccionado.origen}
                </p>

                <p>
                    <strong>Presentación:</strong>
                    ${productoSeleccionado.presentacion}
                </p>

                <p>
                    <strong>Disponibilidad:</strong>
                    ${productoSeleccionado.disponible ? "Disponible" : "Agotado"}
                </p>

                <!-- Cantidad de productos -->
                <div class="mb-3">
                    <label for="cantidadProducto" class="form-label">
                        Cantidad:
                    </label>

                    <input
                        type="number"
                        id="cantidadProducto"
                        class="form-control"
                        min="1"
                        max="10"
                        value="1"
                        style="width: 100px;"
                        ${productoSeleccionado.disponible ? "" : "disabled"}>
                </div>

                <button
                    type="button"
                    id="agregarCarrito"
                    data-producto-id="${productoSeleccionado.id}"
                    class="btn btn-success btn-lg"
                    ${productoSeleccionado.disponible ? "" : "disabled"}>
                    Agregar al carrito
                </button>

            </div>
        </div>
    `;
}


// Convertir la categoría en un nombre legible
function obtenerNombreCategoria(categoria) {
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


// Abrir el detalle sin recargar index.html
document.addEventListener("click", async function (evento) {
    const enlace = evento.target.closest("#contenido a[href]");

    if (
        !enlace ||
        evento.defaultPrevented ||
        evento.ctrlKey ||
        evento.metaKey ||
        evento.shiftKey ||
        evento.altKey
    ) {
        return;
    }

    const destino = new URL(enlace.href, document.baseURI);

    const rutaDetalle = new URL(
        "views/shop/product_list.html",
        document.baseURI
    );

    // Interceptar solamente los enlaces al detalle
    if (
        destino.origin !== rutaDetalle.origin ||
        destino.pathname !== rutaDetalle.pathname
    ) {
        return;
    }

    evento.preventDefault();

    const idProducto = destino.searchParams.get("id");

    await cargarArchivo(
        "contenido",
        "views/shop/product_list.html"
    );

    if (!document.getElementById("detalleProducto")) {
        return;
    }

    iniciarDetalleProducto(idProducto);

    document.title = "Detalle del producto | Aroma y Origen";

    window.scrollTo(0, 0);
});
