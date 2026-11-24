const formulario = document.getElementById('formulario-censal');
const cantidadEstudiantes = document.getElementById('cantidad-estudiantes');
const cantidadSecciones = document.getElementById('cantidad-secciones');
const observaciones = document.getElementById('observaciones');

const botonBorrador = document.getElementById('btn-borrador');
const botonEnviar = document.getElementById('btn-enviar');
const botonVolver = document.getElementById('btn-volver');

const estadoPeriodo = document.getElementById('estado-periodo');
const mensaje = document.getElementById('mensaje');
const estadoBorrador = document.getElementById('estado-borrador');

// Cambiar a false para probar un período inactivo.
let periodoActivo = true;

// Clave utilizada para guardar el borrador en el navegador.
const claveBorrador = 'sicen_rf11_borrador';

function mostrarMensaje(texto, tipo) {
    mensaje.textContent = texto;
    mensaje.className = 'alert alert-' + tipo;
}

function validarCantidad(campo) {
    const valor = campo.value.trim();
    const cantidad = Number(valor);

    if (valor === '' || !Number.isInteger(cantidad) || cantidad < 0) {
        campo.classList.remove('is-valid');
        campo.classList.add('is-invalid');
        return false;
    }

    campo.classList.remove('is-invalid');
    campo.classList.add('is-valid');
    return true;
}

function actualizarPeriodo() {
    if (periodoActivo) {
        estadoPeriodo.textContent =
            'Período censal activo. Puede completar el formulario.';

        estadoPeriodo.className = 'alert alert-success';

        cantidadEstudiantes.readOnly = false;
        cantidadSecciones.readOnly = false;
        observaciones.readOnly = false;

        botonBorrador.disabled = false;
        botonEnviar.disabled = false;
    } else {
        estadoPeriodo.textContent =
            'El período censal está inactivo. Puede consultar el borrador, pero no modificarlo.';

        estadoPeriodo.className = 'alert alert-danger';

        cantidadEstudiantes.readOnly = true;
        cantidadSecciones.readOnly = true;
        observaciones.readOnly = true;

        botonBorrador.disabled = true;
        botonEnviar.disabled = true;
    }
}

function guardarBorrador() {
    if (!periodoActivo) {
        mostrarMensaje(
            'No se puede modificar el borrador porque el período está inactivo.',
            'danger'
        );
        return;
    }

    const datosBorrador = {
        cantidadEstudiantes: cantidadEstudiantes.value,
        cantidadSecciones: cantidadSecciones.value,
        observaciones: observaciones.value,
        fechaGuardado: new Date().toLocaleString()
    };

    try {
        localStorage.setItem(
            claveBorrador,
            JSON.stringify(datosBorrador)
        );

        estadoBorrador.textContent =
            'Borrador guardado el ' + datosBorrador.fechaGuardado;

        estadoBorrador.className = 'alert alert-info';

        mostrarMensaje(
            'El borrador se guardó correctamente. Puede continuar después.',
            'success'
        );
    } catch (error) {
        mostrarMensaje(
            'No fue posible guardar el borrador en este navegador.',
            'danger'
        );
    }
}

function recuperarBorrador() {
    try {
        const borradorGuardado = localStorage.getItem(claveBorrador);

        if (borradorGuardado !== null) {
            const datosBorrador = JSON.parse(borradorGuardado);

            cantidadEstudiantes.value =
                datosBorrador.cantidadEstudiantes;

            cantidadSecciones.value =
                datosBorrador.cantidadSecciones;

            observaciones.value =
                datosBorrador.observaciones;

            estadoBorrador.textContent =
                'Se recuperó un borrador guardado anteriormente. Fecha: ' +
                datosBorrador.fechaGuardado;

            estadoBorrador.className = 'alert alert-info';

            mostrarMensaje(
                'Se recuperaron los datos del borrador.',
                'success'
            );
        }
    } catch (error) {
        mostrarMensaje(
            'No fue posible recuperar el borrador guardado.',
            'danger'
        );
    }
}

cantidadEstudiantes.addEventListener('input', function () {
    if (cantidadEstudiantes.value !== '') {
        validarCantidad(cantidadEstudiantes);
    } else {
        cantidadEstudiantes.classList.remove('is-invalid', 'is-valid');
    }
});

cantidadSecciones.addEventListener('input', function () {
    if (cantidadSecciones.value !== '') {
        validarCantidad(cantidadSecciones);
    } else {
        cantidadSecciones.classList.remove('is-invalid', 'is-valid');
    }
});

botonBorrador.addEventListener('click', guardarBorrador);

formulario.addEventListener('submit', function (evento) {
    evento.preventDefault();

    if (!periodoActivo) {
        mostrarMensaje(
            'No se puede enviar el formulario porque el período está inactivo.',
            'danger'
        );
        return;
    }

    const estudiantesValidos = validarCantidad(cantidadEstudiantes);
    const seccionesValidas = validarCantidad(cantidadSecciones);

    if (!estudiantesValidos || !seccionesValidas) {
        mostrarMensaje(
            'Revise los campos marcados en rojo antes de continuar.',
            'danger'
        );
        return;
    }

    mostrarMensaje(
        'Formulario validado correctamente. El envío es una demostración; todavía no se conecta con el backend.',
        'success'
    );
});

botonVolver.addEventListener('click', function () {
    window.history.back();
});

// Al abrir la página, primero recupera el borrador
// y después verifica si el período está activo.
recuperarBorrador();
actualizarPeriodo();