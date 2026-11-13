var nombreCentro = document.getElementById("nombre-centro");
var codigoCentro = document.getElementById("codigo-centro");
var ofertaEducativa = document.getElementById("oferta-educativa");

var botonVolver = document.getElementById("btn-volver");
var botonContinuar = document.getElementById("btn-continuar");
var mensaje = document.getElementById("mensaje");

// Datos de ejemplo para probar el RF-10
nombreCentro.value = "Centro educativo de ejemplo";
codigoCentro.value = "0000";
ofertaEducativa.value = "Primaria";

// Boton para volver a la pagina anterior
botonVolver.onclick = function () {
    window.history.back();
};

// Boton para continuar
botonContinuar.onclick = function () {
    mensaje.textContent = "Información revisada correctamente.";
};