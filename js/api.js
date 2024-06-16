"use strict";

const apiUrl = "https://66625bef62966e20ef0857e2.mockapi.io/api/v1/cryptos";

document.addEventListener('DOMContentLoaded', async () => {
  let tabla = document.getElementById("tabla");
  let inputFiltro = document.getElementById("filtro");
  let formAgregar = document.getElementById("crypto-form");

    // Obtener y mostrar los datos iniciales
    let datos = await obtenerDatosCriptos();
    if (!tabla) {
      console.error("La tabla no está definida.");
    }
    if (!tabla || !inputFiltro || !formAgregar || !Array.isArray(datos)) {
      console.error("Error al inicializar la página.");

    } else {
      console.log("La pagina está bien");
    }

    mostrarTabla(tabla, datos);

    // Manejar el evento de envío del formulario
    formAgregar.addEventListener("submit", async function (e) {
      e.preventDefault();

      const formData = new FormData(formAgregar);
      const nuevaCripto = {
        nombre: formData.get("nombre"),
        simbolo: formData.get("simbolo"),
        tipo: formData.get("tipo"),
        algoritmo: formData.get("algoritmo"),
        fechaCreacion: formData.get("fechaCreacion"),
      };

      try {
        await agregarCriptomoneda(nuevaCripto, tabla); // Añadir 'tabla' como parámetro
          formAgregar.reset();
        }catch (error) {
        console.error("Error al agregar la criptomoneda:", error);
      }
    });

    // Manejar eventos de filtro y borrar filtro
    inputFiltro.addEventListener("input", function (event) {
      let valorFiltro = event.target.value.trim().toLowerCase();
      filtrarTabla(valorFiltro, datos, tabla);
    });

    let btnBorrarFiltro = document.getElementById("btn-borrar-filtro");
    btnBorrarFiltro.addEventListener("click", function () {
      inputFiltro.value = ""; // Borrar el contenido del input
      mostrarTabla(tabla, datos); // Mostrar la tabla completa
    });

    // Manejar eventos de eliminar y editar
    tabla.addEventListener('click', async (event) => {
      const id = event.target.getAttribute('data-id');
      if (event.target.classList.contains('eliminar-btn')) {
        await eliminarCriptomoneda(id);
        datos = datos.filter(cripto => cripto.id !== id);
        mostrarTabla(tabla, datos);
      } else if (event.target.classList.contains('editar-btn')) {
        editarFila(event.target, datos);
      }
 });
  
  
  // Función para mostrar la tabla con datos
  function mostrarTabla(tabla, datos) {
    // Limpiar cualquier dato anterior
    tabla.innerHTML = '';

    // Verificar que datos sea un array y tenga al menos un elemento
    if (Array.isArray( datos) && datos.length > 0) {
      datos.forEach(cripto => {
        tabla.innerHTML += `
                <tr>
                    <td>${cripto.nombre}</td>
                    <td>${cripto.simbolo}</td>
                    <td>${cripto.tipo}</td>
                    <td>${cripto.algoritmo}</td>
                    <td>${cripto.fechaCreacion}</td>
                    <td>
                        <button class="editar-btn" data-id="${cripto.id}">Editar</button>
                    </td>
                    <td>
                        <button class="eliminar-btn" data-id="${cripto.id}">X</button>
                    </td>
                </tr>
            `;
      });
    }
  }

  function filtrarTabla(valorFiltro, datos, tabla) {
    const datosFiltrados = datos.filter(
      (cripto) =>
        cripto.nombre.toLowerCase().includes(valorFiltro) ||
        cripto.simbolo.toLowerCase().includes(valorFiltro) ||
        cripto.tipo.toLowerCase().includes(valorFiltro) ||
        cripto.algoritmo.toLowerCase().includes(valorFiltro) ||
        cripto.fechaCreacion.toLowerCase().includes(valorFiltro)
    );
    mostrarTabla(tabla, datosFiltrados);
  }

  //METODO GET
  // Función para obtener los datos de la API
  async function obtenerDatosCriptos() {
    try {
      let respuesta = await fetch(apiUrl);
      if (!respuesta.ok) {
        throw new Error('Error al obtener los datos de la API');
      }
      return await respuesta.json();
    } catch (error) {
      console.error(error.message);
      return [];
    }
  }

  //METODO POST
  // Función para agregar una criptomoneda
async function agregarCriptomoneda(nuevaCripto, tabla) {
  try {
    let respuesta = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(nuevaCripto),
    });

    if (!respuesta.ok) {
      let errorResponse = await respuesta.json();
      throw new Error(`Error en la solicitud: ${errorResponse.message}`);
    }

    let datosActualizados = await obtenerDatosCriptos();
    mostrarTabla(tabla, datosActualizados); // Mostrar la tabla actualizada

    mostrarMensaje("Criptomoneda agregada correctamente", "success");
  } catch (error) {
    console.error("Error al agregar la criptomoneda:", error);
    mostrarMensaje("Error al agregar la criptomoneda", "error");
  }
}
  
  //METODO PUT
  // Función para editar una fila
  function editarFila(boton) {
    let fila = boton.parentElement.parentElement; // Acceder al elemento <tr> que contiene el botón y a los td que contiene cada tr

    if (!fila.classList.contains("editando")) {
      // Guardar los datos originales antes de cambiar a modo de edición
      let datosOriginales = Array.from(fila.children).map((td) => td.textContent);

      // Crear inputs para editar los datos
      fila.innerHTML = `
    <td><input type="text" value="${datosOriginales[0]}"></td>
    <td><input type="text" value="${datosOriginales[1]}"></td>
    <td><input type="text" value="${datosOriginales[2]}"></td>
    <td><input type="text" value="${datosOriginales[3]}"></td>
    <td><input type="text" value="${datosOriginales[4]}"></td>
    <td>
      <button class="guardar-btn" data-id="${boton.dataset.id}">Guardar</button>
    </td>
    <td>
      <button class="eliminar-btn" data-id="${boton.dataset.id}">X</button>
    </td>
  `;

      fila.classList.add("editando"); // Agregar clase para indicar que está en modo edición

      // Agregar event listener al botón de Guardar
      fila.querySelector(".guardar-btn").addEventListener("click", () => {
        guardarFila(fila.querySelector(".guardar-btn"));
      });

      // Agregar event listener al botón de Eliminar
      fila.querySelector(".eliminar-btn").addEventListener("click", () => {
        fila.remove();
      });
    }
  }

  // Función para guardar los cambios editados en una fila
  function guardarFila(boton) {
    let fila = boton.parentElement.parentElement; // Acceder al elemento <tr> que contiene el botón y a los td que contiene cada tr

    // Obtener los datos editados de los inputs
    let inputs = fila.querySelectorAll("input");
    let datosActualizados = {
      nombre: inputs[0].value,
      simbolo: inputs[1].value,
      tipo: inputs[2].value,
      algoritmo: inputs[3].value,
      fechaCreacion: inputs[4].value,
    };

    // Realizar la solicitud PUT para actualizar los datos
    fetch(
      `https://66625bef62966e20ef0857e2.mockapi.io/api/v1/cryptos/${boton.dataset.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datosActualizados),
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error en la solicitud");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Éxito:", data);

        // Actualizar la fila con los nuevos datos
        actualizarFila(fila, datosActualizados, boton.dataset.id);
        fila.classList.remove("editando"); // Quitar la clase de edición
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  // Función auxiliar para actualizar la fila
  function actualizarFila(fila, datos, id) {
    fila.innerHTML = `
  <td>${datos.nombre}</td>
  <td>${datos.simbolo}</td>
  <td>${datos.tipo}</td>
  <td>${datos.algoritmo}</td>
  <td>${datos.fechaCreacion}</td>
  <td>
    <button class="editar-btn" data-id="${id}">Editar</button>
  </td>
  <td>
    <button class="eliminar-btn" data-id="${id}">X</button>
  </td>
`;

    // Agregar event listener al botón de Editar de nuevo
    fila.querySelector(".editar-btn").addEventListener("click", () => {
      editarFila(fila.querySelector(".editar-btn"));
    });

    // Agregar event listener al botón de Eliminar de nuevo
    fila.querySelector(".eliminar-btn").addEventListener("click", () => {
      fila.remove();
    });
  }
  
  //METODO DELETE
  // Función para eliminar una criptomoneda por su ID
  async function eliminarCriptomoneda(id, tabla) {
    try {
      const response = await fetch(`${apiUrl}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar la criptomoneda');
      }

      let datosActualizados = await obtenerDatosCriptos();
      mostrarTabla(tabla, datosActualizados); // Mostrar la tabla actualizada

      mostrarMensaje('Criptomoneda eliminada correctamente', 'success');
    } catch (error) {
      console.error('Error al eliminar la criptomoneda:', error);
      mostrarMensaje('Error al eliminar la criptomoneda', 'error');
    }
  }

  // Función para mostrar mensajes
  function mostrarMensaje(mensaje, tipo) {
    const mensajeDiv = document.getElementById('mensaje');
    mensajeDiv.textContent = mensaje;
    mensajeDiv.className = tipo;
    mensajeDiv.style.display = 'block';

    // Ocultar el mensaje después de 3 segundos
    setTimeout(() => {
      mensajeDiv.style.display = 'none';
    }, 3000);}
  });