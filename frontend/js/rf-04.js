const inputNombre = document.getElementById('nombre-colaborador');
const inputCorreo = document.getElementById('correo');
const inputRol = document.getElementById('rol');
const inputEstado = document.getElementById('estado');
const formulario = document.querySelector('form');
const tablaColaboradores = document.getElementById('tabla-colaboradores');
const plantillaFila = document.getElementById('plantilla-fila');

const REGEX_NOMBRE = /^[A-Za-zÁÉÍÓÚÜáéíóúüÑñ]+( [A-Za-zÁÉÍÓÚÜáéíóúüÑñ]+)*$/;
const REGEX_CORREO = /^[a-z0-9._-]+@mep\.go\.cr$/i;
const ROLES_PERMITIDOS = ['tecnico-dae', 'supervisor'];
const ESTADOS_PERMITIDOS = ['activo', 'inactivo'];
//Para las badges
const NOMBRES_ROLES = {'tecnico-dae': 'Tecnico DAE', 'supervisor': 'Supervisor'}
//Guardar los colaboradores registrados, para la validacion del correo
let colaboradores = [];

function validarNombre(nombre) {
    if (nombre === '') {return 'Escriba el nombre del colaborador a registrar. Ej: Sebastian Bocan';}
    if (!REGEX_NOMBRE.test(nombre)) {return 'El nombre solo puede tener letras y espacios';}
    if (nombre.split(' ').length < 2) {return 'Escriba al menos un nombre y apellido';}
    return '';
}

function validarCorreo(correo) {
    if (correo === '') {return 'Escriba el correo del colaborador. Ej: sbocann@mep.go.cr';}
    if (!REGEX_CORREO.test(correo)) {return 'El correo debe seguir el formato name@mep.go.cr';}
    if (colaboradores.some(c => c.correo.toLowerCase() === correo.toLowerCase())) {return 'Este correo ya se encuentra registrado';}
    return '';
}

function validarRol(rol) {
    if (ROLES_PERMITIDOS.includes(rol)) {return '';}
    else {return 'El rol unicamente puede ser Tecnico DAE o Supervisor'}

}

function validarEstado(estado) {
    if (ESTADOS_PERMITIDOS.includes(estado)) {return '';}
    else {return 'El estado unicamente puede ser Activo o Inactivo'}
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

function limpiarFormulario() {
    [inputNombre, inputCorreo, inputRol, inputEstado].forEach(campo => {
        campo.classList.remove('is-valid', 'is-invalid');
        const error = document.getElementById('error-' + campo.id);
        if (error) {error.textContent = '';}
    });
}

function dibujarTabla() {
    tablaColaboradores.innerHTML = '';

    colaboradores.forEach(colaborador => {
        const copia = plantillaFila.content.cloneNode(true);
        copia.querySelector('.col-nombre').textContent = colaborador.nombre;
        copia.querySelector('.col-correo').textContent = colaborador.correo;
        const spanRol = copia.querySelector('.badge-rol');
        spanRol.textContent = NOMBRES_ROLES[colaborador.rol] || colaborador.rol;
        const estadoFormateado = colaborador.estado.charAt(0).toUpperCase() + colaborador.estado.slice(1);
        copia.querySelector('.col-estado').textContent = estadoFormateado;

        tablaColaboradores.appendChild(copia);
    })
}
formulario.addEventListener('submit', (evento) => {
    evento.preventDefault();
    // 1. Leer valores aplicando .trim()
    const nombre = inputNombre.value.trim();
    const correo = inputCorreo.value.trim();
    const rol = inputRol.value.trim();
    const estado = inputEstado.value.trim();

    // 2. Llamar validadores
    const errorNombre = validarNombre(nombre);
    const errorCorreo = validarCorreo(correo);
    const errorRol = validarRol(rol);
    const errorEstado = validarEstado(estado);

    // 3. Resaltar cada campo según corresponda
    if (errorNombre) { resaltarError(inputNombre, errorNombre); } else { resaltarExito(inputNombre); }
    if (errorCorreo) { resaltarError(inputCorreo, errorCorreo); } else { resaltarExito(inputCorreo); }
    if (errorRol) { resaltarError(inputRol, errorRol); } else { resaltarExito(inputRol); }
    if (errorEstado) { resaltarError(inputEstado, errorEstado); } else { resaltarExito(inputEstado); }

    // Si hay algún error, detenemos el proceso
    if (errorNombre || errorCorreo || errorRol || errorEstado) {return;}

    // 4. Si no hay errores, agregar el colaborador al arreglo
    const nuevoColaborador = { nombre, correo, rol, estado };
    colaboradores.push(nuevoColaborador);

    // Dibujar la tabla clonando la plantilla
    dibujarTabla();

    // 5. Limpiar el formulario y las clases de validación (is-valid)
    formulario.reset();
    limpiarFormulario();
});