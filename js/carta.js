// js/carta.js
// Sombra del encabezado + pestañas de categoría + búsqueda en vivo.
// Sin librerías: solo DOM y arreglos.

const encabezado = document.getElementById("encabezado");
window.addEventListener("scroll", () => {
  encabezado.classList.toggle("con-scroll", window.scrollY > 8);
});

const subtitulos = {
  tortas:   { titulo: "Tortas",        subtitulo: "12 porciones — 20 cm de diámetro aprox." },
  cupcakes: { titulo: "Cupcakes",      subtitulo: "Por docena o media docena" },
  alfajores:{ titulo: "Alfajores",     subtitulo: "Caja x12 unidades" },
  pan:      { titulo: "Pan artesanal", subtitulo: "Por kilo o por unidad" },
  cajas:    { titulo: "Boxes regalo",  subtitulo: "Listas para regalar" },
};

const tabs = document.querySelectorAll(".tab");
const tarjetas = document.querySelectorAll(".tarjeta-producto");
const tituloCategoria = document.getElementById("titulo-categoria");
const subtituloCategoria = document.getElementById("subtitulo-categoria");
const campoBusqueda = document.getElementById("campo-busqueda");
const sinResultados = document.getElementById("sin-resultados");

let categoriaActiva = "tortas";

function aplicarFiltros() {
  const texto = campoBusqueda.value.trim().toLowerCase();
  let visibles = 0;

  tarjetas.forEach((tarjeta) => {
    const perteneceCategoria = tarjeta.dataset.categoria === categoriaActiva;
    const coincideBusqueda = tarjeta.dataset.nombre.includes(texto);
    const mostrar = perteneceCategoria && coincideBusqueda;
    tarjeta.classList.toggle("oculto", !mostrar);
    if (mostrar) visibles++;
  });

  sinResultados.style.display = visibles === 0 ? "block" : "none";
}

// ---------- Cambiar de pestaña ----------
tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((t) => t.classList.remove("activa"));
    tab.classList.add("activa");

    categoriaActiva = tab.dataset.categoria;
    const info = subtitulos[categoriaActiva];
    tituloCategoria.textContent = info.titulo;
    subtituloCategoria.textContent = info.subtitulo;

    aplicarFiltros();
  });
});

// ---------- Búsqueda en vivo ----------
campoBusqueda.addEventListener("input", aplicarFiltros);

// ---------- Favoritos (toggle visual con corazón en CSS, sin guardar nada) ----------
document.querySelectorAll(".tp-favorito").forEach((boton) => {
  boton.addEventListener("click", () => {
    boton.classList.toggle("activo");
  });
});

// ---------- Leer categoría y búsqueda desde la URL (llegan desde index.html) ----------
const parametros = new URLSearchParams(window.location.search);
const categoriaDesdeUrl = parametros.get("categoria");
const busquedaDesdeUrl = parametros.get("buscar");

if (categoriaDesdeUrl && subtitulos[categoriaDesdeUrl]) {
  categoriaActiva = categoriaDesdeUrl;
  tabs.forEach((t) => t.classList.toggle("activa", t.dataset.categoria === categoriaDesdeUrl));
  tituloCategoria.textContent = subtitulos[categoriaActiva].titulo;
  subtituloCategoria.textContent = subtitulos[categoriaActiva].subtitulo;
}

if (busquedaDesdeUrl) {
  campoBusqueda.value = busquedaDesdeUrl;
}

aplicarFiltros();