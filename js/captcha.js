"use strict";

// Obtenemos referencias a los elementos del DOM
let form = document.getElementById("form");
let captchaContainer = document.getElementById("captcha-container");
let captchaInput = document.getElementById("captcha-input");
let mensajeDiv = document.getElementById("message");

form.addEventListener("submit", agregar);

// Función para manejar el envío del formulario
function agregar(e) {
  e.preventDefault();
  // Se obtienen todos los datos del formulario
  let formData = new FormData(form);

  // Se obtienen los datos ingresados en el formulario según el nombre de cada input
  let nombre = formData.get("nombre");
  let apellido = formData.get("apellido");
  let email = formData.get("email");
  let edad = formData.get("edad");
  let pais = formData.get("pais-select");
  let terminos = formData.get("terminos");
  
  console.log(nombre, apellido, email, edad, pais, terminos);
  // Validar el select
   if (pais === "0") {
    mostrarError("Por favor seleccione un país válido.");
    return;
}
  if (!terminos) {
    mostrarError("Por favor acepte los términos y condiciones.");
    return;
  }
  // Se verifica el captcha
  validarCaptcha();
}
function mostrarError(mensaje) {
  mensajeDiv.textContent = mensaje;
  mensajeDiv.style.color = "red";
}
// Función para manejar la verificación del captcha
function validarCaptcha() {
  // Se obtiene el valor ingresado en el input del captcha
  let captchaValue = captchaInput.value;
  // Se verifica el captcha
  let captchaNumbers = captchaContainer.textContent;
  if (captchaValue === captchaNumbers) {
    // El captcha es correcto, se envía el formulario
    mensajeDiv.textContent = "Captcha correcto";
    mensajeDiv.style.color = "white";
    setTimeout(function () {
      form.submit();
    }, 2000);
  } else {
    // El captcha es incorrecto, se muestra un mensaje de error
    mostrarError("Captcha incorrecto.");
    generarCaptcha(); // Se genera un nuevo captcha
  }
}
// Función para generar números aleatorios para el captcha y mostrarlos
function generarCaptcha() {
  // Se genera una cadena de texto aleatoria para el CAPTCHA
  let captchaText = "";
  const caracteres =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 6; i++) {
    // Genera un CAPTCHA de 6 caracteres
    captchaText += caracteres.charAt(
      Math.floor(Math.random() * caracteres.length)
    );
  }

  // Se actualiza el contenido del elemento de texto para mostrar el CAPTCHA generado
  let captchaElement = document.getElementById("captcha-container");
  captchaElement.textContent = captchaText;
}

generarCaptcha(); // Llamada inicial para generar el captcha al cargar la página
