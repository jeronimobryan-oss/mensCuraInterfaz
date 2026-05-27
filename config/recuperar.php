<?php
// 1. Incluimos la conexión a la base de datos
include '../config/db.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Limpiamos el correo recibido para evitar inyecciones
    $correo = mysqli_real_escape_string($conn, $_POST['correo']);

    // REGLA: Validar si el correo existe en la base de datos
    $check_email = mysqli_query($conn, "SELECT * FROM usuarios WHERE correo = '$correo'");

    if (mysqli_num_rows($check_email) > 0) {
        // Si existe, simulamos el éxito del envío
        echo "<script>
                alert('Solicitud enviada. Si el correo es correcto, recibirás instrucciones para restablecer tu contraseña.');
                window.location.href='/Inicio de Sesion/index.html'; 
              </script>";
    } else {
        // Si no existe, avisamos al usuario (Regla de negocio: validar existencia)
        echo "<script>
                alert('El correo electrónico no se encuentra registrado en nuestro sistema.');
                window.history.back();
              </script>";
    }
}
?>