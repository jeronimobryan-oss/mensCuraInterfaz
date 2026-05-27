<?php
session_start(); // Inicia la sesión para recordar al usuario
include '../config/db.php'; // Conexión a la base de datos

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Escapar datos para evitar inyecciones SQL
    $correo = mysqli_real_escape_string($conn, $_POST['correo']);
    $pass = $_POST['password'];

    // Buscamos al usuario por correo
    $sql = "SELECT * FROM usuarios WHERE correo = '$correo'";
    $resultado = mysqli_query($conn, $sql);
    $usuario = mysqli_fetch_assoc($resultado);

    // Verificamos si el usuario existe y la contraseña es correcta
    if ($usuario && password_verify($pass, $usuario['password'])) {
        
        // Guardamos los datos importantes en la SESIÓN
        $_SESSION['usuario_id'] = $usuario['id'];
        $_SESSION['usuario_nombre'] = $usuario['nombre'];

        // Redirigimos a la página principal
        header("Location: ../pagina_principal/index.php");
        exit();
    } else {
        // Si fallan los datos, lanzamos alerta y regresamos
        echo "<script>alert('Correo o contraseña incorrectos.'); window.history.back();</script>";
    }
}
?>