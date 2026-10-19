import { registrarUsuario } from "./auth.js";

// Sombra en el encabezado al hacer scroll (mismo patrón visual en todas las páginas)
const encabezado = document.getElementById("encabezado");
window.addEventListener("scroll", () => {
  encabezado.classList.toggle("con-scroll", window.scrollY > 8);
});

const formulario = document.getElementById("formulario-crear");
const mensaje = document.getElementById("mensaje-crear");

formulario.addEventListener("submit", async (evento) => {
  evento.preventDefault();

  const nombre = document.getElementById("nombre-crear").value.trim();
  const correo = document.getElementById("correo-crear").value.trim();
  const contrasena = document.getElementById("contrasena-crear").value;

  if (!nombre || !correo || contrasena.length < 4) {
    mensaje.textContent = "Revisa los datos: la contraseña debe tener al menos 4 caracteres.";
    mensaje.className = "mensaje-estado fallo visible";
    return;
  }

  try {
    await registrarUsuario(nombre, correo, contrasena);
    mensaje.textContent = "Cuenta creada. Ahora inicia sesión.";
    mensaje.className = "mensaje-estado exito visible";
    setTimeout(() => { window.location.href = "login.html"; }, 900);
  } catch (error) {
    mensaje.textContent = "No se pudo crear la cuenta (¿el correo ya existe?).";
    mensaje.className = "mensaje-estado fallo visible";
  }
});