const inputNombreFormulario = document.getElementById("nombre-formulario");
const inputNombreCampo = document.getElementById("nombre-campo");
const inputTipoCampo = document.getElementById("tipo-campo");
const inputObligatorioCampoSi = document.getElementById("obligatorio-si");
const inputObligatorioCampoNo = document.getElementById("obligatorio-no");
const inputEsPlantilla = document.getElementById("guardar-plantilla");
const inputAgregarCampo = document.getElementById("btn-confirmar-campo");
const inputAgregarSeccion = document.getElementById("btn-confirmar-seccion");
const inputNombreSeccion = document.getElementById("nombre-seccion");
const botonAgregarSeccion = document.getElementById("btn-agregar-seccion");

const NOMBRES_TIPO = {texto: 'Texto', numero: 'Número', fecha: 'Fecha', seleccion: 'Selección'}

const formulario = {
    nombre: '',
    esPlantilla: false,
    secciones: [
        {
            id: 1,
            nombre: 'Informacion del centro',
            campos: []
        },

        {
            id: 2,
            nombre: 'Matricula',
            campos: []
        }
    ]
};

let seccionActivaId = null;
const modalCampo = new bootstrap.Modal(document.getElementById('modal-campo'));
const modalSeccion = new bootstrap.Modal(document.getElementById('modal-seccion'));

//Crea los campos de una seccion usando el template
function crearCampos(seccion) {
    const lista = document.getElementById('lista-campos-' + seccion.id);
    lista.replaceChildren();
    seccion.campos.forEach((campo) => {
        const copia = document.getElementById('plantilla-campo').content.cloneNode(true);
        copia.querySelector('.nombre-campo').textContent = campo.nombre;
        copia.querySelector('.tipo-campo').textContent = campo.tipo;
        copia.querySelector('.obligatorio-campo').textContent = campo.obligatorio ? 'Obligatorio' : 'Opcional';

        lista.appendChild(copia);
    });
}

function crearSecciones(formulario) {
    const lista = document.getElementById('lista-secciones-' + formulario.seccion);
    lista.replaceChildren();
    formulario.secciones.forEach((seccion) => {
        const copia = document.getElementById('plantilla-seeccion').content.cloneNode(true);
        copia.querySelector('.nombre-seccion').textContent = seccion.nombreSeccion;

        lista.appendChild(copia);
    });
}

//Funciones de validacion
function validarNombreFormulario(nombreFormulario) {
    if (nombreFormulario === '') {return 'El nombre del formulario no puede estar vacio';}
    if (nombreFormulario.length < 5) {return 'El nombre del formulario debe tener al menos 5 caracteres';}
    return '';
}

function validarNombreCampo(nombre, seccion) {
    if (nombre === '') {return 'Escriba el nombre del campo. Ejemplo: Cantidad de estudiantes';}
    if (nombre.length < 3) {return 'El nombre debe tener al menos 3 caracteres';}
    const repetido = seccion.campos.some((c) => c.nombre.toLowerCase() === nombre.toLowerCase());
    if (repetido) {return 'Ya existe un campo con ese nombre en la seccion.';}
    return '';
}

function validarTipoCampo(tipo) {
    if (tipo === '') {return 'Seleccione un tipo de dato. Ejemplo: Texto';}
    return '';
}

function validarObligatorio(marcado) {
    if (marcado === null) {return 'Seleccione una de las 2 opciones, Si o No'}
    return '';
}

function validarNombreSeccion(nombreSeccion, formulario) {
    if (nombreSeccion === '') {return 'Escriba el nombre de la seccion. Ejemplo: Oferta Educativa';}
    if (nombreSeccion.length < 5) {return 'El nombre debe tener al menos 5 caracteres';}
    const repetido = formulario.seccion.some((s) => s.nombre.toLowerCase() === nombreSeccion.toLowerCase());
    if (repetido) {return 'Ya existe una seccion con ese nombre en el formulario.';}
    return '';
}

function validarSecciones(secciones) {
    if (secciones.length === 0) {return 'Las secciones no pueden estar vacias, llenelas con al menos un campo';}
    return '';
}

function validarCampos(campos) {
    if (campos.length === 0) {
        return 'Una seccion no puede estar vacia, llenela con al menos un campo';
    }

    //Recorrer el arreglo campos
    for (const campo of campos) {
        if (!campo.nombre || campo.nombre.trim() === '') {
            return 'El nombre del campo tiene que tener al menos un caracter';
        }
        if (!Object.keys(NOMBRES_TIPO).includes(campo.tipo)) {
            return 'El tipo de campo no es valido, seleccione uno de los brindados';
        }
        if (typeof campo.obligatorio !== 'boolean') {
            return 'La propiedad obligatorio debe ser binaria';
        }
    }

    //Si no hay errores
    return '';
}

inputEsPlantilla.addEventListener('change', () => {
    formulario.esPlantilla = inputEsPlantilla.checked;
});

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

//Escuchador para cuando se presione el "Agregar Campo"
document.addEventListener('click', (evento) => {

    const boton = evento.target.closest('.btn-agregar-campo');
    if (!boton) return;
    seccionActivaId = Number(boton.dataset.seccionId);

    //Limpiar el formulario
    inputNombreCampo.value = '';
    inputTipoCampo.value = '';
    inputObligatorioCampoSi.checked = false;
    inputObligatorioCampoNo.checked = false;

    //Limpia los campos del modal y los errores
    inputNombreCampo.classList.remove('is-valid');
    inputNombreCampo.classList.remove('is-invalid');
    inputTipoCampo.classList.remove('is-valid');
    inputTipoCampo.classList.remove('is-invalid');
    document.getElementById('error-obligatorio').textContent = '';
    document.getElementById('error-nombre-campo').textContent = '';
    document.getElementById('error-tipo-campo').textContent = '';

    modalCampo.show();
});

//Cuando se presiona agregar en el modal
inputAgregarCampo.addEventListener('click', () => {
    const seccion = formulario.secciones.find((s) => s.id === seccionActivaId);

    const nombre = inputNombreCampo.value.trim();
    const tipo = inputTipoCampo.value;
    const marcado = document.querySelector('input[name="obligatorio"]:checked');


    const errorNombre = validarNombreCampo(nombre, seccion);
    const errorTipo = validarTipoCampo(tipo);
    const errorObligatorio = validarObligatorio(marcado);

    if (errorNombre !== '') {resaltarError(inputNombreCampo, errorNombre);}
    else {resaltarExito(inputNombreCampo);}

    if (errorTipo !== '') {resaltarError(inputTipoCampo, errorTipo);}
    else {resaltarExito(inputTipoCampo);}

    document.getElementById('error-obligatorio').textContent = errorObligatorio;

    if(errorNombre !== '' || errorTipo !== '' || errorObligatorio !== '') return;

    seccion.campos.push({nombre, tipo, obligatorio: marcado.value === 'si' });
    crearCampos(seccion);
    modalCampo.hide();
});

//Cuando se presiona continuar
document.getElementById('btn-continuar').addEventListener('click', () => {
    let error = false //Asumimos que no hay errores

    //Validar el nombre del formulario
    const nombreFormulario = inputNombreFormulario.value.trim();
    const errorNombreFormulario = validarNombreFormulario(nombreFormulario);

    if (errorNombreFormulario !== '') {
        resaltarError(inputNombreFormulario, errorNombreFormulario);
        error = true;
    } else {
        resaltarExito(inputNombreFormulario);
        formulario.nombre = nombreFormulario;        
    }

    //Validar secciones 
    const errorSecciones = validarSecciones(formulario.secciones);
    if (errorSecciones !== '') {
        document.getElementById('error-secciones').textContent = errorSecciones;
        error = true;
    } else {document.getElementById('error-secciones').textContent = '';}

    //Validar los campos de cada seccion
    for (const seccion of formulario.secciones) {
        const errorCampos = validarCampos(seccion.campos);
        if (errorCampos !== '') {
            document.getElementById('error-secciones').textContent = errorCampos;
            error = true;
            break;    
        }
    }

    if (error) {return;}

    alert('Formulario validado correctamente')
});

botonAgregarSeccion.addEventListener('click', () => {

    //Limpiar el formulario
    inputNombreSeccion.value = '';

    //Limpia los campos del modal y los errores
    inputNombreSeccion.classList.remove('is-valid');
    inputNombreSeccion.classList.remove('is-invalid');

    modalSeccion.show();
});

//Cuando se presiona agregar en el modal
inputAgregarSeccion.addEventListener('click', () => {
    const seccion = formulario.secciones.find((s) => s.id === seccionActivaId);

    const nombre = inputNombreSeccion.value.trim();

    const errorNombre = validarNombreCampo(nombreSeccion, formulario);

    if (errorNombre !== '') {resaltarError(inputNombreSeccion, errorNombre);}
    else {resaltarExito(inputNombreSeccion);}

    if(errorNombre !== '') return;

    formulario.secciones.push({nombre});
    crearSecciones(seccion);
    modalSeccion.hide();
});
