<?php
session_start();
include '../config/db.php';

$id = $_SESSION['usuario_id'];

// Borra al usuario y por CASCADE en la base de datos se borran sus citas
$sql = "DELETE FROM usuarios WHERE id = '$id'";

if (mysqli_query($conn, $sql)) {
    session_destroy();
    echo "<script>alert('Tu cuenta y datos han sido eliminados.'); window.location.href='../crear_cuenta/index.html';</script>";
}
?>