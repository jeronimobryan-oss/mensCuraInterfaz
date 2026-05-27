<?php
// 1. Incluimos la conexión
include '../config/db.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Recibimos los datos del formulario (Asegúrate que en el HTML los inputs tengan estos name)
    $nombre = mysqli_real_escape_string($conn, $_POST['nombre']);
    $correo = mysqli_real_escape_string($conn, $_POST['correo']);
    $pass = $_POST['password'];
    $confirm_pass = $_POST['confirm_password'];

    // VALIDACIÓN 1: ¿Las contraseñas coinciden?
    if ($pass !== $confirm_pass) {
        echo "<script>alert('Las contraseñas no coinciden.'); window.history.back();</script>";
        exit();
    }

    // VALIDACIÓN 2: ¿El correo ya existe en la base de datos?
    $check_email = mysqli_query($conn, "SELECT * FROM usuarios WHERE correo = '$correo'");

    if (mysqli_num_rows($check_email) > 0) {
        echo "<script>alert('Este correo ya está registrado en Mens Cura.'); window.history.back();</script>";
        exit();
    } else {
        // Encriptamos la contraseña
        $password_encriptada = password_hash($pass, PASSWORD_DEFAULT);

        // 2. DEFINIMOS LA CONSULTA (Esto debe ir antes de ejecutarlo)
        $sql = "INSERT INTO usuarios (nombre, correo, password) VALUES ('$nombre', '$correo', '$password_encriptada')";
        
        // 3. EJECUTAMOS Y VERIFICAMOS
        if (mysqli_query($conn, $sql)) {
            // Si entra aquí, los datos YA ESTÁN en Workbench
            echo "<script>alert('¡Cuenta creada exitosamente!'); window.location.href='../iniciar_sesion/index.html';</script>";
        } else {
            // Si hay un error de conexión o de tabla, te lo dirá aquí:
            echo "Error de MySQL: " . mysqli_error($conn);
        }
    }
}
?>