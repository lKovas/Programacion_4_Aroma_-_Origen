const CLAVE_CARRITO = "aromaOrigenCarrito";

function leerCarrito() {
    try {
        const datos = JSON.parse(
            localStorage.getItem(CLAVE_CARRITO) || "[]"
        );

        if (!Array.isArray(datos)) {
            return [];
        }

        const cantidades = new Map();

        datos.forEach(item => {
            if (!item || typeof item !== "object") {
                return;
            }

            const id = Number(item.id);
            const cantidad = Number(item.cantidad);

            const existe = productos.some(producto => producto.id === id);

            if (
                existe &&
                Number.isSafeInteger(cantidad) &&
                cantidad > 0 &&
                cantidad <= 99
            ) {
                cantidades.set(
                    id,
                    Math.min(99, (cantidades.get(id) || 0) + cantidad)
                );
            }
        });

        return Array.from(cantidades, ([id, cantidad]) => ({
            id,
            cantidad
        }));
    } catch (error) {
        console.error("No se pudo leer el carrito:", error);
        return [];
    }
}

let carritoActual = leerCarrito();

function guardarCarrito() {
    try {
        localStorage.setItem(
            CLAVE_CARRITO,
            JSON.stringify(carritoActual)
        );
    } catch (error) {
        console.error("No se pudo guardar el carrito:", error);

        informarCarrito(
            "El carrito funciona en esta sesión, pero no pudo guardarse."
        );
    }

    actualizarContadorCarrito();
}

function formatoCarrito(valor) {
    return "₡" + valor.toLocaleString("es-CR");
}

function informarCarrito(texto) {
    const mensaje = document.getElementById("carritoMensaje");

    if (mensaje) {
        mensaje.textContent = texto;
    }
}

function actualizarContadorCarrito() {
    const cantidad = carritoActual.reduce(
        (total, item) => total + item.cantidad,
        0
    );

    document.querySelectorAll(".ao-cart-count").forEach(contador => {
        contador.textContent = cantidad;
    });

    document.querySelectorAll(".ao-navbar-cart").forEach(boton => {
        boton.setAttribute(
            "aria-label",
            `Carrito: ${cantidad} productos`
        );
    });
}

// Función disponible para Catálogo o Detalle de producto
function agregarAlCarrito(id, cantidad = 1) {
    id = Number(id);
    cantidad = Number(cantidad);

    const producto = productos.find(producto => producto.id === id);

    if (
        !producto ||
        !producto.disponible ||
        !Number.isSafeInteger(cantidad) ||
        cantidad < 1 ||
        cantidad > 99
    ) {
        return false;
    }

    const item = carritoActual.find(item => item.id === id);

    if (item && item.cantidad + cantidad > 99) {
        informarCarrito("El máximo es de 99 unidades por producto.");
        return false;
    }

    if (item) {
        item.cantidad += cantidad;
    } else {
        carritoActual.push({ id, cantidad });
    }

    guardarCarrito();
    renderizarCarrito();
    informarCarrito(`${producto.nombre} agregado al carrito.`);

    return true;
}

function renderizarCarrito() {
    const contenedor = document.getElementById("carritoProductos");

    if (!contenedor) {
        return;
    }

    contenedor.replaceChildren();

    let total = 0;
    let cantidadTotal = 0;

    carritoActual.forEach(item => {
        const producto = productos.find(
            producto => producto.id === item.id
        );

        const subtotal = producto.precio * item.cantidad;

        total += subtotal;
        cantidadTotal += item.cantidad;

        const fila = document.createElement("article");
        fila.className = "ao-carrito-fila";

        fila.innerHTML = `
            <div class="ao-carrito-producto">
                <img class="ao-carrito-imagen" alt="">
                <div>
                    <h3></h3>
                    <p class="ao-carrito-presentacion"></p>
                    <button type="button"
                            class="ao-carrito-eliminar"
                            data-accion="eliminar">
                        <i class="fa-regular fa-trash-can"
                           aria-hidden="true"></i>
                        Eliminar
                    </button>
                </div>
            </div>

            <span class="ao-carrito-precio"></span>

            <div class="ao-carrito-control">
                <button type="button"
                        data-accion="restar"
                        aria-label="Reducir cantidad">−</button>
                <output></output>
                <button type="button"
                        data-accion="sumar"
                        aria-label="Aumentar cantidad">+</button>
            </div>

            <span class="ao-carrito-subtotal"></span>
        `;

        fila.dataset.id = producto.id;

        const imagen = fila.querySelector("img");
        imagen.src = `assets/img/${producto.imagen}`;
        imagen.alt = producto.nombre;

        fila.querySelector("h3").textContent = producto.nombre;

        fila.querySelector(".ao-carrito-presentacion").textContent =
            producto.presentacion;

        fila.querySelector(".ao-carrito-precio").textContent =
            formatoCarrito(producto.precio);

        fila.querySelector(".ao-carrito-subtotal").textContent =
            formatoCarrito(subtotal);

        fila.querySelector("output").textContent = item.cantidad;
        fila.querySelector("output").setAttribute(
            "aria-label",
            `Cantidad de ${producto.nombre}`
        );

        fila.querySelector('[data-accion="restar"]').disabled =
            item.cantidad <= 1;

        fila.querySelector('[data-accion="sumar"]').disabled =
            item.cantidad >= 99;

        contenedor.appendChild(fila);
    });

    if (carritoActual.length === 0) {
        contenedor.innerHTML = `
            <div class="ao-carrito-vacio">
                <h3>Tu carrito está vacío</h3>
                <p>Explora el catálogo y elige tu próxima pausa.</p>
            </div>
        `;
    }

    document.getElementById("carritoCantidad").textContent =
        cantidadTotal;

    document.getElementById("carritoSubtotal").textContent =
        formatoCarrito(total);

    document.getElementById("carritoTotal").textContent =
        formatoCarrito(total);

    document.getElementById("carritoFinalizar").disabled =
        carritoActual.length === 0;
}

function iniciarCarrito() {
    const contenedor = document.getElementById("carritoProductos");

    if (!contenedor) {
        return;
    }

    renderizarCarrito();
    actualizarContadorCarrito();

    if (contenedor.dataset.inicializado === "true") {
        return;
    }

    contenedor.dataset.inicializado = "true";

    contenedor.addEventListener("click", evento => {
        const boton = evento.target.closest("button[data-accion]");

        if (!boton) {
            return;
        }

        const fila = boton.closest(".ao-carrito-fila");
        const id = Number(fila.dataset.id);
        const item = carritoActual.find(item => item.id === id);

        if (!item) {
            return;
        }

        const accion = boton.dataset.accion;

        if (accion === "eliminar") {
            carritoActual = carritoActual.filter(item => item.id !== id);
        } else if (accion === "sumar" && item.cantidad < 99) {
            item.cantidad++;
        } else if (accion === "restar" && item.cantidad > 1) {
            item.cantidad--;
        } else {
            return;
        }

        guardarCarrito();
        renderizarCarrito();

        informarCarrito(
            accion === "eliminar"
                ? "Producto eliminado del carrito."
                : "Cantidad actualizada."
        );

        // Mantener el foco al reconstruir los controles
        const siguienteControl = contenedor.querySelector(
            `[data-id="${id}"] [data-accion="${accion}"]:not(:disabled)`
        ) || contenedor.querySelector("button:not(:disabled)");

        if (siguienteControl) {
            siguienteControl.focus();
        }
    });

    document.getElementById("carritoFinalizar").addEventListener(
        "click",
        () => {
            if (carritoActual.length === 0) {
                return;
            }

            const confirmar = window.confirm(
                "¿Finalizar la compra simulada? No se realizará ningún cobro."
            );

            if (!confirmar) {
                return;
            }

            carritoActual = [];
            guardarCarrito();
            renderizarCarrito();

            informarCarrito(
                "Compra simulada finalizada. No se realizó ningún cobro."
            );
        }
    );
}

// El navbar se inserta mediante fetch: actualizar al aparecer
const contenedorNavbar = document.getElementById("navbar");

if (contenedorNavbar) {
    new MutationObserver(actualizarContadorCarrito).observe(
        contenedorNavbar,
        { childList: true }
    );
}

actualizarContadorCarrito();

// Abrir el carrito desde el botón del navbar
document.addEventListener("click", async evento => {
    const boton = evento.target.closest("#navbar .ao-navbar-cart");

    if (!boton) {
        return;
    }

    evento.preventDefault();

    await cargarArchivo(
        "contenido",
        "views/checkout/checkout.html"
    );

    if (!document.getElementById("carritoProductos")) {
        return;
    }

    iniciarCarrito();

    document.title = "Carrito | Aroma y Origen";

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