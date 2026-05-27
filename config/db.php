<?php
$host = "localhost";
$user = "root"; 
$pass = ""; // Pon tu contraseña de MySQL Workbench si tienes una
$db   = "mens_cura";

$conn = mysqli_connect($host, $user, $pass, $db);

if (!$conn) {
    die("Error de conexión: " . mysqli_connect_error());
}
?>