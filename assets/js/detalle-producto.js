// Detalle de productos - Aroma y Origen

// Obtener el identificador del producto desde la URL
const parametros = new URLSearchParams(window.location.search);

const idProducto = Number(parametros.get("id"));

// Buscar el producto seleccionado
const productoSeleccionado = productos.find(producto => {
    return producto.id === idProducto;
});

// Obtener el contenedor del detalle
const contenedorDetalle = document.getElementById("detalleProducto");

// Comprobar si el producto existe
if (!productoSeleccionado) {

    contenedorDetalle.innerHTML = `
        <div class="alert alert-warning" role="alert">
            No encontramos el producto solicitado.
            Puedes regresar al catálogo para consultar otros artículos.
        </div>
    `;

} else {

    // Mostrar la información del producto
    contenedorDetalle.innerHTML = `
        <div class="row g-5 align-items-center">

            <!-- Fotografía -->
            <div class="col-12 col-lg-6">

                <img
                    src="../../assets/img/${productoSeleccionado.imagen}"
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

                <button
                    type="button"
                    id="agregarCarrito"
                    data-producto-id="${productoSeleccionado.id}"
                    class="btn btn-success btn-lg mt-3"
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