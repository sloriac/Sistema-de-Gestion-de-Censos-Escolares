const vistaLista = document.getElementById('vista-lista');
const vistaRevision = document.getElementById('vista-revision');
const tituloPagina = document.getElementById('titulo-pagina');
const botonVolver = document.getElementById('btn-volver');
const botonAprobar = document.getElementById('btn-aprobar');
const botonRechazar = document.getElementById('btn-rechazar');
const botonConfirmarAprobar = document.getElementById('btn-confirmar-aprobar');
const botonConfirmarRechazar = document.getElementById('btn-confirmar-rechazar');
const botonConfirmarHabilitar = document.getElementById('btn-confirmar-habilitar');
const inputMotivoRechazo = document.getElementById('motivo-rechazo');
const mensajeResultado = document.getElementById('mensaje-resultado');

const modalAprobar = new bootstrap.Modal(document.getElementById('modal-aprobar'));
const modalRechazar = new bootstrap.Modal(document.getElementById('modal-rechazar'));
const modalHabilitar = new bootstrap.Modal(document.getElementById('modal-habilitar'));

const NOMBRES_TIPO = {texto: 'Texto', numero: 'Número', fecha: 'Fecha', seleccion: 'Selección'};

const ESTADOS = {
    pendiente_aprobacion: 'Pendiente de aprobación',
    aprobado: 'Aprobado',
    rechazado: 'Rechazado',
    habilitado: 'Habilitado'
};

const CLASE_ESTADO = {
    pendiente_aprobacion: 'estado-pendiente',
    aprobado: 'estado-aprobado'
};

const MIN_CARACTERES_MOTIVO = 10;

//Datos de prueba (misma estructura que obtenerEstructura() del RF-01)
//TO-DO: reemplazar por GET al backend cuando exista el modulo de formularios
const formularios = [
    {
        id: 1,
        nombre: 'Censo Educativo 2026',
        estado: 'pendiente_aprobacion',
        fechaEnvio: '2026-11-10',
        secciones: [
            {
                nombre: 'Información del centro',
                campos: [
                    {etiqueta: 'Nombre del centro', tipoDato: 'texto', obligatorio: true},
                    {etiqueta: 'Código institucional', tipoDato: 'texto', obligatorio: true},
                    {etiqueta: 'Director', tipoDato: 'texto', obligatorio: true}
                ]
            },
            {
                nombre: 'Matrícula',
                campos: [
                    {etiqueta: 'Cantidad de estudiantes', tipoDato: 'numero', obligatorio: true},
                    {etiqueta: 'Hombres', tipoDato: 'numero', obligatorio: true},
                    {etiqueta: 'Mujeres', tipoDato: 'numero', obligatorio: true}
                ]
            }
        ]
    },
    {
        id: 2,
        nombre: 'Censo de Infraestructura 2026',
        estado: 'pendiente_aprobacion',
        fechaEnvio: '2026-11-11',
        secciones: [
            {
                nombre: 'Aulas',
                campos: [
                    {etiqueta: 'Cantidad de aulas', tipoDato: 'numero', obligatorio: true},
                    {etiqueta: 'Fecha de última remodelación', tipoDato: 'fecha', obligatorio: false}
                ]
            }
        ]
    },
    {
        id: 3,
        nombre: 'Censo de Personal Docente 2026',
        estado: 'aprobado',
        fechaEnvio: '2026-11-05',
        secciones: [
            {
                nombre: 'Docentes',
                campos: [
                    {etiqueta: 'Cantidad de docentes', tipoDato: 'numero', obligatorio: true}
                ]
            }
        ]
    }
];

let formularioActivoId = null;

function obtenerFormularioActivo() {
    return formularios.find((f) => f.id === formularioActivoId);
}

//Mensajes de resultado (exito / error)
function mostrarMensaje(texto, tipo) {
    mensajeResultado.textContent = texto;
    mensajeResultado.className = `alert alert-${tipo}`;
}

function ocultarMensaje() {
    mensajeResultado.className = 'alert d-none';
    mensajeResultado.textContent = '';
}

//Pone el nombre del formulario activo en los modales
function ponerNombreEnModales(nombre) {
    document.querySelectorAll('.nombre-modal').forEach((elemento) => {
        elemento.textContent = nombre;
    });
}

//---------- Vista 1: Lista ----------
function crearItemLista(formulario, textoAccion, claseAccion) {
    const copia = document.getElementById('plantilla-item-lista').content.cloneNode(true);
    const totalCampos = formulario.secciones.reduce((total, s) => total + s.campos.length, 0);

    copia.querySelector('.nombre-item').textContent = formulario.nombre;
    copia.querySelector('.detalle-item').textContent =
        `Enviado: ${formulario.fechaEnvio} · ${formulario.secciones.length} secciones · ${totalCampos} campos`;

    const boton = copia.querySelector('.accion-item');
    boton.textContent = textoAccion;
    boton.classList.add(claseAccion);
    boton.dataset.formularioId = formulario.id;
    return copia;
}

function dibujarLista() {
    const listaPendientes = document.getElementById('lista-pendientes');
    const listaAprobados = document.getElementById('lista-aprobados');
    listaPendientes.replaceChildren();
    listaAprobados.replaceChildren();

    const pendientes = formularios.filter((f) => f.estado === 'pendiente_aprobacion');
    const aprobados = formularios.filter((f) => f.estado === 'aprobado');

    pendientes.forEach((f) => listaPendientes.appendChild(crearItemLista(f, 'Revisar', 'btn-revisar')));
    aprobados.forEach((f) => listaAprobados.appendChild(crearItemLista(f, 'Habilitar', 'btn-habilitar')));

    document.getElementById('sin-pendientes').classList.toggle('d-none', pendientes.length > 0);
    document.getElementById('sin-aprobados').classList.toggle('d-none', aprobados.length > 0);
}

function mostrarLista() {
    formularioActivoId = null;
    vistaRevision.hidden = true;
    vistaLista.hidden = false;
    tituloPagina.textContent = 'Formularios Censales por Revisar';
    dibujarLista();
}

//---------- Vista 2: Revision ----------
function dibujarSeccion(seccion, indice) {
    const copia = document.getElementById('plantilla-seccion').content.cloneNode(true);
    const idPanel = 'revision-seccion' + indice;

    const boton = copia.querySelector('.boton-seccion');
    const panel = copia.querySelector('.panel-seccion');
    panel.id = idPanel;
    boton.dataset.bsTarget = '#' + idPanel;
    boton.setAttribute('aria-controls', idPanel);
    boton.textContent = `${indice}. ${seccion.nombre}`;

    const lista = copia.querySelector('.lista-campos');
    seccion.campos.forEach((campo) => {
        const copiaCampo = document.getElementById('plantilla-campo').content.cloneNode(true);
        copiaCampo.querySelector('.nombre-campo').textContent = campo.etiqueta;
        copiaCampo.querySelector('.tipo-campo').textContent = NOMBRES_TIPO[campo.tipoDato];
        copiaCampo.querySelector('.obligatorio-campo').textContent = campo.obligatorio ? 'Obligatorio' : 'Opcional';
        lista.appendChild(copiaCampo);
    });

    document.getElementById('acordion-revision').appendChild(copia);
}

function mostrarRevision(formulario) {
    formularioActivoId = formulario.id;
    ocultarMensaje();

    document.getElementById('nombre-revision').textContent = formulario.nombre;
    const estado = document.getElementById('estado-revision');
    estado.textContent = ESTADOS[formulario.estado];
    estado.className = 'badge ' + CLASE_ESTADO[formulario.estado];

    document.getElementById('acordion-revision').replaceChildren();
    formulario.secciones.forEach((seccion, i) => dibujarSeccion(seccion, i + 1));

    tituloPagina.textContent = 'Revisar Formulario Censal';
    vistaLista.hidden = true;
    vistaRevision.hidden = false;
}

//---------- Validaciones ----------
function validarMotivoRechazo(motivo) {
    if (motivo === '') {return 'Escriba el motivo del rechazo. Ejemplo: Falta la sección de matrícula';}
    if (motivo.length < MIN_CARACTERES_MOTIVO) {return `El motivo debe tener al menos ${MIN_CARACTERES_MOTIVO} caracteres`;}
    return '';
}

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

//---------- Escuchadores ----------

//Botones "Revisar" y "Habilitar" de la lista
document.getElementById('vista-lista').addEventListener('click', (evento) => {
    const botonRevisar = evento.target.closest('.btn-revisar');
    const botonHabilitar = evento.target.closest('.btn-habilitar');

    if (botonRevisar) {
        const formulario = formularios.find((f) => f.id === Number(botonRevisar.dataset.formularioId));
        mostrarRevision(formulario);
    }

    if (botonHabilitar) {
        formularioActivoId = Number(botonHabilitar.dataset.formularioId);
        ponerNombreEnModales(obtenerFormularioActivo().nombre);
        modalHabilitar.show();
    }
});

botonVolver.addEventListener('click', () => {
    if (!vistaRevision.hidden) {
        ocultarMensaje();
        mostrarLista();
    } else {
        history.back();
    }
});

//Aprobar
botonAprobar.addEventListener('click', () => {
    ponerNombreEnModales(obtenerFormularioActivo().nombre);
    modalAprobar.show();
});

botonConfirmarAprobar.addEventListener('click', () => {
    const formulario = obtenerFormularioActivo();
    formulario.estado = 'aprobado';
    //TO-DO: PATCH al backend con obtenerCambioEstado(formulario)

    modalAprobar.hide();
    mostrarLista();
    mostrarMensaje(`El formulario "${formulario.nombre}" fue aprobado. Ya puede habilitarlo para los centros educativos.`, 'success');
});

//Rechazar
botonRechazar.addEventListener('click', () => {
    ponerNombreEnModales(obtenerFormularioActivo().nombre);

    //Limpia el campo y los errores
    inputMotivoRechazo.value = '';
    inputMotivoRechazo.classList.remove('is-valid');
    inputMotivoRechazo.classList.remove('is-invalid');
    document.getElementById('error-motivo-rechazo').textContent = '';

    modalRechazar.show();
});

botonConfirmarRechazar.addEventListener('click', () => {
    const motivo = inputMotivoRechazo.value.trim();
    const errorMotivo = validarMotivoRechazo(motivo);

    if (errorMotivo !== '') {
        resaltarError(inputMotivoRechazo, errorMotivo);
        return;
    }
    resaltarExito(inputMotivoRechazo);

    const formulario = obtenerFormularioActivo();
    formulario.estado = 'rechazado';
    formulario.motivoRechazo = motivo;
    //TO-DO: PATCH al backend con obtenerCambioEstado(formulario)

    modalRechazar.hide();
    mostrarLista();
    mostrarMensaje(`El formulario "${formulario.nombre}" fue rechazado y devuelto al Técnico de la DAE.`, 'warning');
});

//Habilitar
botonConfirmarHabilitar.addEventListener('click', () => {
    const formulario = obtenerFormularioActivo();

    //Solo se puede habilitar un formulario aprobado por la Jefatura
    if (formulario.estado !== 'aprobado') {
        modalHabilitar.hide();
        mostrarMensaje('Solo se pueden habilitar formularios aprobados.', 'danger');
        return;
    }

    formulario.estado = 'habilitado';
    //TO-DO: PATCH al backend con obtenerCambioEstado(formulario)

    modalHabilitar.hide();
    mostrarLista();
    mostrarMensaje(`El formulario "${formulario.nombre}" fue habilitado para los centros educativos.`, 'success');
});

//Datos que se enviaran al backend al cambiar el estado
function obtenerCambioEstado(formulario) {
    const cambio = {estado: formulario.estado};
    if (formulario.estado === 'rechazado') {cambio.motivoRechazo = formulario.motivoRechazo;}
    return cambio;
}

mostrarLista();
