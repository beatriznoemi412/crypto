"use strict";

const apiUrl = "https://66625bef62966e20ef0857e2.mockapi.io/api/v1/cryptos";

document.addEventListener('DOMContentLoaded', async () => {
  let tabla = document.getElementById("tabla");
  let inputFiltro = document.getElementById("filtro");
  let formAgregar = document.getElementById("crypto-form");

  try {
    // Obtener y mostrar los datos iniciales
    let datos = await obtenerDatosCriptos();
    if (!tabla || !inputFiltro || !formAgregar || !Array.isArray(datos)) {
      console.error("Error al inicializar la página.");
      return;
    } else {
      console.log("La página está bien");
      mostrarTabla(datos);

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
          await agregarCriptomoneda(nuevaCripto);
          formAgregar.reset();
          datos = await obtenerDatosCriptos(); // Obtener datos actualizados
          mostrarTabla(datos); // Mostrar la tabla actualizada
        } catch (error) {
          console.error("Error al agregar la criptomoneda:", error);
        }
      });

      // Manejar eventos de filtro y borrar filtro
      inputFiltro.addEventListener("input", function (event) {
        let valorFiltro = event.target.value.trim().toLowerCase();
        filtrarTabla(valorFiltro, datos);
      });

      let btnBorrarFiltro = document.getElementById("btn-borrar-filtro");
      btnBorrarFiltro.addEventListener("click", function () {
        inputFiltro.value = ""; // Borrar el contenido del input
        mostrarTabla(datos); // Mostrar la tabla completa
      });

      // Manejar eventos de eliminar y editar
      tabla.addEventListener('click', async (event) => {
        const id = event.target.getAttribute('data-id');
        if (event.target.classList.contains('eliminar-btn')) {
          await eliminarCriptomoneda(id);
          datos = await obtenerDatosCriptos(); // Obtener datos actualizados
          mostrarTabla(datos); // Mostrar la tabla actualizada
        } else if (event.target.classList.contains('editar-btn')) {
          editarFila(event.target, datos);
        }
      });
    }
  } catch (error) {
    console.error("Error en DOMContentLoaded:", error);
  }

  // Función para mostrar la tabla con datos
  function mostrarTabla(datos) {
    // Limpiar cualquier dato anterior
    tabla.innerHTML = '';

    // Verificar que datos sea un array y tenga al menos un elemento
    if (Array.isArray(datos) && datos.length > 0) {
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

  function filtrarTabla(valorFiltro, datos) {
    const datosFiltrados = datos.filter(
      (cripto) =>
        cripto.nombre.toLowerCase().includes(valorFiltro) ||
        cripto.simbolo.toLowerCase().includes(valorFiltro) ||
        cripto.tipo.toLowerCase().includes(valorFiltro) ||
        cripto.algoritmo.toLowerCase().includes(valorFiltro) ||
        cripto.fechaCreacion.toLowerCase().includes(valorFiltro)
    );
    mostrarTabla(datosFiltrados);
  }

  // METODO GET
  async function obtenerDatosCriptos() {
    try {
      let respuesta = await fetch(apiUrl);
      if (!respuesta.ok) {
        throw new Error('Error al obtener los datos de la API');
      }
      return await respuesta.json();
    } catch (error) {
      console.error("Error en obtenerDatosCriptos:", error);
      return [];
    }
  }

  // METODO POST
  async function agregarCriptomoneda(nuevaCripto) {
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

      mostrarMensaje("Criptomoneda agregada correctamente", "success");
    } catch (error) {
      console.error("Error en agregarCriptomoneda:", error);
      mostrarMensaje("Error al agregar la criptomoneda", "error");
    }
  }

  // METODO DELETE
  async function eliminarCriptomoneda(id) {
    try {
      let respuesta = await fetch(`${apiUrl}/${id}`, {
        method: "DELETE",
      });

      if (!respuesta.ok) {
        throw new Error('Error al eliminar la criptomoneda');
      }

      mostrarMensaje("Criptomoneda eliminada correctamente", "success");
    } catch (error) {
      console.error("Error en eliminarCriptomoneda:", error);
      mostrarMensaje("Error al eliminar la criptomoneda", "error");
    }
  }

  // METODO PUT
  function editarFila(boton) {
    let fila = boton.parentElement.parentElement; // Acceder al elemento <tr> que contiene el botón y a los td que contiene cada tr

    if (!fila.classList.contains("editando")) {
      let datosOriginales = Array.from(fila.children).map((td) => td.textContent);

      fila.innerHTML = `
        <td><input type="text" name="campo-uno" value="${datosOriginales[0]}"></td>
        <td><input type="text" name="campo-dos" value="${datosOriginales[1]}"></td>
        <td><input type="text" name="campo-tres" value="${datosOriginales[2]}"></td>
        <td><input type="text" name="campo-cuatro" value="${datosOriginales[3]}"></td>
        <td><input type="text" name="campo-c" value="${datosOriginales[4]}"></td>
        <td>
          <button class="guardar-btn" data-id="${boton.dataset.id}">Guardar</button>
        </td>
        <td>
          <button class="eliminar-btn" data-id="${boton.dataset.id}">X</button>
        </td>
      `;

      fila.classList.add("editando"); // Agregar clase para indicar que está en modo edición

      fila.querySelector(".guardar-btn").addEventListener("click", () => {
        guardarFila(fila.querySelector(".guardar-btn"));
      });

      fila.querySelector(".eliminar-btn").addEventListener("click", () => {
        fila.remove();
      });
    }
  }

  function guardarFila(boton) {
    let fila = boton.parentElement.parentElement; // Acceder al elemento <tr> que contiene el botón y a los td que contiene cada tr

    let inputs = fila.querySelectorAll("input");
    let datosActualizados = {
      nombre: inputs[0].value,
      simbolo: inputs[1].value,
      tipo: inputs[2].value,
      algoritmo: inputs[3].value,
      fechaCreacion: inputs[4].value,
    };

    fetch(`${apiUrl}/${boton.dataset.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datosActualizados),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error en la solicitud");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Éxito:", data);
        actualizarFila(fila, datosActualizados, boton.dataset.id);
        fila.classList.remove("editando");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

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
  }

  function mostrarMensaje(mensaje, tipo) {
    const divMensaje = document.createElement("div");
    divMensaje.classList.add(tipo);
    divMensaje.textContent = mensaje;
    document.body.appendChild(divMensaje);

    setTimeout(() => {
      divMensaje.remove();
    }, 3000);
  }
});
