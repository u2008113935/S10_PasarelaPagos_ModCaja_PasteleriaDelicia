import { sql } from "./neon-config.js";
import { exigirSesion, cerrarSesion } from "./auth.js";

// Sombra en el encabezado al hacer scroll (mismo patrón visual en todas las páginas)
const encabezado = document.getElementById("encabezado");
window.addEventListener("scroll", () => {
  encabezado.classList.toggle("con-scroll", window.scrollY > 8);
});

const usuario = exigirSesion();

const botonSalir = document.getElementById("boton-salir");
if (botonSalir) {
  botonSalir.addEventListener("click", () => {
    cerrarSesion();
    window.location.href = "login.html";
  });
}

async function listarPedidos() {
  return await sql`
    SELECT codigo_seguimiento, tipo_producto, tamano, sabor, fecha_entrega, estado, fecha_registro
    FROM pedidos_personalizados
    WHERE id_usuario = ${usuario.id}
    ORDER BY fecha_registro DESC;
  `;
}

function pintarTabla(pedidos) {
  const cuerpo = document.getElementById("cuerpo-tabla-pedidos");
  const vacio = document.getElementById("sin-pedidos");
  cuerpo.innerHTML = "";

  if (pedidos.length === 0) {
    vacio.style.display = "block";
    return;
  }
  vacio.style.display = "none";

  pedidos.forEach((pedido) => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${pedido.codigo_seguimiento}</td>
      <td>${pedido.tipo_producto}</td>
      <td>${pedido.tamano}</td>
      <td>${pedido.sabor}</td>
      <td>${new Date(pedido.fecha_entrega).toLocaleDateString("es-PE")}</td>
      <td><span class="estado-pill">${pedido.estado}</span></td>
    `;
    cuerpo.appendChild(fila);
  });
}

(async () => {
  const mensaje = document.getElementById("mensaje-consulta");
  try {
    const pedidos = await listarPedidos();
    pintarTabla(pedidos);
  } catch (error) {
    mensaje.textContent = "No se pudo cargar tus pedidos.";
    mensaje.className = "mensaje-estado fallo visible";
  }
})();