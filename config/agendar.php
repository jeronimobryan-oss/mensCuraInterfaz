<?php
session_start();
include '../config/db.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $paciente_id = $_SESSION['usuario_id'];
    $fecha = $_POST['fecha'];
    $hora = $_POST['hora'];
    $medico = $_POST['medico'];
    $hoy = date('Y-m-d');

    // Validación de seguridad extra: que no sea fecha pasada
    if ($fecha < $hoy) {
        echo "<script>alert('Error: No puedes agendar en el pasado.'); window.history.back();</script>";
        exit();
    }

    $sql = "INSERT INTO citas (usuario_id, medico_nombre, fecha, hora) VALUES ('$paciente_id', '$medico', '$fecha', '$hora')";
    
    if (mysqli_query($conn, $sql)) {
        echo "<script>alert('Cita agendada con éxito para el $fecha'); window.location.href='index.php';</script>";
    } else {
        echo "Error al agendar: " . mysqli_error($conn);
    }
}
?>