import { sql } from "./neon-config.js";
import { exigirSesion, cerrarSesion } from "./auth.js";

// Sombra en el encabezado al hacer scroll (mismo patrón visual en todas las páginas)
const encabezado = document.getElementById("encabezado");
window.addEventListener("scroll", () => {
  encabezado.classList.toggle("con-scroll", window.scrollY > 8);
});

// RF: sin sesión activa no se accede a este formulario.
const usuario = exigirSesion();

const botonSalir = document.getElementById("boton-salir");
if (botonSalir) {
  botonSalir.addEventListener("click", () => {
    cerrarSesion();
    window.location.href = "login.html";
  });
}

function generarCodigo() {
  return "PED-" + Date.now().toString().slice(-8);
}

async function guardarPedido(datos) {
  const codigo = generarCodigo();
  await sql`
    INSERT INTO pedidos_personalizados
      (id_usuario, codigo_seguimiento, nombre_cliente, telefono, tipo_producto,
       tamano, sabor, mensaje_torta, fecha_entrega)
    VALUES
      (${usuario.id}, ${codigo}, ${datos.nombreCliente}, ${datos.telefono}, ${datos.tipoProducto},
       ${datos.tamano}, ${datos.sabor}, ${datos.mensajeTorta}, ${datos.fechaEntrega});
  `;
  return codigo;
}

function marcarError(idCampo, texto) {
  const span = document.getElementById("error-" + idCampo);
  if (span) span.textContent = texto;
}

function validar(datos) {
  let valido = true;
  ["nombre-cliente", "telefono", "tipo-producto", "tamano", "sabor", "fecha-entrega"]
    .forEach((id) => marcarError(id, ""));

  if (!datos.nombreCliente.trim()) { marcarError("nombre-cliente", "Ingresa tu nombre."); valido = false; }
  if (!/^[0-9]{9}$/.test(datos.telefono)) { marcarError("telefono", "Debe tener 9 dígitos."); valido = false; }
  if (!datos.tipoProducto) { marcarError("tipo-producto", "Elige un tipo de producto."); valido = false; }
  if (!datos.tamano) { marcarError("tamano", "Elige un tamaño."); valido = false; }
  if (!datos.sabor.trim()) { marcarError("sabor", "Indica el sabor."); valido = false; }
  if (!datos.fechaEntrega) { marcarError("fecha-entrega", "Elige una fecha de entrega."); valido = false; }

  return valido;
}

const formulario = document.getElementById("formulario-pedido");
const mensaje = document.getElementById("mensaje-pedido");
const sello = document.getElementById("sello-confirmacion");

formulario.addEventListener("submit", async (evento) => {
  evento.preventDefault();
  mensaje.className = "mensaje-estado";
  sello.className = "sello-confirmacion";

  const datos = {
    nombreCliente: document.getElementById("nombre-cliente").value,
    telefono: document.getElementById("telefono").value,
    tipoProducto: document.getElementById("tipo-producto").value,
    tamano: document.getElementById("tamano").value,
    sabor: document.getElementById("sabor").value,
    mensajeTorta: document.getElementById("mensaje-torta").value,
    fechaEntrega: document.getElementById("fecha-entrega").value,
  };

  if (!validar(datos)) return;

  try {
    const codigo = await guardarPedido(datos);
    mensaje.textContent = "Pedido guardado. Tu código de seguimiento es " + codigo + ".";
    mensaje.className = "mensaje-estado exito visible";
    sello.textContent = "PEDIDO CONFIRMADO " + codigo;
    sello.className = "sello-confirmacion visible";
    formulario.reset();
  } catch (error) {
    mensaje.textContent = "No se pudo guardar el pedido. Intenta nuevamente.";
    mensaje.className = "mensaje-estado fallo visible";
  }
});