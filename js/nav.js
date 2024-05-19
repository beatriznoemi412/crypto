"use strict";
//Barra de navegacion
const listaNav = document.querySelector(".list");
const abrirBtn = document.querySelector("#btn-abrir");
const cerrarBtn = document.querySelector("#btn-cerrar");

abrirBtn.addEventListener("click", toggleMenu);
cerrarBtn.addEventListener("click", toggleMenu);

function toggleMenu() {
    listaNav.classList.toggle("mostrar"); 
    abrirBtn.classList.toggle("ocultar"); 
    cerrarBtn.classList.toggle("mostrar");
}
