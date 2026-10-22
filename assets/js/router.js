// Motor de Enrutamiento Inteligente con Panel de Edición en Tiempo Real

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

    formulario.addEventListener("submit", (e) => {
        e.preventDefault();
        const nombreIngresado = document.getElementById("reg-nombre").value.trim();
        const formatearUrl = nombreIngresado.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-\$)/g, '');
        
        if (formatearUrl) {
            const nuevaRutaVirtual = `003-${formatearUrl}`;
            alert(`¡Estructura Virtual Creada con Éxito!\n\nTu identificador será: ${nuevaRutaVirtual}\nAhora el sistema te redirigirá a tu nuevo espacio dinámico.`);
            window.location.search = `?user=${nuevaRutaVirtual}`;
        }
    });

    document.getElementById("btn-google").addEventListener("click", () => {
        alert("Simulación de OAuth 2.0:\n\nRedirigiendo a los servidores seguros de Google...");
    });

    document.getElementById("btn-facebook").addEventListener("click", () => {
        alert("Simulación de OAuth 2.0:\n\nRedirigiendo a los servidores seguros de Facebook...");
    });
}
// Función asíncrona para buscar los recursos del cliente e inyectar su Panel de Control
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

        // C. Pintar el contenido del cliente Y su formulario de edición integrado abajo
        contenedor.innerHTML = `
            <div class="perfil-wrapper" style="display: flex; flex-direction: column; gap: 2rem; align-items: center; width: 100%;">
                
                <!-- Vista del Perfil (Lo que ven los visitantes) -->
                <div class="perfil-cliente" id="vista-perfil">
                    <h2 id="txt-empresa">${datosCliente.nombreEmpresa || nombreUsuario}</h2>
                    <p class="descripcion" id="txt-desc">${datosCliente.descripcionCorta || 'Bienvenido a mi sitio.'}</p>
                    <div class="contenido-personalizado" id="txt-bienvenida">${datosCliente.mensajeBienvenida || ''}</div>
                </div>

                <!-- Panel de Edición Exclusivo (Simulación de Dueño de la página) -->
                <div class="auth-box panel-edicion" style="text-align: left; max-width: 600px;">
                    <h3 style="margin-bottom: 1rem; color: #7928ca; font-size: 1.2rem; text-align: center;">⚙️ Panel de Control (Simulación Propietario)</h3>
                    
                    <form id="edit-perfil-form" class="registro-form">
                        <div class="form-group">
                            <label>Nombre de tu Empresa o Título:</label>
                            <input type="text" id="edit-nombre" value="${datosCliente.nombreEmpresa || ''}" required>
                        </div>
                        <div class="form-group">
                            <label>Descripción Corta:</label>
                            <input type="text" id="edit-desc" value="${datosCliente.descripcionCorta || ''}" required>
                        </div>
                        <div class="form-group">
                            <label>Mensaje de Bienvenida (Soporta HTML):</label>
                            <input type="text" id="edit-bienvenida" value='${datosCliente.mensajeBienvenida || ''}' required>
                        </div>
                        <button type="submit" class="btn btn-submit" style="background-color: #7928ca;">Guardar Cambios en Pantalla</button>
                    </form>
                    
                    <div style="text-align: center; margin-top: 1.5rem;">
                        <a href="${window.location.pathname}" style="color:#86868b; text-decoration:none; font-size:0.85rem;">← Cerrar Sesión (Volver al Inicio)</a>
                    </div>
                </div>

            </div>
        `;

        // Activar la reactividad del formulario de edición en tiempo real
        configurarEditorEnVivo();

    } catch (error) {
        console.error(error);
        contenedor.innerHTML = `
            <div class="perfil-cliente" style="border-top-color: #ff3b30;">
                <h2 style="color: #ff3b30;">Estructura Virtual Detectada</h2>
                <p class="descripcion">Identificador: <strong>${nombreUsuario}</strong></p>
                <div class="contenido-personalizado">
                    <p>¡El enrutador inteligente funcionó! Detectó tu ID correctamente, pero como estamos en una prueba de solo lectura local, tu carpeta física no existe en el disco duro todavía.</p>
                </div>
                <a href="${window.location.pathname}" style="display:inline-block; margin-top:2rem; color:#0071e3; text-decoration:none; font-size:0.9rem;">← Volver al Inicio General</a>
            </div>
        `;
    } finally {
        app.classList.add("ready");
    }
}

// Escucha el envío del editor y actualiza la tarjeta de arriba inmediatamente
function configurarEditorEnVivo() {
    const formEdicion = document.getElementById("edit-perfil-form");
    if (!formEdicion) return;

    formEdicion.addEventListener("submit", (e) => {
        e.preventDefault();

        // 1. Capturar los nuevos valores ingresados por el cliente
        const nuevoNombre = document.getElementById("edit-nombre").value;
        const nuevaDesc = document.getElementById("edit-desc").value;
        const nuevaBienvenida = document.getElementById("edit-bienvenida").value;

        // 2. Modificar el DOM de la vista del perfil al instante (Reactividad local)
        document.getElementById("txt-empresa").textContent = nuevoNombre;
        document.getElementById("txt-desc").textContent = nuevaDesc;
        document.getElementById("txt-bienvenida").innerHTML = nuevaBienvenida;

        alert("¡Cambios aplicados reactivamente en pantalla!\n\nNota académica: JavaScript ha actualizado el diseño visual. En el siguiente módulo implementaremos la API externa para que estos cambios se guarden de forma permanente en la nube sin usar MySQL.");
    });
}

