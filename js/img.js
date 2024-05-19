//Tendencias.html-Galeria
"use strict"

document.querySelectorAll('.currency').forEach(function(img) {//Itera sobre cada uno de los elementos de las listas de nodos seleccionados(img).
    img.addEventListener('click', function() {//Añade un evento de escucha a cada imagen (img)
      img.parentElement.querySelector('.overlay').style.opacity = '1';//A partir del elemento padre de img, busca el primer elemento hijo con la clase overlay, para que se vea opaca.
    });
  });
  