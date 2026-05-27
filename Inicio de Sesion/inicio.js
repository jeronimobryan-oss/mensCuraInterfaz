document.addEventListener("DOMContentLoaded", () => {
    // 1. SELECTORES
    const loginForm = document.getElementById("loginForm") || document.querySelector("form");
    const correo = document.getElementById("loginEmail");
    const password = document.getElementById("loginPass");
    const inputs = document.querySelectorAll(".input-group input");
    const submitBtn = loginForm.querySelector('button[type="submit"]');

    // 2. CREACIÓN DINÁMICA DEL MENSAJE DE FEEDBACK
    const mensaje = document.createElement("p");
    mensaje.className = "feedback-mensaje"; 
    Object.assign(mensaje.style, {
        marginTop: "20px",
        fontWeight: "600",
        fontSize: "14px",
        textAlign: "center",
        minHeight: "1em" // Evita saltos de layout
    });
    loginForm.appendChild(mensaje);

    // 3. ANIMACIÓN DE LABELS
    const verificarInput = (input) => {
        input.value.trim() !== "" 
            ? input.classList.add("has-content") 
            : input.classList.remove("has-content");
    };

    inputs.forEach(input => {
        input.addEventListener("blur", () => verificarInput(input));
        input.addEventListener("input", () => verificarInput(input));
        verificarInput(input); // Inicializar por autocompletado
    });

    // 4. LÓGICA DE ENVÍO
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const correoValor = correo.value.trim();
        const passwordValor = password.value.trim();

        // Feedback visual de carga
        toggleLoading(true);

        try {
            // Simulación de búsqueda en LocalStorage
            let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
            const usuarioEncontrado = usuarios.find(user => 
                user.correo === correoValor && user.password === passwordValor
            );

            if (usuarioEncontrado) {
                mostrarMensaje("¡Inicio de sesión exitoso!", "#5cb85c");
                
                // Guardar sesión activa (opcional)
                sessionStorage.setItem("userSession", JSON.stringify(usuarioEncontrado));

                setTimeout(() => {
                    window.location.href = "../PaginaPrincipal/menscura.html";
                }, 1500);
            } else {
                throw new Error("Correo o contraseña incorrectos");
            }

        } catch (error) {
            mostrarMensaje(error.message, "#d9534f");
            toggleLoading(false);
        }
    });

    // FUNCIONES AUXILIARES
    function mostrarMensaje(texto, color) {
        mensaje.textContent = texto;
        mensaje.style.color = color;
    }

    function toggleLoading(isLoading) {
        if (submitBtn) {
            submitBtn.disabled = isLoading;
            submitBtn.textContent = isLoading ? "Verificando..." : "Iniciar Sesión";
        }
    }
});