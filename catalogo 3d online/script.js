// Productos disponibles
const productos = [
  { id: "3D-0001", categoria: "figura", nombre: "Figura Alien", imagen: "figura1.jpg", vistas: 0 },
  { id: "3D-0002", categoria: "pieza", nombre: "Engranaje mecánico", imagen: "pieza1.jpg", vistas: 0 },
  { id: "3D-0003", categoria: "decoracion", nombre: "Lámpara en espiral", imagen: "decoracion1.jpg", vistas: 0 },
  { id: "3D-0004", categoria: "llavero", nombre: "Llavero muy vacano", imagen: "llavero1.jpg", vistas: 0 },
];

// Variables globales
let carrito = [];
const DOM = {
  contenedor: document.getElementById("productos"),
  filtro: document.getElementById("categoria"),
  inputBusqueda: document.getElementById("busqueda"),
  botonLimpiar: document.getElementById("limpiar-busqueda"),
  botonCarrito: document.getElementById("boton-carrito"),
  ventanaCarrito: document.getElementById("ventana-carrito"),
  listaCarrito: document.getElementById("lista-carrito"),
  contadorCarrito: document.createElement("span"),
  botonVolverArriba: document.getElementById("volver-arriba"),
  modal3D: document.getElementById("modal-3d"),
  cerrarModal3D: document.getElementById("cerrar-modal"),
  renderizador3D: document.getElementById("renderizador-3d"),
  mensajeFlotante: document.getElementById("mensaje-flotante"),
};

// Estilo del contador del carrito
DOM.contadorCarrito.style.position = "absolute";
DOM.contadorCarrito.style.top = "5px";
DOM.contadorCarrito.style.right = "5px";
DOM.contadorCarrito.style.backgroundColor = "#ff4d4d";
DOM.contadorCarrito.style.color = "white";
DOM.contadorCarrito.style.borderRadius = "50%";
DOM.contadorCarrito.style.padding = "5px 10px";
DOM.contadorCarrito.style.fontSize = "12px";
DOM.contadorCarrito.style.display = "none";
DOM.botonCarrito.appendChild(DOM.contadorCarrito);

// Mostrar/ocultar la ventana del carrito
DOM.botonCarrito.addEventListener("click", () => {
  const ventanaCarrito = DOM.ventanaCarrito;
  ventanaCarrito.style.display = ventanaCarrito.style.display === "block" ? "none" : "block";
});

// Función para mostrar un mensaje flotante
function mostrarMensaje(mensaje, color = "#28a745") {
  DOM.mensajeFlotante.textContent = mensaje;
  DOM.mensajeFlotante.style.backgroundColor = color;
  DOM.mensajeFlotante.classList.add("mostrar");
  setTimeout(() => DOM.mensajeFlotante.classList.remove("mostrar"), 3000);
}

// Función para actualizar el carrito
function actualizarCarrito() {
  DOM.listaCarrito.innerHTML = carrito.length
    ? carrito
        .map(
          (producto, index) => `
      <li>
        ${producto.nombre} (Código: ${producto.id})
        <button onclick="eliminarDelCarrito(${index})">Eliminar</button>
      </li>`
        )
        .join("")
    : "<li>El carrito está vacío.</li>";
  DOM.contadorCarrito.textContent = carrito.length;
  DOM.contadorCarrito.style.display = carrito.length ? "block" : "none";
}

// Función para agregar un producto al carrito
function agregarAlCarrito(id) {
  const producto = productos.find((prod) => prod.id === id);
  if (producto) {
    carrito.push(producto);
    mostrarMensaje(`Producto "${producto.nombre}" agregado al carrito.`);
    actualizarCarrito();
  }
}

// Función para eliminar un producto del carrito
function eliminarDelCarrito(index) {
  carrito.splice(index, 1);
  actualizarCarrito();
}

// Función para cotizar un producto directamente en WhatsApp
function cotizarEnWhatsApp(id) {
  const producto = productos.find((prod) => prod.id === id);
  if (producto) {
    const mensaje = `Buenos días, me puede cotizar este producto: ${producto.nombre} (Código: ${producto.id})`;
    const url = `https://wa.me/1234567890?text=${encodeURIComponent(mensaje)}`;
    window.open(url, "_blank");
  }
}

// Función para enviar el carrito completo a WhatsApp
function enviarCarritoAWhatsApp() {
  if (carrito.length === 0) {
    alert("El carrito está vacío.");
    return;
  }
  const mensaje = carrito
    .map((prod) => `- ${prod.nombre} (Código: ${prod.id})`)
    .join("\n");
  const mensajeCompleto = `Buenos días, me puede cotizar los siguientes productos:\n${mensaje}`;
  const url = `https://wa.me/1234567890?text=${encodeURIComponent(mensajeCompleto)}`;
  window.open(url, "_blank");
}

// Función para normalizar texto
function normalizarTexto(texto) {
  return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

// Función para mostrar productos
function mostrarProductos() {
  const texto = normalizarTexto(DOM.inputBusqueda.value);
  const categoriaSeleccionada = DOM.filtro.value;
  const filtrados = productos.filter(
    (prod) =>
      (categoriaSeleccionada === "todos" || prod.categoria === categoriaSeleccionada) &&
      normalizarTexto(prod.nombre).includes(texto)
  );
  DOM.contenedor.innerHTML = filtrados.length
    ? filtrados
        .map(
          (prod) => `
      <div class="producto">
        <div class="imagen-contenedor" onclick="abrirModalDetalles('${prod.id}')">
          <img src="${prod.imagen}" alt="${prod.nombre}">
          <div class="overlay-ver">VER</div>
        </div>
        <h3>${prod.nombre}</h3>
        <p>Código: ${prod.id}</p>
        <div class="botones">
          <img src="ojo.png" class="ojo-icono" title="Ver en 3D" onclick="ver3D('${prod.id}'); event.stopPropagation();">
          <button class="btn-agregar" onclick="agregarAlCarrito('${prod.id}'); event.stopPropagation();">+</button>
          <button class="btn-cotizar" onclick="cotizarEnWhatsApp('${prod.id}'); event.stopPropagation();">Cotizar</button>
        </div>
      </div>`
        )
        .join("")
    : `<p class="mensaje-no-disponible">Producto no disponible</p>`;
}

// Función para abrir el modal y renderizar el modelo 3D
function ver3D(id) {
  DOM.renderizador3D.innerHTML = "";
  DOM.modal3D.style.display = "flex";

  const escena = new THREE.Scene();
  const camara = new THREE.PerspectiveCamera(75, DOM.renderizador3D.clientWidth / DOM.renderizador3D.clientHeight, 0.1, 1000);
  const renderizador = new THREE.WebGLRenderer();
  renderizador.setSize(DOM.renderizador3D.clientWidth, DOM.renderizador3D.clientHeight);
  DOM.renderizador3D.appendChild(renderizador.domElement);

  const luz = new THREE.DirectionalLight(0xffffff, 1);
  luz.position.set(1, 1, 1).normalize();
  escena.add(luz);

  const loader = new THREE.STLLoader();
  loader.load(`modelos/${id}.stl`, (geometry) => {
    const material = new THREE.MeshStandardMaterial({ color: 0x007bff });
    const modelo = new THREE.Mesh(geometry, material);
    modelo.rotation.x = -0.5 * Math.PI;
    modelo.scale.set(0.5, 0.5, 0.5);
    escena.add(modelo);

    const boundingBox = new THREE.Box3().setFromObject(modelo);
    const center = boundingBox.getCenter(new THREE.Vector3());
    camara.position.set(center.x, center.y, boundingBox.max.z * 2);
    camara.lookAt(center);
  });

  function animar() {
    requestAnimationFrame(animar);
    renderizador.render(escena, camara);
  }
  animar();

  DOM.cerrarModal3D.onclick = () => {
    DOM.modal3D.style.display = "none";
    renderizador.dispose();
  };

  DOM.modal3D.onclick = (e) => {
    if (e.target === DOM.modal3D) {
      DOM.modal3D.style.display = "none";
      renderizador.dispose();
    }
  };
}

// Incrementar vistas de un producto
function incrementarVistas(id) {
  const producto = productos.find((prod) => prod.id === id);
  if (producto) {
    producto.vistas++;
  }
}

// Ajustar el formulario de comentarios para evitar recarga y mostrar el comentario inmediatamente
const formComentarios = document.getElementById("form-comentarios");
let valoracionSeleccionada = 0; // Variable global para almacenar la valoración seleccionada

formComentarios.addEventListener("submit", (e) => {
  const nombre = document.getElementById("nombre-comentario").value.trim();
  const texto = document.getElementById("texto-comentario").value.trim();
  const productoId = document.getElementById("modal-titulo").dataset.productoId;

  // Validación completa
  if (!nombre || !texto || valoracionSeleccionada === 0) {
    mostrarMensaje("Por favor, completa todos los campos antes de enviar el comentario.", "#ff4d4d");
    return; // Detener si hay errores
  }

  const nuevoComentario = {
    id: Date.now(),
    nombre,
    comentario: texto,
    valoracion: valoracionSeleccionada,
    fecha: new Date().toLocaleString(),
  };

  const comentariosGuardados = JSON.parse(localStorage.getItem("comentarios")) || {};
  if (!comentariosGuardados[productoId]) {
    comentariosGuardados[productoId] = [];
  }
  comentariosGuardados[productoId].push(nuevoComentario);
  localStorage.setItem("comentarios", JSON.stringify(comentariosGuardados));

  // Guardar el productoId en localStorage para reabrir el modal después de la recarga
  localStorage.setItem("productoAbierto", productoId);
});

// Mostrar comentarios por producto
function mostrarComentarios(productoId) {
  const comentariosGuardados = JSON.parse(localStorage.getItem("comentarios")) || {};
  const listaComentarios = document.getElementById("lista-comentarios");
  const comentarios = comentariosGuardados[productoId] || [];

  if (comentarios.length === 0) {
    listaComentarios.innerHTML = "<p>No hay comentarios para este producto.</p>";
    return;
  }

  listaComentarios.innerHTML = comentarios
    .map(
      (com) => `
    <div class="comentario" data-id="${com.id}">
      <strong>${com.nombre}:</strong>
      <p>${com.comentario}</p>
      <small>Valoración: ${'★'.repeat(com.valoracion)}${'☆'.repeat(5 - com.valoracion)}</small>
      <span class="fecha">${com.fecha}</span>
    </div>`
    )
    .join("");
}

function editarComentario(productoId, comentarioId) {
  const comentariosGuardados = JSON.parse(localStorage.getItem("comentarios")) || {};
  const comentario = comentariosGuardados[productoId].find((com) => com.id === comentarioId);

  if (comentario) {
    document.getElementById("nombre-comentario").value = comentario.nombre;
    document.getElementById("texto-comentario").value = comentario.comentario;
    document.getElementById("valoracion-comentario").value = comentario.valoracion;

    eliminarComentario(productoId, comentarioId); // Eliminar el comentario para actualizarlo
  }
}

function eliminarComentario(productoId, comentarioId) {
  const comentariosGuardados = JSON.parse(localStorage.getItem("comentarios")) || {};
  comentariosGuardados[productoId] = comentariosGuardados[productoId].filter((com) => com.id !== comentarioId);
  localStorage.setItem("comentarios", JSON.stringify(comentariosGuardados));

  mostrarComentarios(productoId);
}

// Ajustar la funcionalidad de las estrellas
function generarEstrellas() {
  const estrellasContenedor = document.getElementById("estrellas");
  estrellasContenedor.innerHTML = ""; // Limpiar estrellas previas
  for (let i = 1; i <= 5; i++) { // Cambiar a 5 estrellas
    const estrella = document.createElement("span");
    estrella.textContent = "☆"; // Inicialmente vacías
    estrella.dataset.valor = i; // Cada estrella tiene un valor
    estrella.addEventListener("click", () => seleccionarEstrella(i));
    estrellasContenedor.appendChild(estrella);
  }
}

function seleccionarEstrella(valor) {
  const estrellas = document.querySelectorAll("#estrellas span");
  estrellas.forEach((estrella, i) => {
    estrella.textContent = i < valor ? "★" : "☆"; // Llenar de izquierda a derecha
    estrella.classList.toggle("seleccionada", i < valor);
  });
  valoracionSeleccionada = valor; // Guardar la valoración seleccionada en la variable global
}

// Persistencia de likes y dislikes
const likeBoton = document.getElementById("like-boton");
const dislikeBoton = document.getElementById("dislike-boton");

likeBoton.addEventListener("click", () => actualizarReaccion("like"));
dislikeBoton.addEventListener("click", () => actualizarReaccion("dislike"));

let reaccionesUsuario = {}; // Almacena las reacciones del usuario por producto

function actualizarReaccion(tipo) {
  const productoId = document.getElementById("modal-titulo").dataset.productoId;
  const reaccionesGuardadas = JSON.parse(localStorage.getItem("reacciones")) || {};

  if (!reaccionesGuardadas[productoId]) {
    reaccionesGuardadas[productoId] = { like: 0, dislike: 0 };
  }

  if (reaccionesUsuario[productoId] === tipo) {
    // Si ya reaccionó con el mismo tipo, elimina la reacción
    reaccionesGuardadas[productoId][tipo]--;
    delete reaccionesUsuario[productoId];
  } else {
    // Si reaccionó con el otro tipo, elimina la reacción anterior
    if (reaccionesUsuario[productoId]) {
      reaccionesGuardadas[productoId][reaccionesUsuario[productoId]]--;
    }
    // Agrega la nueva reacción
    reaccionesGuardadas[productoId][tipo]++;
    reaccionesUsuario[productoId] = tipo;
  }

  localStorage.setItem("reacciones", JSON.stringify(reaccionesGuardadas));
  mostrarReacciones(productoId);
}

function mostrarReacciones(productoId) {
  const reaccionesGuardadas = JSON.parse(localStorage.getItem("reacciones")) || {};
  const reacciones = reaccionesGuardadas[productoId] || { like: 0, dislike: 0 };

  likeBoton.textContent = `👍 Like (${reacciones.like})`;
  dislikeBoton.textContent = `👎 Dislike (${reacciones.dislike})`;
}

// Mostrar reacciones y comentarios al abrir el modal
function abrirModalDetalles(id) {
  const producto = productos.find((prod) => prod.id === id);
  if (!producto) return;

  document.getElementById("modal-titulo").textContent = producto.nombre;
  document.getElementById("modal-titulo").dataset.productoId = id;
  document.getElementById("modal-descripcion").textContent = producto.descripcion || "Descripción no disponible";
  document.getElementById("imagen-principal").src = producto.imagen;

  generarEstrellas(); // Generar estrellas dinámicamente
  mostrarComentarios(id); // Mostrar comentarios del producto
  mostrarReacciones(id); // Mostrar reacciones del producto

  document.getElementById("modal-detalles").style.display = "flex";
  document.body.style.overflow = "hidden"; // Evitar scroll en el fondo
}

// Cerrar la ventana modal
document.getElementById("cerrar-modal-detalles").onclick = () => {
  document.getElementById("modal-detalles").style.display = "none";
  document.body.style.overflow = "auto"; // Restaurar scroll
};

// Cerrar el modal de detalles al hacer clic fuera del contenido
document.getElementById("modal-detalles").onclick = (e) => {
  if (e.target === document.getElementById("modal-detalles")) {
    document.getElementById("modal-detalles").style.display = "none";
    document.body.style.overflow = "auto"; // Restaurar scroll
  }
};

// Cerrar el modal 3D
document.getElementById("cerrar-modal").onclick = () => {
  document.getElementById("modal-3d").style.display = "none";
  document.body.style.overflow = "auto"; // Restaurar scroll
};

// Cerrar el modal 3D al hacer clic fuera del contenido
document.getElementById("modal-3d").onclick = (e) => {
  if (e.target === document.getElementById("modal-3d")) {
    document.getElementById("modal-3d").style.display = "none";
    document.body.style.overflow = "auto"; // Restaurar scroll
  }
};

// Cerrar ambos modales con la tecla ESC
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    const modalDetalles = document.getElementById("modal-detalles");
    const modal3D = document.getElementById("modal-3d");

    if (modalDetalles.style.display === "flex") {
      modalDetalles.style.display = "none";
      document.body.style.overflow = "auto"; // Restaurar scroll
    }

    if (modal3D.style.display === "flex") {
      modal3D.style.display = "none";
      document.body.style.overflow = "auto"; // Restaurar scroll
    }
  }
});

// Configuración de eventos
DOM.inputBusqueda.addEventListener("input", mostrarProductos);
DOM.botonLimpiar.addEventListener("click", () => {
  DOM.inputBusqueda.value = "";
  mostrarProductos();
});
DOM.filtro.addEventListener("change", mostrarProductos);
DOM.botonVolverArriba.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
window.addEventListener("scroll", () => {
  DOM.botonVolverArriba.style.display = window.scrollY > 200 ? "flex" : "none";
});

// Inicializar Swiper.js
const swiper = new Swiper('.swiper-container', {
  loop: true, // Habilitar el bucle infinito
  autoplay: {
    delay: 6000, // Cambiar cada 3 segundos
    disableOnInteraction: false, // Continuar después de la interacción
  },
  navigation: {
    nextEl: '.swiper-button-next', // Botón siguiente
    prevEl: '.swiper-button-prev', // Botón anterior
  },
  slidesPerView: 1, // Mostrar una imagen a la vez
  spaceBetween: 10, // Espaciado entre las imágenes
});

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
  // Inicializar funciones aquí
  mostrarProductos();
  configurarEventosModal();

  // Reabrir el modal si hay un producto almacenado
  const productoAbierto = localStorage.getItem("productoAbierto");
  if (productoAbierto) {
    abrirModalDetalles(productoAbierto);
    localStorage.removeItem("productoAbierto"); // Limpiar el producto almacenado
  }
});

function configurarEventosModal() {
  // Cerrar el modal de detalles
  document.getElementById("cerrar-modal-detalles").onclick = () => {
    document.getElementById("modal-detalles").style.display = "none";
    document.body.style.overflow = "auto"; // Restaurar scroll
  };

  // Cerrar el modal de detalles al hacer clic fuera del contenido
  document.getElementById("modal-detalles").onclick = (e) => {
    if (e.target === document.getElementById("modal-detalles")) {
      document.getElementById("modal-detalles").style.display = "none";
      document.body.style.overflow = "auto"; // Restaurar scroll
    }
  };
}