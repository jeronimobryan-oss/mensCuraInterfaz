document.addEventListener("DOMContentLoaded", () => {
    const inputEmail = document.getElementById("userEmail");

    inputEmail.addEventListener("blur", () => {
        if (inputEmail.value.trim() !== "") {
            // Si tiene texto, añadimos la clase que lo mantiene arriba
            inputEmail.classList.add("has-content");
        } else {
            // Si está vacío, se la quitamos para que baje
            inputEmail.classList.remove("has-content");
        }
    });
});