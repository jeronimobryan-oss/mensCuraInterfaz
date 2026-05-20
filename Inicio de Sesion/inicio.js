document.addEventListener("DOMContentLoaded", () => {
    // Seleccionamos todos los inputs dentro de un input-group
    const inputs = document.querySelectorAll(".input-group input");

    inputs.forEach(input => {
        // Función para añadir o quitar la clase según el contenido
        const verificar = () => {
            if (input.value.trim() !== "") {
                input.classList.add("has-content");
            } else {
                input.classList.remove("has-content");
            }
        };

        // Escuchamos cuando sale (blur) y cuando escribe (input)
        input.addEventListener("blur", verificar);
        input.addEventListener("input", verificar);
        
        // Ejecutamos al cargar por si el navegador autocompletó los campos
        verificar();
    });
});