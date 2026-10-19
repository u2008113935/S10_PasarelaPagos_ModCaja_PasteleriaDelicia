import { iniciarSesion } from "./auth.js";

// Sombra en el encabezado al hacer scroll (mismo patrón visual en todas las páginas)
const encabezado = document.getElementById("encabezado");
window.addEventListener("scroll", () => {
  encabezado.classList.toggle("con-scroll", window.scrollY > 8);
});

const formulario = document.getElementById("formulario-ingresar");
const mensaje = document.getElementById("mensaje-ingresar");

formulario.addEventListener("submit", async (evento) => {
  evento.preventDefault();
  const correo = document.getElementById("correo-ingresar").value.trim();
  const contrasena = document.getElementById("contrasena-ingresar").value;

  if (!correo || !contrasena) {
    mensaje.textContent = "Completa correo y contraseña.";
    mensaje.className = "mensaje-estado fallo visible";
    return;
  }

  try
    {
    const usuario = await iniciarSesion(correo, contrasena);
    if (!usuario) {
      mensaje.textContent = "Correo o contraseña incorrectos.";
      mensaje.className = "mensaje-estado fallo visible";
      return;
    
    }

    mensaje.textContent = "¡Bienvenida/o, " + usuario.nombre + "! Redirigiendo…";
    mensaje.className = "mensaje-estado exito visible";
    
    //Dependiendo del rol sea cliente, administrador o empleado
    //Se debe redirigir a la página correspondiente
    let destino;
    if (usuario.rol === "cliente") {
        destino = "registro_pedido.html";
    }else if (usuario.rol === "administrador") {
        destino= "paneladmin.html";
    }else if (usuario.rol== "empleado") {
        destino= "panelempleado.html";
    }

    setTimeout(() => { window.location.href = destino; }, 900);

  }catch (error) {
    mensaje.textContent = "No se pudo conectar con la base de datos.";
    mensaje.className = "mensaje-estado fallo visible";
  }
});

  
   