// js/index.js
// Sin librerías: solo DOM, setInterval y scroll nativo del navegador.

// ---------- Sombra del encabezado al hacer scroll ----------
const encabezado = document.getElementById("encabezado");
window.addEventListener("scroll", () => {
  encabezado.classList.toggle("con-scroll", window.scrollY > 8);
});

// ---------- Slider de héroe: avanza solo y con controles ----------
(function () {
  const pista = document.getElementById("slider-pista");
  const contenedorPuntos = document.getElementById("slider-puntos");
  const botonAnterior = document.getElementById("slider-anterior");
  const botonSiguiente = document.getElementById("slider-siguiente");
  const totalSlides = pista.children.length;

  let actual = 0;
  let temporizador = null;

  for (let i = 0; i < totalSlides; i++) {
    const punto = document.createElement("button");
    punto.setAttribute("aria-label", "Ir a la diapositiva " + (i + 1));
    punto.addEventListener("click", () => irASlide(i));
    contenedorPuntos.appendChild(punto);
  }

  function actualizarVista() {
    pista.style.transform = "translateX(-" + actual * 100 + "%)";
    [...contenedorPuntos.children].forEach((punto, i) => {
      punto.classList.toggle("activo", i === actual);
    });
  }

  function irASlide(indice) {
    actual = (indice + totalSlides) % totalSlides;
    actualizarVista();
    reiniciarAutoavance();
  }

  function siguienteSlide() { irASlide(actual + 1); }
  function anteriorSlide() { irASlide(actual - 1); }

  function reiniciarAutoavance() {
    clearInterval(temporizador);
    temporizador = setInterval(siguienteSlide, 5000);
  }

  botonSiguiente.addEventListener("click", siguienteSlide);
  botonAnterior.addEventListener("click", anteriorSlide);

  actualizarVista();
  reiniciarAutoavance();
})();

// ---------- Carrusel de categorías: botones que desplazan la pista ----------
(function () {
  const pista = document.getElementById("categorias-pista");
  const botonAnterior = document.getElementById("categorias-anterior");
  const botonSiguiente = document.getElementById("categorias-siguiente");
  const distancia = 320;

  botonSiguiente.addEventListener("click", () => {
    pista.scrollBy({ left: distancia, behavior: "smooth" });
  });
  botonAnterior.addEventListener("click", () => {
    pista.scrollBy({ left: -distancia, behavior: "smooth" });
  });
})();

// ---------- Buscador del encabezado: lleva la búsqueda a la carta ----------
(function () {
  const formulario = document.getElementById("formulario-busqueda");
  const campo = document.getElementById("campo-busqueda-home");

  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();
    const texto = campo.value.trim();
    window.location.href = "carta.html?buscar=" + encodeURIComponent(texto);
  });
})();