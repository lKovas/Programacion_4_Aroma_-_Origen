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
        cargarArchivo("footer", "views/main/footer/footer.html")
    ]);
}

iniciarPagina();