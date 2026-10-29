// ---------- Constantes ----------
const CLAVE_CENSOS = "sicen_rf07_censos";
const CLAVE_NOTIFICACIONES = "sicen_rf07_notificaciones";

const ESTADOS = {
    pendiente: "Pendiente",
    en_proceso: "En proceso",
    completado: "Completado"
};

// Clase CSS (rf-07.css) de cada estado
const CLASE_ESTADO = {
    pendiente: "estado-pendiente",
    en_proceso: "estado-en-proceso",
    completado: "estado-completado"
};

const SECCIONES_CENSO = [
    "Datos generales",
    "Infraestructura",
    "Matrícula",
    "Personal docente",
    "Servicios y equipamiento"
];

const MIN_CARACTERES_MOTIVO = 10;

// Técnico con sesión iniciada (simulado)
const TECNICO = { id: 1, nombre: "Técnico de la DAE" };

// ---------- Datos de prueba ----------
// 45 centros asignados al técnico (28 completados, 10 en proceso, 7 pendientes)
// + 3 centros de otro técnico (para probar el criterio de aceptación 3)
function generarCensos() {
    const lugares = [
        "Guápiles", "Pococí", "Siquirres", "Limón", "Matina", "Guácimo", "Cariari", "Río Frío",
        "Puerto Viejo", "Sarapiquí", "Horquetas", "La Rita", "Roxana", "Batán", "Bribrí", "Cahuita",
        "Talamanca", "Turrialba", "Cartago", "Paraíso", "Orosi", "Cervantes", "Tres Ríos", "San Pedro",
        "Curridabat", "Desamparados", "Alajuelita", "Escazú", "Santa Ana", "Heredia", "Barva",
        "Santo Domingo", "Alajuela", "Grecia", "Naranjo", "Sarchí", "Atenas", "Puntarenas", "Esparza",
        "Quepos", "Golfito", "San Carlos", "Ciudad Quesada", "Liberia", "Nicoya"
    ];
    const tipos = ["CTP", "Escuela", "Liceo", "Colegio"];
    const nombres = ["Ana", "Luis", "Carmen", "Jorge", "Patricia", "Mario", "Rosa", "Pedro", "Laura", "Diego"];
    const apellidos = ["Mora", "Vargas", "Rojas", "Soto", "Jiménez", "Quesada", "Araya", "Chaves", "Núñez", "Brenes"];

    // Estados repartidos de forma pseudoaleatoria, pero siempre iguales
    const estados = [
        ...Array(28).fill("completado"),
        ...Array(10).fill("en_proceso"),
        ...Array(7).fill("pendiente")
    ];
    let semilla = 7;
    const azar = () => {
        semilla = (semilla * 9301 + 49297) % 233280;
        return semilla / 233280;
    };
    for (let i = estados.length - 1; i > 0; i--) {
        const j = Math.floor(azar() * (i + 1));
        [estados[i], estados[j]] = [estados[j], estados[i]];
    }
    // El primer centro (CTP Guápiles) queda "En proceso", como en el wireframe
    const posicion = estados.indexOf("en_proceso");
    [estados[0], estados[posicion]] = [estados[posicion], estados[0]];

    const lista = lugares.map((lugar, i) => {
        const estado = estados[i];
        let progreso = 0;
        if (estado === "completado") progreso = 100;
        if (estado === "en_proceso") progreso = 20 + ((i * 17) % 70);
        if (i === 0) progreso = 65;

        const dia = String(((i * 5) % 27) + 1).padStart(2, "0");
        return {
            id: i + 1,
            codigo: i === 0 ? "1234567890" : String(2000000000 + i * 12345679).slice(0, 10),
            centro: `${tipos[i % 4]} ${lugar}`,
            director: `${nombres[i % 10]} ${apellidos[(i * 3) % 10]} ${apellidos[(i * 7) % 10]}`,
            estado: estado,
            progreso: progreso,
            actualizado: i === 0 ? "2026-09-28" : `2026-10-${dia}`,
            motivoRechazo: "",
            tecnicoId: TECNICO.id
        };
    });

    // Centros que pertenecen a otro técnico
    [
        ["Escuela Moravia", "Rosa Camacho Núñez"],
        ["Liceo Coronado", "Pedro Vega Ulate"],
        ["Colegio Tilarán", "Laura Brenes Mora"]
    ].forEach(([centro, director], n) => {
        lista.push({
            id: 100 + n,
            codigo: String(3000000000 + n * 1111111),
            centro: centro,
            director: director,
            estado: "en_proceso",
            progreso: 55,
            actualizado: "2026-10-20",
            motivoRechazo: "",
            tecnicoId: 2
        });
    });

    return lista;
}

// ---------- Estado de la aplicación ----------
let censos = [];
let notificaciones = [];
let censoActualId = null;   // centro abierto en la vista de detalle

// ---------- Modales y mensajes (Bootstrap) ----------
// Se obtienen al usarlos, así la página se pinta aunque el script de Bootstrap tarde o falle
function obtenerModal(id) {
    return bootstrap.Modal.getOrCreateInstance(document.getElementById(id));
}

// ---------- Utilidades ----------
const $ = id => document.getElementById(id);

function normalizarTexto(texto) {
    return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function hoyISO() {
    return new Date().toLocaleDateString("en-CA"); // AAAA-MM-DD en hora local
}

function formatearFecha(iso) {
    const [anio, mes, dia] = iso.split("-");
    return `${dia}/${mes}/${anio}`;
}

function formatearFechaHora(iso) {
    return new Date(iso).toLocaleString("es-CR", { dateStyle: "short", timeStyle: "short" });
}

// tipo: "exito" | "error" | "info"
function mostrarMensaje(texto, tipo = "info") {
    if (typeof bootstrap === "undefined") {
        alert(texto);
        return;
    }
    const toast = $("toast-mensaje");
    toast.classList.remove("text-bg-success", "text-bg-danger", "text-bg-dark");
    toast.classList.add({ exito: "text-bg-success", error: "text-bg-danger", info: "text-bg-dark" }[tipo]);
    $("toast-texto").textContent = texto;
    bootstrap.Toast.getOrCreateInstance(toast, { delay: 3500 }).show();
}

// ---------- Persistencia ----------
function guardar() {
    try {
        localStorage.setItem(CLAVE_CENSOS, JSON.stringify(censos));
        localStorage.setItem(CLAVE_NOTIFICACIONES, JSON.stringify(notificaciones));
    } catch (e) {
        // Si localStorage no está disponible se trabaja solo en memoria
    }
}

function cargar() {
    try {
        censos = JSON.parse(localStorage.getItem(CLAVE_CENSOS)) || generarCensos();
        notificaciones = JSON.parse(localStorage.getItem(CLAVE_NOTIFICACIONES)) || [];
    } catch (e) {
        censos = generarCensos();
        notificaciones = [];
    }
}

// ---------- Reglas de negocio ----------

// Criterio 3: el centro debe estar asignado al técnico
function esAsignado(censo) {
    return censo.tecnicoId === TECNICO.id;
}

function obtenerCensosAsignados() {
    return censos.filter(esAsignado);
}

// Criterio 3: aprobar -> "Completado" solo si el centro está asignado
function aprobarCenso(id) {
    const censo = censos.find(c => c.id === id);
    if (!censo) {
        mostrarMensaje("El censo no existe.", "error");
        return;
    }
    if (!esAsignado(censo)) {
        mostrarMensaje(`No puede aprobar el censo de ${censo.centro}: el centro no está asignado a usted.`, "error");
        return;
    }
    if (censo.estado !== "en_proceso") {
        mostrarMensaje("Solo se pueden aprobar censos que estén En proceso.", "error");
        return;
    }

    censo.estado = "completado";
    censo.progreso = 100;
    censo.motivoRechazo = "";
    censo.actualizado = hoyISO();
    guardar();
    navegar();
    mostrarMensaje(`Censo de ${censo.centro} aprobado. Estado: Completado.`, "exito");
}

// Criterio 2: rechazar -> notificar al director con el motivo
function rechazarCenso(id, motivo) {
    const censo = censos.find(c => c.id === id);
    if (!censo || !esAsignado(censo)) {
        mostrarMensaje("No puede rechazar un censo de un centro no asignado.", "error");
        return;
    }
    if (censo.estado !== "en_proceso") {
        mostrarMensaje("Solo se pueden rechazar censos que estén En proceso.", "error");
        return;
    }

    // Con solo 3 estados, un censo rechazado sigue "En proceso" para que el director lo corrija
    censo.motivoRechazo = motivo;
    censo.actualizado = hoyISO();

    notificaciones.unshift({
        censoId: censo.id,
        centro: censo.centro,
        director: censo.director,
        motivo: motivo,
        fecha: new Date().toISOString()
    });

    guardar();
    navegar();
    mostrarMensaje(`Censo rechazado. Se notificó a ${censo.director}.`, "exito");
}

// ---------- Vista 1: Inicio ----------
function mostrarInicio() {
    const lista = obtenerCensosAsignados();
    const total = lista.length;
    const completados = lista.filter(c => c.estado === "completado").length;
    const enProceso = lista.filter(c => c.estado === "en_proceso").length;
    const pendientes = lista.filter(c => c.estado === "pendiente").length;
    const porcentaje = total ? Math.round((completados / total) * 100) : 0;

    $("resumen-total").textContent = total;
    $("resumen-completado").textContent = completados;
    $("resumen-en-proceso").textContent = enProceso;
    $("resumen-pendiente").textContent = pendientes;

    $("barra-general").style.width = porcentaje + "%";
    $("barra-general").textContent = porcentaje + "%";
    $("progreso-general").setAttribute("aria-valuenow", porcentaje);
}

// ---------- Vista 2: Lista de censos ----------
function mostrarLista() {
    const tbody = $("tbody-censos");
    tbody.replaceChildren();

    const texto = normalizarTexto($("buscador").value.trim());
    const estado = $("filtro-estado").value;
    const asignados = obtenerCensosAsignados();

    const lista = asignados.filter(c => {
        const coincideTexto = !texto ||
            normalizarTexto(c.centro).includes(texto) ||
            c.codigo.includes(texto);
        const coincideEstado = estado === "todos" || c.estado === estado;
        return coincideTexto && coincideEstado;
    });

    $("sin-resultados").hidden = lista.length > 0;
    $("contador-resultados").textContent = `Mostrando ${lista.length} de ${asignados.length} centros`;

    const plantilla = $("plantilla-censo");
    lista.forEach(c => {
        const fila = plantilla.content.cloneNode(true);
        fila.querySelector(".centro-nombre").textContent = c.centro;
        fila.querySelector(".centro-codigo").textContent = c.codigo;

        const insignia = fila.querySelector(".centro-estado");
        insignia.textContent = ESTADOS[c.estado];
        insignia.classList.add(CLASE_ESTADO[c.estado]);

        fila.querySelector(".centro-ver").href = `#/centro/${c.id}`;
        tbody.appendChild(fila);
    });
}

// ---------- Vista 3: Detalle del centro ----------
function mostrarDetalle(id) {
    const censo = censos.find(c => c.id === id);

    // Criterio 3: no se puede acceder a centros no asignados
    if (!censo || !esAsignado(censo)) {
        censoActualId = null;
        $("contenido-centro").hidden = true;
        $("aviso-no-asignado").hidden = false;
        return;
    }

    censoActualId = censo.id;
    $("aviso-no-asignado").hidden = true;
    $("contenido-centro").hidden = false;

    $("titulo-centro").textContent = `Vista de centros educativos - ${censo.centro}`;
    $("detalle-codigo").textContent = censo.codigo;
    $("detalle-director").textContent = censo.director;

    const insignia = $("detalle-estado");
    insignia.textContent = ESTADOS[censo.estado];
    insignia.className = `badge ${CLASE_ESTADO[censo.estado]}`;

    $("detalle-porcentaje").textContent = censo.progreso + "%";
    $("detalle-barra").style.width = censo.progreso + "%";
    $("detalle-progreso").setAttribute("aria-valuenow", censo.progreso);
    $("detalle-fecha").textContent = formatearFecha(censo.actualizado);

    // Último motivo de rechazo (si lo hay)
    const motivo = $("detalle-motivo");
    motivo.hidden = !censo.motivoRechazo;
    if (censo.motivoRechazo) {
        motivo.textContent = "Censo rechazado. Motivo: " + censo.motivoRechazo;
    }

    // Aprobar y rechazar solo cuando el censo está "En proceso"
    const puedeActuar = censo.estado === "en_proceso";
    $("btn-aprobar").disabled = !puedeActuar;
    $("btn-rechazar").disabled = !puedeActuar;

    const ayuda = $("detalle-ayuda");
    ayuda.hidden = puedeActuar;
    if (censo.estado === "pendiente") ayuda.textContent = "El director aún no ha iniciado este censo.";
    if (censo.estado === "completado") ayuda.textContent = "Este censo ya fue aprobado.";

    mostrarNotificacionesDelCenso(censo.id);
}

function mostrarNotificacionesDelCenso(idCenso) {
    const propias = notificaciones.filter(n => n.censoId === idCenso);
    $("bloque-notificaciones").hidden = propias.length === 0;

    const lista = $("lista-notificaciones");
    lista.replaceChildren();

    const plantilla = $("plantilla-notificacion");
    propias.forEach(n => {
        const item = plantilla.content.cloneNode(true);
        item.querySelector(".notificacion-director").textContent = `Para: ${n.director}`;
        item.querySelector(".notificacion-motivo").textContent = `Motivo: ${n.motivo}`;
        item.querySelector(".notificacion-fecha").textContent = `Enviada el ${formatearFechaHora(n.fecha)}`;
        lista.appendChild(item);
    });
}

// ---------- Modales ----------
function abrirModalRechazo() {
    const censo = censos.find(c => c.id === censoActualId);
    if (!censo) return;

    $("texto-modal-rechazo").textContent = `${censo.centro}. Se notificará a ${censo.director}.`;
    const campo = $("motivo-rechazo");
    campo.value = "";
    campo.classList.remove("is-invalid");
    $("error-motivo-rechazo").textContent = "";
    $("contador-motivo").textContent = "0 / 500";
    obtenerModal("modal-rechazo").show();
}

function confirmarRechazo() {
    const campo = $("motivo-rechazo");
    const motivo = campo.value.trim();

    if (motivo.length < MIN_CARACTERES_MOTIVO) {
        campo.classList.add("is-invalid");
        $("error-motivo-rechazo").textContent =
            `Debe indicar el motivo del rechazo (mínimo ${MIN_CARACTERES_MOTIVO} caracteres).`;
        campo.focus();
        return;
    }

    obtenerModal("modal-rechazo").hide();
    rechazarCenso(censoActualId, motivo);
}

function abrirModalAprobar() {
    const censo = censos.find(c => c.id === censoActualId);
    if (!censo) return;

    $("texto-modal-aprobar").textContent =
        `¿Aprobar el censo de ${censo.centro}? Su estado pasará a Completado.`;
    obtenerModal("modal-aprobar").show();
}

function abrirModalCenso() {
    const censo = censos.find(c => c.id === censoActualId);
    if (!censo) return;

    $("titulo-modal-censo").textContent = `Censo - ${censo.centro}`;
    $("texto-modal-censo").textContent = `Avance del censo: ${censo.progreso}%`;

    const lista = $("lista-secciones-censo");
    lista.replaceChildren();

    const completas = Math.round((censo.progreso / 100) * SECCIONES_CENSO.length);
    const plantilla = $("plantilla-seccion-censo");
    SECCIONES_CENSO.forEach((nombre, i) => {
        const item = plantilla.content.cloneNode(true);
        item.querySelector(".seccion-nombre").textContent = nombre;

        const estado = item.querySelector(".seccion-estado");
        const estaCompleta = i < completas;
        estado.textContent = estaCompleta ? "Completa" : "Pendiente";
        estado.classList.add(estaCompleta ? "seccion-completa" : "seccion-pendiente");

        lista.appendChild(item);
    });

    obtenerModal("modal-censo").show();
}

// ---------- Enrutador ----------
function navegar() {
    const hash = location.hash || "#/inicio";
    const [vista, parametro] = hash.replace("#/", "").split("/");

    document.querySelectorAll(".vista").forEach(v => { v.hidden = true; });
    const destino = ["inicio", "censos", "centro", "reportes"].includes(vista) ? vista : "inicio";
    $("vista-" + destino).hidden = false;

    // Resaltar la opción activa del menú (el detalle cuenta como "Censos")
    const activa = destino === "centro" ? "censos" : destino;
    document.querySelectorAll(".menu-lateral a").forEach(enlace => {
        const esActivo = enlace.dataset.vista === activa;
        enlace.classList.toggle("active", esActivo);
        if (esActivo) {
            enlace.setAttribute("aria-current", "page");
        } else {
            enlace.removeAttribute("aria-current");
        }
    });

    if (destino === "inicio") mostrarInicio();
    if (destino === "censos") mostrarLista();
    if (destino === "centro") mostrarDetalle(Number(parametro));
}

// ---------- Eventos ----------
function iniciarEventos() {
    window.addEventListener("hashchange", navegar);

    // Lista: búsqueda y filtros
    $("buscador").addEventListener("input", mostrarLista);
    $("filtro-estado").addEventListener("change", mostrarLista);
    $("btn-limpiar-filtros").addEventListener("click", () => {
        $("filtro-estado").value = "todos";
        $("buscador").value = "";
        mostrarLista();
    });

    // Detalle: acciones del técnico
    $("btn-ver-censo").addEventListener("click", abrirModalCenso);
    $("btn-rechazar").addEventListener("click", abrirModalRechazo);
    $("btn-aprobar").addEventListener("click", abrirModalAprobar);

    $("btn-confirmar-aprobar").addEventListener("click", () => {
        obtenerModal("modal-aprobar").hide();
        aprobarCenso(censoActualId);
    });

    // Modal de rechazo
    const campoMotivo = $("motivo-rechazo");
    campoMotivo.addEventListener("input", () => {
        $("contador-motivo").textContent = `${campoMotivo.value.length} / 500`;
        if (campoMotivo.value.trim().length >= MIN_CARACTERES_MOTIVO) {
            campoMotivo.classList.remove("is-invalid");
            $("error-motivo-rechazo").textContent = "";
        }
    });
    $("btn-confirmar-rechazo").addEventListener("click", confirmarRechazo);

    // Demo del criterio 3: intentar aprobar un centro de otro técnico
    $("btn-demo-no-asignado").addEventListener("click", () => {
        const ajeno = censos.find(c => !esAsignado(c));
        if (ajeno) aprobarCenso(ajeno.id);
    });

    // Utilidades de prueba
    $("btn-reiniciar").addEventListener("click", () => {
        try {
            localStorage.removeItem(CLAVE_CENSOS);
            localStorage.removeItem(CLAVE_NOTIFICACIONES);
        } catch (e) {
            // Sin acceso a localStorage
        }
        cargar();
        navegar();
        mostrarMensaje("Datos de prueba reiniciados.", "exito");
    });

    $("btn-cerrar-sesion").addEventListener("click", () => {
        mostrarMensaje("Sesión cerrada (simulado en el prototipo).");
    });
}

// ---------- Inicio ----------
document.addEventListener("DOMContentLoaded", () => {
    cargar();
    iniciarEventos();
    navegar();
});