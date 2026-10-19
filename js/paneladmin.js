// js/panel/paneladmin.js
import { sql } from './neon-config.js';
import { exigirSesion, cerrarSesion, registrarEmpleado } from './auth.js';

const usuario = exigirSesion();

// Solo el administrador puede quedarse en esta página
if (usuario.rol !== 'administrador') {
  window.location.href = usuario.rol === 'empleado' ? 'panelempleado.html' : 'registro_pedido.html';
}

document.getElementById('etiqueta-rol').textContent = usuario.rol;
document.getElementById('boton-salir').addEventListener('click', () => {
  cerrarSesion();
  window.location.href = 'login.html';
});

const cuerpoTabla = document.getElementById('cuerpo-tabla');
const mensaje = document.getElementById('mensaje-panel');

// ---------- Consultar: TODOS los pedidos ----------
async function listarTodos() {
  return await sql`
    SELECT id, nombre_cliente, tipo_producto, sabor, fecha_entrega, estado
    FROM pedidos_personalizados
    ORDER BY fecha_registro DESC;
  `;
}

function pintarTabla(pedidos) {
  cuerpoTabla.innerHTML = pedidos.map(p => `
    <tr>
      <td>${p.id}</td>
      <td>${p.nombre_cliente ?? '—'}</td>
      <td>${p.tipo_producto}</td>
      <td>${p.sabor}</td>
      <td>${new Date(p.fecha_entrega).toLocaleDateString('es-PE')}</td>
      <td><span class="estado-pill ${p.estado}">${p.estado}</span></td>
      <td class="fila-acciones">
        <button class="btn-editar" data-id="${p.id}" data-sabor="${p.sabor}" data-estado="${p.estado}">Editar</button>
        <button class="btn-eliminar" data-id="${p.id}">Eliminar</button>
      </td>
    </tr>
  `).join('');
}

async function recargar() {
  pintarTabla(await listarTodos());
}

// ---------- Crear pedido (atención presencial) ----------
document.getElementById('formulario-crear').addEventListener('submit', async (evento) => {
  evento.preventDefault();
  const codigo = 'PED-' + Date.now().toString().slice(-8);
  try {
    await sql`
      INSERT INTO pedidos_personalizados
        (codigo_seguimiento, nombre_cliente, telefono, tipo_producto, tamano, sabor, fecha_entrega, estado)
      VALUES
        (${codigo}, ${document.getElementById('c-nombre').value}, ${document.getElementById('c-telefono').value},
         ${document.getElementById('c-tipo').value}, 'mediano', ${document.getElementById('c-sabor').value},
         ${document.getElementById('c-fecha').value}, 'registrado');
    `;
    mensaje.textContent = 'Pedido creado con código ' + codigo + '.';
    mensaje.className = 'mensaje-estado exito visible';
    evento.target.reset();
    recargar();
  } catch (error) {
    mensaje.textContent = 'No se pudo crear el pedido.';
    mensaje.className = 'mensaje-estado fallo visible';
  }
});

// ---------- Crear empleado (solo administrador) ----------
document.getElementById('formulario-crear-empleado').addEventListener('submit', async (evento) => {
  evento.preventDefault();
  const nombre = document.getElementById('e-nombre').value.trim();
  const correo = document.getElementById('e-correo').value.trim();
  const contrasena = document.getElementById('e-contrasena').value;

  try {
    await registrarEmpleado(nombre, correo, contrasena);
    mensaje.textContent = 'Empleado "' + nombre + '" creado correctamente.';
    mensaje.className = 'mensaje-estado exito visible';
    evento.target.reset();
  } catch (error) {
    mensaje.textContent = 'No se pudo crear el empleado (¿el correo ya existe?).';
    mensaje.className = 'mensaje-estado fallo visible';
  }
});

// ---------- Actualizar: modal con sabor y estado ----------
const modal = document.getElementById('modal-editar');
let idEnEdicion = null;

cuerpoTabla.addEventListener('click', (evento) => {
  const boton = evento.target;
  if (boton.classList.contains('btn-editar')) {
    idEnEdicion = boton.dataset.id;
    document.getElementById('modal-id').textContent = idEnEdicion;
    document.getElementById('modal-sabor').value = boton.dataset.sabor;
    document.getElementById('modal-estado').value = boton.dataset.estado;
    modal.classList.add('visible');
  }
  if (boton.classList.contains('btn-eliminar')) {
    eliminarPedido(boton.dataset.id);
  }
});

document.getElementById('modal-cancelar').addEventListener('click', () => modal.classList.remove('visible'));

document.getElementById('modal-guardar').addEventListener('click', async () => {
  try {
    await sql`
      UPDATE pedidos_personalizados
      SET sabor = ${document.getElementById('modal-sabor').value},
          estado = ${document.getElementById('modal-estado').value}
      WHERE id = ${idEnEdicion};
    `;
    modal.classList.remove('visible');
    mensaje.textContent = 'Pedido #' + idEnEdicion + ' actualizado.';
    mensaje.className = 'mensaje-estado exito visible';
    recargar();
  } catch (error) {
    mensaje.textContent = 'No se pudo actualizar.';
    mensaje.className = 'mensaje-estado fallo visible';
  }
});

// ---------- Eliminar: con confirmación ----------
async function eliminarPedido(id) {
  const confirmado = confirm('¿Eliminar el pedido #' + id + '? Esta acción no se puede deshacer.');
  if (!confirmado) return;

  try {
    await sql`DELETE FROM pedidos_personalizados WHERE id = ${id};`;
    mensaje.textContent = 'Pedido #' + id + ' eliminado.';
    mensaje.className = 'mensaje-estado exito visible';
    recargar();
  } catch (error) {
    mensaje.textContent = 'No se pudo eliminar.';
    mensaje.className = 'mensaje-estado fallo visible';
  }
}

recargar();