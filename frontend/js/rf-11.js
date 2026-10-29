const formulario = document.getElementById('formulario-censal');
const cantidadEstudiantes = document.getElementById('cantidad-estudiantes');
const cantidadSecciones = document.getElementById('cantidad-secciones');
const observaciones = document.getElementById('observaciones');

const botonBorrador = document.getElementById('btn-borrador');
const botonEnviar = document.getElementById('btn-enviar');
const botonVolver = document.getElementById('btn-volver');

const estadoPeriodo = document.getElementById('estado-periodo');
const mensaje = document.getElementById('mensaje');

// Cambiar a false para probar un período inactivo.
let periodoActivo = true;

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
        botonBorrador.disabled = false;
        botonEnviar.disabled = false;
    } else {
        estadoPeriodo.textContent =
            'El período censal está inactivo. No se puede enviar el formulario.';

        estadoPeriodo.className = 'alert alert-danger';
        botonBorrador.disabled = true;
        botonEnviar.disabled = true;
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

botonBorrador.addEventListener('click', function () {
    if (!periodoActivo) {
        mostrarMensaje('El período censal está inactivo.', 'danger');
        return;
    }

    mostrarMensaje(
        'Borrador de demostración. Los datos no se guardaron permanentemente.',
        'info'
    );
});

formulario.addEventListener('submit', function (evento) {
    evento.preventDefault();

    if (!periodoActivo) {
        mostrarMensaje(
            'No se puede enviar el formulario porque el período censal está inactivo.',
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
        'Formulario validado correctamente. El envío es una demostración; no se guardaron datos ni se enviaron notificaciones reales.',
        'success'
    );
});

botonVolver.addEventListener('click', function () {
    window.history.back();
});

actualizarPeriodo();