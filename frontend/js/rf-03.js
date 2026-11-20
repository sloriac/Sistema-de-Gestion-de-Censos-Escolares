const formularioPeriodo = document.getElementById('formulario-periodo');
const selectFormulario = document.getElementById('formulario');
const inputApertura = document.getElementById('fecha-apertura');
const inputCierre = document.getElementById('fecha-cierre');
const badgeEstado = document.getElementById('estado-periodo');
const mensajeResultado = document.getElementById('mensaje-resultado');
const contenedorNotificaciones = document.getElementById('notificaciones');
const contenedorCalendario = document.getElementById('calendario');
const botonVolver = document.getElementById('btn-volver');

const CLAVE_PERIODOS = 'periodosCensales'; // RF-11 lee esta misma clave
const DIAS_AVISO = 3;
const FORMULARIOS = [
    { id: 'censo-inicial', nombre: 'Censo inicial' },
    { id: 'censo-final', nombre: 'Censo final' }
];
const ESTADOS = {
    programado: { texto: 'Programado', clase: 'text-bg-info' },
    activo: { texto: 'Activo', clase: 'text-bg-success' },
    cerrado: { texto: 'Cerrado', clase: 'text-bg-secondary' }
};
const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio',
    'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const DIAS_SEMANA = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

let periodos = [];
let mesVisible = new Date();

//Fechas (AAAA-MM-DD)
function textoAFecha(texto) {
    const [anio, mes, dia] = texto.split('-').map(Number);
    return new Date(anio, mes - 1, dia);
}

function fechaATexto(fecha) {
    const anio = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');
    return `${anio}-${mes}-${dia}`;
}

function hoyTexto() {
    return fechaATexto(new Date());
}

function diasEntre(desde, hasta) {
    const MS_POR_DIA = 24 * 60 * 60 * 1000;
    return Math.round((textoAFecha(hasta) - textoAFecha(desde)) / MS_POR_DIA);
}

function formatearFecha(texto) {
    return textoAFecha(texto).toLocaleDateString('es-CR', { day: 'numeric', month: 'long', year: 'numeric' });
}

function calcularEstado(apertura, cierre) {
    const hoy = hoyTexto();
    if (hoy < apertura) {return 'programado';}
    if (hoy > cierre) {return 'cerrado';}
    return 'activo';
}

function nombreFormulario(id) {
    const encontrado = FORMULARIOS.find(f => f.id === id);
    return encontrado ? encontrado.nombre : id;
}

//localStorage
function cargarPeriodos() {
    try {
        periodos = JSON.parse(localStorage.getItem(CLAVE_PERIODOS)) || [];
    } catch (error) {
        periodos = [];
    }
}

function guardarPeriodos() {
    try {
        localStorage.setItem(CLAVE_PERIODOS, JSON.stringify(periodos));
    } catch (error) {
        // Sin localStorage se trabaja solo en memoria
    }
}

//Validaciones
function validarFormulario(idFormulario) {
    if (idFormulario === '') {return 'Seleccione el formulario al que pertenece el período';}
    if (!FORMULARIOS.some(f => f.id === idFormulario)) {return 'El formulario seleccionado no es válido';}
    return '';
}

function validarApertura(apertura) {
    if (apertura === '') {return 'Seleccione la fecha de apertura';}
    if (apertura < hoyTexto()) {return 'La fecha de apertura no puede ser anterior a hoy';}
    return '';
}

function validarCierre(apertura, cierre, idFormulario) {
    if (cierre === '') {return 'Seleccione la fecha de cierre';}
    if (apertura === '') {return '';}
    if (cierre <= apertura) {return 'La fecha de cierre debe ser posterior a la de apertura';}
    const seTraslapa = periodos.some(p =>
        p.formulario === idFormulario && apertura <= p.cierre && cierre >= p.apertura
    );
    if (seTraslapa) {return 'Ya existe un período de este formulario que choca con esas fechas';}
    return '';
}

//Mensajes de exito o error y suu resaltado
function resaltarError(campo, mensaje) {
    campo.classList.remove('is-valid');
    campo.classList.add('is-invalid');
    document.getElementById('error-' + campo.id).textContent = mensaje;
}

function resaltarExito(campo) {
    campo.classList.remove('is-invalid');
    campo.classList.add('is-valid');
    document.getElementById('error-' + campo.id).textContent = '';
}

function limpiarFormulario() {
    [selectFormulario, inputApertura, inputCierre].forEach(campo => {
        campo.classList.remove('is-valid', 'is-invalid');
        document.getElementById('error-' + campo.id).textContent = '';
    });
}

function mostrarMensaje(texto, tipo) {
    mensajeResultado.textContent = texto;
    mensajeResultado.className = 'alert alert-' + tipo;
}

function mostrarEstado() {
    const apertura = inputApertura.value;
    const cierre = inputCierre.value;
    if (apertura === '' || cierre === '' || cierre <= apertura) {
        badgeEstado.textContent = 'Sin definir';
        badgeEstado.className = 'badge text-bg-light';
        return;
    }
    const estado = ESTADOS[calcularEstado(apertura, cierre)];
    badgeEstado.textContent = estado.texto;
    badgeEstado.className = 'badge ' + estado.clase;
}

//aviso 3 días antes del cierre
function revisarCierresProximos() {
    contenedorNotificaciones.replaceChildren();
    const hoy = hoyTexto();

    periodos.forEach(periodo => {
        if (calcularEstado(periodo.apertura, periodo.cierre) !== 'activo') {return;}
        const diasRestantes = diasEntre(hoy, periodo.cierre);
        if (diasRestantes > DIAS_AVISO) {return;}

        let cuando = `en ${diasRestantes} días`;
        if (diasRestantes === 1) {cuando = 'mañana';}
        if (diasRestantes === 0) {cuando = 'hoy';}

        const aviso = document.createElement('p');
        aviso.className = 'alert alert-warning';
        aviso.setAttribute('role', 'alert');
        aviso.textContent = `El período de "${nombreFormulario(periodo.formulario)}" cierra ${cuando} (${formatearFecha(periodo.cierre)}).`;
        contenedorNotificaciones.appendChild(aviso);
    });
}

//calendario
function crearBoton(texto, alHacerClic) {
    const boton = document.createElement('button');
    boton.type = 'button';
    boton.className = 'btn btn-outline-primary btn-sm';
    boton.textContent = texto;
    boton.addEventListener('click', alHacerClic);
    return boton;
}

function cambiarMes(cantidad) {
    mesVisible = new Date(mesVisible.getFullYear(), mesVisible.getMonth() + cantidad, 1);
    dibujarCalendario();
}

function periodosDelDia(textoDia) {
    return periodos.filter(p => p.apertura <= textoDia && textoDia <= p.cierre);
}

function dibujarCalendario() {
    contenedorCalendario.replaceChildren();
    const anio = mesVisible.getFullYear();
    const mes = mesVisible.getMonth();
    const hoy = hoyTexto();

    // 1. Encabezado: anterior | Mes Año | siguiente
    const encabezado = document.createElement('div');
    encabezado.className = 'd-flex justify-content-between align-items-center mb-2';
    const titulo = document.createElement('h3');
    titulo.className = 'h5 m-0';
    titulo.textContent = `${MESES[mes]} ${anio}`;
    encabezado.append(
        crearBoton('‹ Anterior', () => cambiarMes(-1)),
        titulo,
        crearBoton('Siguiente ›', () => cambiarMes(1))
    );

    // 2. Tabla con los días de la semana
    const tabla = document.createElement('table');
    tabla.className = 'table table-bordered text-center';
    const filaEncabezado = tabla.createTHead().insertRow();
    DIAS_SEMANA.forEach(nombreDia => {
        const th = document.createElement('th');
        th.scope = 'col';
        th.textContent = nombreDia;
        filaEncabezado.appendChild(th);
    });

    // 3. Días del mes
    const cuerpo = tabla.createTBody();
    const diasEnMes = new Date(anio, mes + 1, 0).getDate();
    const espaciosVacios = (new Date(anio, mes, 1).getDay() + 6) % 7; // lunes = 0

    let fila = cuerpo.insertRow();
    for (let i = 0; i < espaciosVacios; i++) {fila.insertCell();}

    for (let dia = 1; dia <= diasEnMes; dia++) {
        if (fila.cells.length === 7) {fila = cuerpo.insertRow();}
        const celda = fila.insertCell();
        const textoDia = fechaATexto(new Date(anio, mes, dia));
        celda.textContent = dia;

        const delDia = periodosDelDia(textoDia);
        if (delDia.length > 0) {
            celda.classList.add('table-primary');
            celda.title = delDia.map(p => nombreFormulario(p.formulario)).join(', ');
        }
        if (textoDia === hoy) {celda.classList.add('fw-bold', 'text-decoration-underline');}
    }
    while (fila.cells.length < 7) {fila.insertCell();}

    const envoltura = document.createElement('div');
    envoltura.className = 'table-responsive';
    envoltura.appendChild(tabla);

    // 4. Lista de períodos debajo del calendario
    const lista = document.createElement('ul');
    lista.className = 'list-group';
    if (periodos.length === 0) {
        const vacio = document.createElement('li');
        vacio.className = 'list-group-item';
        vacio.textContent = 'No hay períodos programados.';
        lista.appendChild(vacio);
    }
    periodos.forEach(p => {
        const item = document.createElement('li');
        item.className = 'list-group-item d-flex justify-content-between align-items-center';
        item.textContent = `${nombreFormulario(p.formulario)}: ${formatearFecha(p.apertura)} al ${formatearFecha(p.cierre)}`;
        const estado = ESTADOS[calcularEstado(p.apertura, p.cierre)];
        const badge = document.createElement('span');
        badge.className = 'badge ' + estado.clase;
        badge.textContent = estado.texto;
        item.appendChild(badge);
        lista.appendChild(item);
    });

    contenedorCalendario.append(encabezado, envoltura, lista);
}

//Eventos
function llenarFormularios() {
    FORMULARIOS.forEach(f => {
        const opcion = document.createElement('option');
        opcion.value = f.id;
        opcion.textContent = f.nombre;
        selectFormulario.appendChild(opcion);
    });
}

inputApertura.addEventListener('change', () => {
    inputCierre.min = inputApertura.value;
    mostrarEstado();
});
inputCierre.addEventListener('change', mostrarEstado);

formularioPeriodo.addEventListener('submit', (evento) => {
    evento.preventDefault();

    const idFormulario = selectFormulario.value;
    const apertura = inputApertura.value;
    const cierre = inputCierre.value;

    const errorFormulario = validarFormulario(idFormulario);
    const errorApertura = validarApertura(apertura);
    const errorCierre = validarCierre(apertura, cierre, idFormulario);

    if (errorFormulario) {resaltarError(selectFormulario, errorFormulario);} else {resaltarExito(selectFormulario);}
    if (errorApertura) {resaltarError(inputApertura, errorApertura);} else {resaltarExito(inputApertura);}
    if (errorCierre) {resaltarError(inputCierre, errorCierre);} else {resaltarExito(inputCierre);}

    if (errorFormulario || errorApertura || errorCierre) {
        mostrarMensaje('Revise los campos marcados en rojo.', 'danger');
        return;
    }

    periodos.push({ formulario: idFormulario, apertura, cierre });
    periodos.sort((a, b) => a.apertura.localeCompare(b.apertura));
    guardarPeriodos();

    mostrarMensaje(`Período guardado: del ${formatearFecha(apertura)} al ${formatearFecha(cierre)}.`, 'success');

    const fechaApertura = textoAFecha(apertura);
    mesVisible = new Date(fechaApertura.getFullYear(), fechaApertura.getMonth(), 1);
    dibujarCalendario();
    revisarCierresProximos();

    formularioPeriodo.reset();
    limpiarFormulario();
    mostrarEstado();
});

botonVolver.addEventListener('click', () => {
    window.location.href = 'rf-05.html';
});

cargarPeriodos();
llenarFormularios();
inputApertura.min = hoyTexto();
mostrarEstado();
dibujarCalendario();
revisarCierresProximos();