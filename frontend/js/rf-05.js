const totalCentros = document.getElementById('total-centros');
const totalAprobados = document.getElementById('total-completados');
const totalPendientes = document.getElementById('total-pendientes');
const porcentajeAvance = document.getElementById('porcentaje-avance');
const barraAvance = document.getElementById('barra-avance');
const tablaEstados = document.getElementById('tabla-estados');
const filtroRegion = document.getElementById('filtro-region');
const filtroCentro = document.getElementById('filtro-centro');
const mensajeDatos = document.getElementById('mensaje-datos');
const ultimaActualizacion = document.getElementById('ultima-actualizacion');

const CLAVE_CENSOS = 'sicen_rf07_censos'; // la misma clave que usa rf-07.js

//RF-07 aprobado se guarda como completado
const ESTADOS = [
    { clave: 'pendiente', texto: 'Pendiente' },
    { clave: 'en_proceso', texto: 'En proceso' },
    { clave: 'completado', texto: 'Aprobado' }
];

const REGIONES = {
    'Guápiles': 'Limón', 'Pococí': 'Limón', 'Siquirres': 'Limón', 'Limón': 'Limón',
    'Matina': 'Limón', 'Guácimo': 'Limón', 'Cariari': 'Limón', 'Puerto Viejo': 'Limón',
    'La Rita': 'Limón', 'Roxana': 'Limón', 'Batán': 'Limón', 'Bribrí': 'Limón',
    'Cahuita': 'Limón', 'Talamanca': 'Limón',
    'Turrialba': 'Cartago', 'Cartago': 'Cartago', 'Paraíso': 'Cartago', 'Orosi': 'Cartago',
    'Cervantes': 'Cartago', 'Tres Ríos': 'Cartago',
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

let censos = [];

//Datos
function cargarCensos() {
    try {
        censos = JSON.parse(localStorage.getItem(CLAVE_CENSOS)) || [];
    } catch (error) {
        censos = [];
    }
}

function obtenerRegion(censo) {
    // "CTP Guápiles" -> "Guápiles", "Escuela Ciudad Quesada" -> "Ciudad Quesada"
    const lugar = censo.centro.split(' ').slice(1).join(' ');
    return REGIONES[lugar] || 'Sin región';
}

//filtros
function llenarSelect(select, opciones, textoTodos) {
    const seleccionPrevia = select.value;
    select.replaceChildren();

    const opcionTodos = document.createElement('option');
    opcionTodos.value = '';
    opcionTodos.textContent = textoTodos;
    select.appendChild(opcionTodos);

    opciones.forEach(o => {
        const opcion = document.createElement('option');
        opcion.value = o.valor;
        opcion.textContent = o.texto;
        select.appendChild(opcion);
    });

    // Si la opción que estaba elegida sigue existiendo, se mantiene
    if (opciones.some(o => o.valor === seleccionPrevia)) {
        select.value = seleccionPrevia;
    }
}

function llenarRegiones() {
    const regiones = [...new Set(censos.map(obtenerRegion))];
    regiones.sort((a, b) => a.localeCompare(b, 'es'));
    llenarSelect(filtroRegion, regiones.map(r => ({ valor: r, texto: r })), 'Todas las regiones');
}

function llenarCentros() {
    const region = filtroRegion.value;
    const centros = censos.filter(c => region === '' || obtenerRegion(c) === region);
    centros.sort((a, b) => a.centro.localeCompare(b.centro, 'es'));
    llenarSelect(filtroCentro, centros.map(c => ({ valor: String(c.id), texto: c.centro })), 'Todos los centros');
}

function obtenerCensosFiltrados() {
    const region = filtroRegion.value;
    const idCentro = filtroCentro.value;
    return censos.filter(c =>
        (region === '' || obtenerRegion(c) === region) &&
        (idCentro === '' || String(c.id) === idCentro)
    );
}

//resumen con los 3 estados
function dibujarResumen() {
    const lista = obtenerCensosFiltrados();
    const total = lista.length;

    const conteo = { pendiente: 0, en_proceso: 0, completado: 0 };
    lista.forEach(c => {
        if (c.estado in conteo) {conteo[c.estado]++;}
    });

    const calcularPorcentaje = cantidad => total === 0 ? 0 : Math.round((cantidad * 100) / total);

    totalCentros.textContent = total;
    totalAprobados.textContent = conteo.completado;
    totalPendientes.textContent = conteo.pendiente;

    const avance = calcularPorcentaje(conteo.completado);
    porcentajeAvance.textContent = avance;
    barraAvance.style.width = avance + '%';
    barraAvance.setAttribute('aria-valuenow', avance);

    tablaEstados.replaceChildren();
    ESTADOS.forEach(estado => {
        const fila = tablaEstados.insertRow();
        fila.insertCell().textContent = estado.texto;
        fila.insertCell().textContent = conteo[estado.clave];
        fila.insertCell().textContent = calcularPorcentaje(conteo[estado.clave]) + '%';
    });

    mensajeDatos.classList.toggle('d-none', censos.length > 0);
    ultimaActualizacion.textContent = new Date().toLocaleTimeString('es-CR');
}

//actualización sin recargar
function actualizar() {
    cargarCensos();
    llenarRegiones();
    llenarCentros();
    dibujarResumen();
}

//se dispara cuando cambia el localStorage
window.addEventListener('storage', (evento) => {
    if (evento.key === CLAVE_CENSOS || evento.key === null) {
        actualizar();
    }
});

filtroRegion.addEventListener('change', () => {
    llenarCentros();
    dibujarResumen();
});
filtroCentro.addEventListener('change', dibujarResumen);

actualizar();