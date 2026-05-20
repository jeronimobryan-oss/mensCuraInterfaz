document.querySelectorAll('.input-group input').forEach(input => {
    input.addEventListener('blur', () => {
        if (input.value !== "") {
            input.classList.add('has-content');
        } else {
            input.classList.remove('has-content');
        }
    });
});