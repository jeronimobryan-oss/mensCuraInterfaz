document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    const inputEmail = document.getElementById("userEmail");

    // --- 1. ANIMACIÓN DEL LABEL ---
    // Función para verificar si el input tiene texto
    const verificarInput = () => {
        if (inputEmail.value.trim() !== "") {
            inputEmail.classList.add("has-content");
        } else {
            inputEmail.classList.remove("has-content");
        }
    };

    // Escuchamos cuando pierde el foco (blur) y cuando escribe (input)
    inputEmail.addEventListener("blur", verificarInput);
    inputEmail.addEventListener("input", verificarInput);

    // Ejecutar al inicio por si el navegador autocompleta el correo
    verificarInput();

    // --- 2. CREACIÓN DEL MENSAJE DE FEEDBACK ---
    const mensaje = document.createElement("p");
    mensaje.style.marginTop = "20px";
    mensaje.style.fontWeight = "600";
    mensaje.style.fontSize = "14px";
    mensaje.style.textAlign = "center"; // Centramos el texto para que se vea mejor
    form.appendChild(mensaje);

    // --- 3. LÓGICA DE RECUPERACIÓN ---
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const correoABuscar = inputEmail.value.trim();

        // Si el campo está vacío (aunque el HTML lo valide, es buena práctica)
        if (correoABuscar === "") {
            mensaje.textContent = "Por favor, ingresa tu correo electrónico";
            mensaje.style.color = "#d9534f"; // Rojo
            return;
        }

        // Obtener la lista de usuarios registrados en el LocalStorage
        let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

        // Buscar si el correo ingresado existe en nuestra "base de datos"
        const usuarioExiste = usuarios.find(user => user.correo === correoABuscar);

        if (!usuarioExiste) {
            mensaje.textContent = "No existe una cuenta con ese correo";
            mensaje.style.color = "#d9534f"; // Rojo
            return;
        }

        // Si el usuario existe, simulamos el envío del enlace
        mensaje.textContent = "¡Enlace enviado! Revisa tu bandeja de entrada";
        mensaje.style.color = "#5cb85c"; // Verde

        // Limpiamos el formulario y reseteamos la animación del label
        form.reset();
        inputEmail.classList.remove("has-content");
    });
});