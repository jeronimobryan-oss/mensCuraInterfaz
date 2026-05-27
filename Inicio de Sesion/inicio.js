document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm") || document.querySelector("form");
    const correo = document.getElementById("loginEmail");
    const password = document.getElementById("loginPass");
    const inputs = document.querySelectorAll(".input-group input");

    // 1. ANIMACIÓN DE LABELS (Optimizada)
    const verificarInput = (input) => {
        if (input.value.trim() !== "") {
            input.classList.add("has-content");
        } else {
            input.classList.remove("has-content");
        }
    };

    inputs.forEach(input => {
        input.addEventListener("blur", () => verificarInput(input));
        input.addEventListener("input", () => verificarInput(input));
        verificarInput(input); // Por si hay autocompletado
    });

    // 2. CREACIÓN DINÁMICA DEL MENSAJE DE ERROR
    const mensaje = document.createElement("p");
    mensaje.className = "feedback-mensaje"; // Para darle estilo en CSS
    mensaje.style.marginTop = "20px";
    mensaje.style.fontWeight = "600";
    mensaje.style.fontSize = "14px";
    mensaje.style.textAlign = "center";
    loginForm.appendChild(mensaje);

    // 3. LÓGICA DE INICIO DE SESIÓN
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const correoValor = correo.value.trim();
        const passwordValor = password.value.trim();

        /* OPCIÓN A: LOCAL STORAGE (Usando lo que guardaste en el Registro)
        */
        let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
        const usuarioEncontrado = usuarios.find(user => 
            user.correo === correoValor && user.password === passwordValor
        );

        if (usuarioEncontrado) {
            mostrarMensaje("¡Inicio de sesión exitoso!", "#5cb85c");
            setTimeout(() => {
                window.location.href = "../PaginaPrincipal/menscura.html";
            }, 1500);
        } else {
            mostrarMensaje("Correo o contraseña incorrectos", "#d9534f");
        }
    });

    function mostrarMensaje(texto, color) {
        mensaje.textContent = texto;
        mensaje.style.color = color;
    }
});