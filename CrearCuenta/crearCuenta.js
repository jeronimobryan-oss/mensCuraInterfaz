document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("registroForm");
    const nombre = document.getElementById("regName");
    const correo = document.getElementById("regEmail");
    const password = document.getElementById("regPass");
    const confirmPassword = document.getElementById("confirmPass");

    // --- 1. LÓGICA DE INPUTS ANIMADOS ---
    const inputs = document.querySelectorAll(".input-group input");

    inputs.forEach(input => {
        const verificar = () => {
            // Si tiene texto, añadimos la clase; si no, la quitamos
            if (input.value.trim() !== "") {
                input.classList.add("has-content");
            } else {
                input.classList.remove("has-content");
            }
        };

        // Escuchar cuando el usuario sale del campo o escribe
        input.addEventListener("blur", verificar);
        input.addEventListener("input", verificar);

        // Ejecutar al cargar por si el navegador autocompleta
        verificar();
    });

    // --- 2. CREACIÓN DEL MENSAJE DE FEEDBACK ---
    const mensaje = document.createElement("p");
    mensaje.style.marginTop = "20px";
    mensaje.style.fontWeight = "600";
    mensaje.style.fontSize = "14px";
    mensaje.style.textAlign = "center";
    form.appendChild(mensaje);

    // --- 3. GESTIÓN DEL REGISTRO ---
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const nombreValor = nombre.value.trim();
        const correoValor = correo.value.trim();
        const passwordValor = password.value.trim();
        const confirmValor = confirmPassword.value.trim();

        // Validación de campos vacíos
        if (!nombreValor || !correoValor || !passwordValor || !confirmValor) {
            mostrarMensaje("Completa todos los campos", "#d9534f");
            return;
        }

        // Validación de seguridad mínima
        if (passwordValor.length < 6) {
            mostrarMensaje("La contraseña debe tener mínimo 6 caracteres", "#d9534f");
            return;
        }

        // Validación de coincidencia
        if (passwordValor !== confirmValor) {
            mostrarMensaje("Las contraseñas no coinciden", "#d9534f");
            return;
        }

        // Lógica de Almacenamiento (LocalStorage)
        let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
        const existe = usuarios.find(user => user.correo === correoValor);

        if (existe) {
            mostrarMensaje("Ese correo ya está registrado", "#d9534f");
            return;
        }

        // Guardar nuevo usuario
        usuarios.push({
            nombre: nombreValor,
            correo: correoValor,
            password: passwordValor
        });

        localStorage.setItem("usuarios", JSON.stringify(usuarios));

        mostrarMensaje("¡Cuenta creada correctamente!", "#5cb85c");

        form.reset();
        // Limpiar las clases de los labels tras el reset
        inputs.forEach(input => input.classList.remove("has-content"));

        // Redirección
        setTimeout(() => {
            window.location.href = "../Inicio%20de%20Sesion/index.html";
        }, 1500);
    });

    // Función auxiliar para no repetir código de mensajes
    function mostrarMensaje(texto, color) {
        mensaje.textContent = texto;
        mensaje.style.color = color;
    }
    async function crearCuenta() {

    const nombre = document.getElementById("nombre").value;
    const correo = document.getElementById("correo").value;
    const password = document.getElementById("password").value;

    const respuesta = await fetch("http://localhost:8080/pacientes", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            nombre,
            correo,
            password
        })
    });

    const datos = await respuesta.json();

    console.log(datos);
}
});