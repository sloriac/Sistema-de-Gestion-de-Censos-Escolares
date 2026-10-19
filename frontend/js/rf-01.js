const inputNombreFormulario = document.getElementById("nombre-formulario");
const inputNombreCampo = document.getElementById("nombre-campo");
const inputTipoCampo = document.getElementById("tipo-campo");
const inputObligatorioCampoSi = document.getElementById("obligatorio-si");
const inputObligatorioCampoNo = document.getElementById("obligatorio-no");
const inputEsPlantilla = document.getElementById("guardar-plantilla");
const inputAgregarCampo = document.getElementById("btn-confirmar-campo");


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

//Escuchador para cuando se presione el "Agregar Campo"
document.addEventListener('click', (evento) => {
    const boton = evento.target.closest('.btn-agregar-campo');
    if (!boton) return;
    seccionActivaId = Number(boton.dataset.seccionId);
    //Limpia los campos del modal y los errores
    modalCampo.show();
});

//Escuchador para guardar el campo creado dentro del modal
document.getElementById('btn-confirmar-campo').addEventListener('click', () => {
    //Validaciones y marcar errores

    const seccion = formulario.secciones.find((s) => s.id === seccionActivaId);
    seccion.campos.push({nombre, tipo, obligatorio});
    crearCampos(seccion);
    modalCampo.hide(); 
});

//Crea los campos de una seccion usando el template
function crearCampos(seccion) {
    const lista = document.getElementById('lista-campos-' + seccion.id);
    lista.replaceChildren();
    seccion.campos.forEach((campo) => {
        const copia = document.getElementById('plantilla-campo').content.cloneNode(true);
        copia.querySelector('.nombre-campo').textContent = campo.nombre;

        lista.appendChild(copia);
    });
}

//Funciones de validacion
function validarNombreFormulario(nombreFormulario) {return /^[a-z]{5,}$/.test(nombreFormulario);}

function validarNombreCampo(nombreCampo) {return nombreCampo !== "";}

function validarTipoCampo(tipoCampo) {return tipoCampo !== "";}

function validarObligatorio(obligatorioCampo) {
    if (inputObligatorioCampoSi.ariaChecked) {return true;}
        else {return false;}
}

function plantilla() {
    if (esPlantilla.ariaChecked) {esPlantilla = true;}
    else {esPlantilla = false;}    
}

//Funcion para resaltar campos vacios
function resaltarCamposVacios() {
    let error = false;
    
    //Comprobacion para el nombre del formulario
    const nombreFormulario = inputNombreFormulario.ariaValueMax.trim();
    //Si el campo nombre no cumple con la validacion
    if (! validarNombreFormulario ( nombreFormulario )) {
        inputNombreFormulario.classList.add("input-error");
    }
}

//Funcion para validar campos vacios
function validarCamposVacios() {

}

function limpiarFormulario() {
    document.querySelector("form").reset();
}

