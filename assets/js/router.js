// Motor de Enrutamiento Inteligente con Simulación de Registro Técnico

document.addEventListener("DOMContentLoaded", () => {
    // 1. Detectar si hay un usuario en los parámetros de la URL
    const params = new URLSearchParams(window.location.search);
    const usuario = params.get("user");

    // Elementos del DOM
    const appContainer = document.getElementById("app");
    const mainContent = document.getElementById("main-content");
    const headerContainer = document.getElementById("global-header");
    const authContainer = document.getElementById("auth-container");
    const clienteContainer = document.getElementById("cliente-container");
    const registroForm = document.getElementById("registro-simulado-form");

    // Colocar el encabezado base por defecto
    headerContainer.innerHTML = `<h1>Plataforma Inteligente</h1>`;

    if (usuario) {
        // Si hay un usuario en la URL, ocultamos la caja de autenticación y cargamos sus datos
        if (authContainer) authContainer.style.display = "none";
        clienteContainer.style.display = "block";
        cargarEspacioCliente(usuario, clienteContainer, appContainer);
    } else {
        // Si no hay usuario, nos aseguramos de mostrar el panel de registro global
        if (authContainer) authContainer.style.display = "block";
        clienteContainer.style.display = "none";
        appContainer.classList.add("ready");
    }

    // Activar los listeners para los botones de las simulaciones
    configurarEventosSimulacion(registroForm);
});

// Configuración de clics y envíos de formularios en la página principal
function configurarEventosSimulacion(formulario) {
    if (!formulario) return;

    // A. Capturar el formulario de simulación de registro
    formulario.addEventListener("submit", (e) => {
        e.preventDefault();
        const nombreIngresado = document.getElementById("reg-nombre").value.trim();
        
        // Convertimos el nombre en un formato seguro para URLs (ej: "Juan Pérez" -> "juan-perez")
        const formatearUrl = nombreIngresado.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-\$)/g, '');
        
        if (formatearUrl) {
            // Simulamos la creación de un nuevo ID con el prefijo correlativo (ej: 003)
            const nuevaRutaVirtual = `003-${formatearUrl}`;
            
            alert(`¡Estructura Virtual Creada con Éxito!\n\nTu identificador será: ${nuevaRutaVirtual}\nAhora el sistema te redirigirá a tu nuevo espacio dinámico.`);
            
            // Redirigimos a la misma página usando el nuevo parámetro
            window.location.search = `?user=${nuevaRutaVirtual}`;
        }
    });

    // B. Simulación de clics en botones de Google y Facebook (OAuth 2.0)
    document.getElementById("btn-google").addEventListener("click", () => {
        alert("Simulación de OAuth 2.0:\n\nRedirigiendo a los servidores seguros de Google...");
    });

    document.getElementById("btn-facebook").addEventListener("click", () => {
        alert("Simulación de OAuth 2.0:\n\nRedirigiendo a los servidores seguros de Facebook...");
    });
}
// Función asíncrona para ir a buscar e inyectar los recursos del cliente
async function cargarEspacioCliente(nombreUsuario, contenedor, app) {
    const rutaBase = `usuarios/${nombreUsuario}`;

    try {
        // A. Cargar dinámicamente el CSS personalizado del cliente
        const linkEstilos = document.createElement("link");
        linkEstilos.rel = "stylesheet";
        linkEstilos.href = `${rutaBase}/personalizado.css`;
        document.head.appendChild(linkEstilos);

        // B. Buscar y leer el archivo estructurado (JSON) del cliente
        const respuesta = await fetch(`${rutaBase}/datos.json`);
        
        if (!respuesta.ok) {
            throw new Error("El usuario especificado no existe localmente.");
        }

        const datosCliente = await respuesta.json();

        // C. Pintar el contenido personalizado del cliente en la pantalla
        contenedor.innerHTML = `
            <div class="perfil-cliente">
                <h2>Espacio de: ${datosCliente.nombreEmpresa || nombreUsuario}</h2>
                <p class="descripcion">${datosCliente.descripcionCorta || 'Bienvenido a mi sitio.'}</p>
                <div class="contenido-personalizado">${datosCliente.mensajeBienvenida || ''}</div>
                <a href="${window.location.pathname}" style="display:inline-block; margin-top:2rem; color:#0071e3; text-decoration:none; font-size:0.9rem;">← Volver al Inicio General</a>
            </div>
        `;

    } catch (error) {
        // Manejo de errores amigable si la carpeta física aún no existe (como el caso del nuevo usuario 003)
        console.error(error);
        contenedor.innerHTML = `
            <div class="perfil-cliente" style="border-top-color: #ff3b30;">
                <h2 style="color: #ff3b30;">Estructura Virtual Detectada</h2>
                <p class="descripcion">Identificador: <strong>${nombreUsuario}</strong></p>
                <div class="contenido-personalizado">
                    <p>¡El enrutador inteligente funcionó! Detectó tu ID correctamente, pero como estamos en una prueba de solo lectura local, tu carpeta física no existe en el disco duro todavía.</p>
                    <p style="margin-top: 1rem; font-size: 0.9rem; color: #86868b;">En la siguiente fase, conectaremos este ID a internet para que guarde tus archivos de verdad sin necesitar MySQL.</p>
                </div>
                <a href="${window.location.pathname}" style="display:inline-block; margin-top:2rem; color:#0071e3; text-decoration:none; font-size:0.9rem;">← Volver al Inicio General</a>
            </div>
        `;
    } finally {
        // Revelar la aplicación de forma fluida una vez procesada la lógica
        app.classList.add("ready");
    }
}

