// Motor de Enrutamiento Inteligente Dinámico

document.addEventListener("DOMContentLoaded", () => {
    // 1. Detectar si hay un usuario en los parámetros de la URL (Ejemplo: ?user=cliente-juan)
    const params = new URLSearchParams(window.location.search);
    const usuario = params.get("user");

    const appContainer = document.getElementById("app");
    const mainContent = document.getElementById("main-content");
    const headerContainer = document.getElementById("global-header");

    // Colocar un encabezado base por defecto
    headerContainer.innerHTML = `<h1>Plataforma Inteligente</h1>`;

    if (usuario) {
        // Si hay un usuario en la URL, ejecutamos la función para cargar su espacio
        cargarEspacioCliente(usuario, mainContent, appContainer);
    } else {
        // Si no hay usuario, mostramos la pantalla de inicio global
        mainContent.innerHTML = `
            <h2>¡Bienvenido a la Página Principal!</h2>
            <p>Por favor, inicia sesión o accede a la URL de tu espacio personalizado.</p>
        `;
        appContainer.classList.add("ready");
    }
});
// Función para ir a la carpeta de un usuario específico e inyectar sus recursos
async function cargarEspacioCliente(nombreUsuario, contenedor, app) {
    const rutaBase = `usuarios/${nombreUsuario}`;

    try {
        // A. Cargar dinámicamente el CSS personalizado del cliente
        const linkEstilos = document.createElement("link");
        linkEstilos.rel = "stylesheet";
        linkEstilos.href = `${rutaBase}/personalizado.css`;
        document.head.appendChild(linkEstilos);

        // B. Buscar y leer el archivo de texto estructurado (JSON) del cliente
        const respuesta = await fetch(`${rutaBase}/datos.json`);
        
        if (!respuesta.ok) {
            throw new Error("El usuario especificado no existe o sus datos están corruptos.");
        }

        const datosCliente = await respuesta.json();

        // C. Pintar el contenido personalizado del cliente en el index principal
        contenedor.innerHTML = `
            <div class="perfil-cliente">
                <h2>Espacio de: ${datosCliente.nombreEmpresa || nombreUsuario}</h2>
                <p class="descripcion">${datosCliente.descripcionCorta || 'Bienvenido a mi sitio.'}</p>
                <div class="contenido-personalizado">${datosCliente.mensajeBienvenida || ''}</div>
            </div>
        `;

    } catch (error) {
        // Manejo robusto de errores si la carpeta o el archivo JSON no existen
        console.error(error);
        contenedor.innerHTML = `
            <h2>Error de Acceso</h2>
            <p>No se pudo cargar el espacio solicitado. Verifica que el nombre de usuario sea correcto.</p>
        `;
    } finally {
        // Revelar la aplicación de forma fluida una vez cargados los archivos
        app.classList.add("ready");
    }
}
