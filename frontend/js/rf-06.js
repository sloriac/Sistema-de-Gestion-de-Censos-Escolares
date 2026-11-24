const formularioReportes = document.getElementById('formulario-reportes');
const selectPeriodo = document.getElementById('periodo');
const selectRegion = document.getElementById('region');
const selectEstado = document.getElementById('estado');
const mensajeResultado = document.getElementById('mensaje-resultado');

const seccionResultados = document.getElementById('seccion-resultados');
const estadoDatos = document.getElementById('estado-datos');
const fechaGenerado = document.getElementById('fecha-generado');
const tablaReporte = document.getElementById('tabla-reporte');
const spanCentros = document.getElementById('centros-registrados');
const spanAprobados = document.getElementById('censos-completados');
const spanEnProceso = document.getElementById('censos-en-proceso');
const spanPendientes = document.getElementById('censos-pendientes');
const spanObservaciones = document.getElementById('censos-observaciones');

const botonExcel = document.getElementById('btn-descargar-excel');
const botonPdf = document.getElementById('btn-descargar-pdf');
const botonVolver = document.getElementById('btn-volver');

// ===== Constantes =====
const CLAVE_CENSOS = 'sicen_rf07_censos';   // la guarda rf-07.js
const CLAVE_PERIODOS = 'periodosCensales';  // la guarda rf-03.js

const ESTADOS_PERIODO = { activo: 'En curso', cerrado: 'Cerrado' };
const ENCABEZADOS = ['Período', 'Estado', 'Centros', 'Aprobados', 'En proceso', 'Pendientes', 'Con observaciones'];

// Igual que en rf-05.js: RF-07 no guarda la región
const REGIONES = {
    'Guápiles': 'Limón', 'Pococí': 'Limón', 'Siquirres': 'Limón', 'Limón': 'Limón',
    'Matina': 'Limón', 'Guácimo': 'Limón',
    'San Pedro': 'San José', 'Curridabat': 'San José', 'Desamparados': 'San José',
    'Alajuelita': 'San José', 'Escazú': 'San José', 'Santa Ana': 'San José',
    'Moravia': 'San José', 'Coronado': 'San José',
    'Heredia': 'Heredia', 'Barva': 'Heredia', 'Santo Domingo': 'Heredia',
    'Sarapiquí': 'Heredia', 'Horquetas': 'Heredia', 'Río Frío': 'Heredia',
    'Alajuela': 'Alajuela', 'Grecia': 'Alajuela', 'Naranjo': 'Alajuela', 'Sarchí': 'Alajuela',
    'Atenas': 'Alajuela', 'San Carlos': 'Alajuela', 'Ciudad Quesada': 'Alajuela',
    'Puntarenas': 'Puntarenas', 'Esparza': 'Puntarenas', 'Quepos': 'Puntarenas', 'Golfito': 'Puntarenas',
    'Liberia': 'Guanacaste', 'Nicoya': 'Guanacaste', 'Tilarán': 'Guanacaste'
};

// Datos de prueba de períodos anteriores (ya cerrados), resumidos por región
const PERIODOS_HISTORICOS = [
    {
        nombre: 'Censo 2025', apertura: '2025-02-03', cierre: '2025-03-28',
        regiones: {
            'Alajuela':   { completado: 6,  en_proceso: 0, pendiente: 1, observaciones: 1 },
            'Cartago':    { completado: 6,  en_proceso: 0, pendiente: 0, observaciones: 2 },
            'Guanacaste': { completado: 2,  en_proceso: 0, pendiente: 1, observaciones: 0 },
            'Heredia':    { completado: 5,  en_proceso: 0, pendiente: 1, observaciones: 1 },
            'Limón':      { completado: 13, en_proceso: 0, pendiente: 1, observaciones: 3 },
            'Puntarenas': { completado: 4,  en_proceso: 0, pendiente: 0, observaciones: 1 },
            'San José':   { completado: 9,  en_proceso: 0, pendiente: 2, observaciones: 2 }
        }
    },
    {
        nombre: 'Censo 2024', apertura: '2024-02-05', cierre: '2024-03-29',
        regiones: {
            'Alajuela':   { completado: 5,  en_proceso: 0, pendiente: 2, observaciones: 1 },
            'Cartago':    { completado: 7,  en_proceso: 0, pendiente: 1, observaciones: 1 },
            'Guanacaste': { completado: 3,  en_proceso: 0, pendiente: 0, observaciones: 0 },
            'Heredia':    { completado: 4,  en_proceso: 0, pendiente: 2, observaciones: 1 },
            'Limón':      { completado: 11, en_proceso: 0, pendiente: 3, observaciones: 4 },
            'Puntarenas': { completado: 3,  en_proceso: 0, pendiente: 1, observaciones: 0 },
            'San José':   { completado: 7,  en_proceso: 0, pendiente: 1, observaciones: 3 }
        }
    }
];

let periodosDisponibles = [];
let reporteActual = null;

// ===== Utilidades =====
function hoyTexto() {
    const ahora = new Date();
    const mes = String(ahora.getMonth() + 1).padStart(2, '0');
    const dia = String(ahora.getDate()).padStart(2, '0');
    return `${ahora.getFullYear()}-${mes}-${dia}`;
}

function formatearFecha(texto) {
    const [anio, mes, dia] = texto.split('-');
    return `${dia}/${mes}/${anio}`;
}

function leerLocalStorage(clave) {
    try {
        return JSON.parse(localStorage.getItem(clave)) || [];
    } catch (error) {
        return [];
    }
}

function mostrarMensaje(texto, tipo) {
    mensajeResultado.textContent = texto;
    mensajeResultado.className = 'alert alert-' + tipo;
}

function agregarOpcion(select, valor, texto) {
    const opcion = document.createElement('option');
    opcion.value = valor;
    opcion.textContent = texto;
    select.appendChild(opcion);
}

// ===== Datos =====
function obtenerRegion(censo) {
    const lugar = censo.centro.split(' ').slice(1).join(' ');
    return REGIONES[lugar] || 'Sin región';
}

// Convierte la lista de censos de RF-07 al mismo formato que PERIODOS_HISTORICOS
function agruparPorRegion(censos) {
    const regiones = {};
    censos.forEach(censo => {
        const region = obtenerRegion(censo);
        if (!regiones[region]) {
            regiones[region] = { completado: 0, en_proceso: 0, pendiente: 0, observaciones: 0 };
        }
        if (censo.estado in regiones[region]) {regiones[region][censo.estado]++;}
        if (censo.motivoRechazo) {regiones[region].observaciones++;}
    });
    return regiones;
}

// El período actual es el último de RF-03 que ya abrió; sus datos son los de RF-07
function obtenerPeriodoActual() {
    const hoy = hoyTexto();
    const iniciados = leerLocalStorage(CLAVE_PERIODOS).filter(p => p.apertura <= hoy);
    if (iniciados.length === 0) {return null;}

    iniciados.sort((a, b) => a.apertura.localeCompare(b.apertura));
    const periodo = iniciados[iniciados.length - 1];
    return {
        nombre: `Período ${formatearFecha(periodo.apertura)} al ${formatearFecha(periodo.cierre)}`,
        apertura: periodo.apertura,
        cierre: periodo.cierre,
        regiones: agruparPorRegion(leerLocalStorage(CLAVE_CENSOS))
    };
}

function estadoDelPeriodo(periodo) {
    return hoyTexto() <= periodo.cierre ? 'activo' : 'cerrado';
}

function cargarPeriodos() {
    const actual = obtenerPeriodoActual();
    periodosDisponibles = actual ? [actual, ...PERIODOS_HISTORICOS] : [...PERIODOS_HISTORICOS];
    periodosDisponibles.sort((a, b) => b.apertura.localeCompare(a.apertura)); // más reciente primero
}

// ===== Criterio 1: filtro por número de períodos =====
function llenarFiltros() {
    periodosDisponibles.forEach((periodo, i) => {
        const cantidad = i + 1;
        const texto = cantidad === 1 ? 'Último período' : `Últimos ${cantidad} períodos`;
        agregarOpcion(selectPeriodo, cantidad, texto);
    });

    const regiones = new Set();
    periodosDisponibles.forEach(periodo => {
        Object.keys(periodo.regiones).forEach(region => regiones.add(region));
    });
    [...regiones].sort((a, b) => a.localeCompare(b, 'es')).forEach(region => {
        agregarOpcion(selectRegion, region, region);
    });

    Object.entries(ESTADOS_PERIODO).forEach(([valor, texto]) => {
        agregarOpcion(selectEstado, valor, texto);
    });
}

function sumarRegiones(periodo, region) {
    const suma = { completado: 0, en_proceso: 0, pendiente: 0, observaciones: 0 };
    Object.entries(periodo.regiones).forEach(([nombre, datos]) => {
        if (region !== '' && nombre !== region) {return;}
        Object.keys(suma).forEach(clave => {
            suma[clave] += datos[clave];
        });
    });
    suma.centros = suma.completado + suma.en_proceso + suma.pendiente;
    return suma;
}

function generarReporte(cantidad, region, estado) {
    const filas = periodosDisponibles
        .slice(0, cantidad)
        .filter(p => estado === '' || estadoDelPeriodo(p) === estado)
        .map(p => ({ periodo: p.nombre, estado: estadoDelPeriodo(p), ...sumarRegiones(p, region) }));

    const totales = { centros: 0, completado: 0, en_proceso: 0, pendiente: 0, observaciones: 0 };
    filas.forEach(fila => {
        Object.keys(totales).forEach(clave => {
            totales[clave] += fila[clave];
        });
    });

    return {
        filas,
        totales,
        enCurso: filas.filter(f => f.estado === 'activo').map(f => f.periodo),
        region: region === '' ? 'Todas las regiones' : region,
        generado: new Date()
    };
}

// ===== Criterio 2: indicar si los datos están completos =====
function textoEstadoDatos(reporte) {
    if (reporte.enCurso.length > 0) {
        return `Datos incompletos: ${reporte.enCurso.join(', ')} sigue en curso, los números pueden cambiar.`;
    }
    return 'Datos completos: todos los períodos incluidos ya cerraron.';
}

function filaATexto(fila) {
    return [fila.periodo, ESTADOS_PERIODO[fila.estado], fila.centros, fila.completado,
        fila.en_proceso, fila.pendiente, fila.observaciones];
}

function filasParaExportar(reporte) {
    const t = reporte.totales;
    return [
        ...reporte.filas.map(filaATexto),
        ['Total', '', t.centros, t.completado, t.en_proceso, t.pendiente, t.observaciones]
    ];
}

function mostrarReporte(reporte) {
    spanCentros.textContent = reporte.totales.centros;
    spanAprobados.textContent = reporte.totales.completado;
    spanEnProceso.textContent = reporte.totales.en_proceso;
    spanPendientes.textContent = reporte.totales.pendiente;
    spanObservaciones.textContent = reporte.totales.observaciones;

    estadoDatos.textContent = textoEstadoDatos(reporte);
    estadoDatos.className = reporte.enCurso.length > 0 ? 'alert alert-warning' : 'alert alert-success';
    fechaGenerado.textContent = reporte.generado.toLocaleString('es-CR');

    tablaReporte.replaceChildren();
    filasParaExportar(reporte).forEach(valores => {
        const fila = tablaReporte.insertRow();
        valores.forEach(valor => {
            fila.insertCell().textContent = valor;
        });
    });

    seccionResultados.classList.remove('d-none');
}

// ===== Criterio 3: exportar =====
function nombreArchivo(extension) {
    return `reporte-censal-${hoyTexto()}.${extension}`;
}

function exportarExcel() {
    if (!reporteActual) {return;}
    if (typeof XLSX === 'undefined') {
        mostrarMensaje('No se pudo cargar la librería de Excel. Revise su conexión a internet.', 'danger');
        return;
    }
    const filas = [
        ['Reporte estadístico consolidado - SICEN'],
        ['Generado', reporteActual.generado.toLocaleString('es-CR')],
        ['Región', reporteActual.region],
        ['Estado de los datos', textoEstadoDatos(reporteActual)],
        [],
        ENCABEZADOS,
        ...filasParaExportar(reporteActual)
    ];
    const hoja = XLSX.utils.aoa_to_sheet(filas);
    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, 'Reporte');
    XLSX.writeFile(libro, nombreArchivo('xlsx'));
}

function exportarPdf() {
    if (!reporteActual) {return;}
    if (typeof window.jspdf === 'undefined') {
        mostrarMensaje('No se pudo cargar la librería de PDF. Revise su conexión a internet.', 'danger');
        return;
    }
    const { jsPDF } = window.jspdf;
    const documento = new jsPDF({ orientation: 'landscape' });

    documento.setFontSize(16);
    documento.text('Reporte estadístico consolidado - SICEN', 14, 18);
    documento.setFontSize(11);
    documento.text(`Generado: ${reporteActual.generado.toLocaleString('es-CR')}`, 14, 28);
    documento.text(`Región: ${reporteActual.region}`, 14, 35);
    documento.text(documento.splitTextToSize(textoEstadoDatos(reporteActual), 265), 14, 42);

    documento.autoTable({
        startY: 52,
        head: [ENCABEZADOS],
        body: filasParaExportar(reporteActual)
    });
    documento.save(nombreArchivo('pdf'));
}

// ===== Criterio 2: generar el reporte en cualquier momento =====
formularioReportes.addEventListener('submit', evento => {
    evento.preventDefault();

    const cantidad = Number(selectPeriodo.value);
    if (!cantidad) {
        selectPeriodo.classList.add('is-invalid');
        mostrarMensaje('Seleccione cuántos períodos desea incluir en el reporte.', 'danger');
        return;
    }
    selectPeriodo.classList.remove('is-invalid');

    cargarPeriodos(); // se vuelven a leer los datos: el reporte siempre sale con lo más reciente
    const reporte = generarReporte(cantidad, selectRegion.value, selectEstado.value);

    if (reporte.filas.length === 0) {
        reporteActual = null;
        seccionResultados.classList.add('d-none');
        mostrarMensaje('Ningún período coincide con los filtros elegidos.', 'warning');
        return;
    }

    reporteActual = reporte;
    mostrarReporte(reporte);
    mostrarMensaje('Reporte generado correctamente.', 'success');
});

botonExcel.addEventListener('click', exportarExcel);
botonPdf.addEventListener('click', exportarPdf);
botonVolver.addEventListener('click', () => {
    window.location.href = 'rf-05.html';
});

// ===== Inicio =====
cargarPeriodos();
llenarFiltros();