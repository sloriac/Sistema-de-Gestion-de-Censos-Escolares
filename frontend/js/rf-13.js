const listaCensos = document.getElementById('lista-censos');
const notificacion = document.getElementById('notificacion');

const detalleCenso = document.getElementById('detalle-censo');
const detallePeriodo = document.getElementById('detalle-periodo');
const detalleEstado = document.getElementById('detalle-estado');

const detalleObservaciones =
    document.getElementById('detalle-observaciones');

const motivoObservaciones =
    document.getElementById('motivo-observaciones');

const mensajeDetalle = document.getElementById('mensaje-detalle');

const botonVolver = document.getElementById('btn-volver');
const botonCerrarDetalle =
    document.getElementById('btn-cerrar-detalle');

// Datos de ejemplo para demostrar la consulta de censos.
const censos = [
    {
        id: 1,
        periodo: '2026',
        fechaEnvio: '10/11/2026',
        estado: 'Recibido',
        observaciones: ''
    },
    {
        id: 2,
        periodo: '2025',
        fechaEnvio: '15/10/2025',
        estado: 'Con observaciones',
        observaciones:
            'Se debe revisar la cantidad de estudiantes registrada, ya que no coincide con la información reportada. También se solicita verificar los datos de matrícula.'
    },
    {
        id: 3,
        periodo: '2024',
        fechaEnvio: '20/10/2024',
        estado: 'Aprobado',
        observaciones: ''
    }
];

function obtenerClaseEstado(estado) {
    if (estado === 'Recibido') {
        return 'estado-recibido';
    }

    if (estado === 'Con observaciones') {
        return 'estado-observaciones';
    }

    return 'estado-aprobado';
}

function mostrarNotificacion() {
    let censosConObservaciones = 0;

    for (let i = 0; i < censos.length; i++) {
        if (censos[i].estado === 'Con observaciones') {
            censosConObservaciones++;
        }
    }

    if (censosConObservaciones > 0) {
        notificacion.textContent =
            'Tiene ' + censosConObservaciones +
            ' censo(s) con observaciones pendientes de revisar.';

        notificacion.classList.remove('d-none');
    }
}

function mostrarCensos() {
    listaCensos.innerHTML = '';

    for (let i = 0; i < censos.length; i++) {
        const censo = censos[i];

        const fila = document.createElement('tr');

        const columnaPeriodo = document.createElement('td');
        columnaPeriodo.textContent = censo.periodo;

        const columnaFecha = document.createElement('td');
        columnaFecha.textContent = censo.fechaEnvio;

        const columnaEstado = document.createElement('td');

        const etiquetaEstado = document.createElement('span');
        etiquetaEstado.className =
            'estado-etiqueta ' + obtenerClaseEstado(censo.estado);

        etiquetaEstado.textContent = censo.estado;

        columnaEstado.appendChild(etiquetaEstado);

        const columnaAccion = document.createElement('td');

        const botonDetalle = document.createElement('button');
        botonDetalle.type = 'button';
        botonDetalle.className = 'btn btn-primary btn-sm';
        botonDetalle.textContent = 'Ver detalle';

        botonDetalle.addEventListener('click', function () {
            mostrarDetalle(censo);
        });

        columnaAccion.appendChild(botonDetalle);

        fila.appendChild(columnaPeriodo);
        fila.appendChild(columnaFecha);
        fila.appendChild(columnaEstado);
        fila.appendChild(columnaAccion);

        listaCensos.appendChild(fila);
    }
}

function mostrarDetalle(censo) {
    detallePeriodo.textContent = 'Período censal ' + censo.periodo;
    detalleEstado.textContent = censo.estado;

    detalleObservaciones.classList.add('d-none');
    mensajeDetalle.textContent = '';

    if (censo.estado === 'Con observaciones') {
        detalleObservaciones.classList.remove('d-none');
        motivoObservaciones.textContent = censo.observaciones;
    } else if (censo.estado === 'Aprobado') {
        mensajeDetalle.textContent =
            'El censo fue aprobado correctamente.';
    } else {
        mensajeDetalle.textContent =
            'El censo fue recibido y está pendiente de revisión.';
    }

    detalleCenso.classList.remove('d-none');

    detalleCenso.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

botonCerrarDetalle.addEventListener('click', function () {
    detalleCenso.classList.add('d-none');
});

botonVolver.addEventListener('click', function () {
    window.history.back();
});

// Mostrar la información al abrir la pantalla.
mostrarCensos();
mostrarNotificacion();