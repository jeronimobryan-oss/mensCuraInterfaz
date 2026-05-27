<?php
session_start();
// Si no hay sesión, mandarlo al login
if (!isset($_SESSION['usuario_id'])) {
    header("Location: ../iniciar_sesion/index.html");
    exit();
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mens Cura - Panel Principal</title>
    <link rel="stylesheet" href="pagPrincipal.css">
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:wght@400;500&display=swap" rel="stylesheet">
</head>
<body>

<header class="header" role="banner">
    <div class="header-left">
        <span class="brain-icon">🧠</span>
        <h1>Mens Cura</h1>
    </div>
    <nav class="header-actions">
        <span style="color: white; margin-right: 10px;">Hola, <?php echo $_SESSION['usuario_nombre']; ?></span>
        <button class="icon-btn" id="btn-perfil" title="Mi perfil">👤</button>
        <a href="borrar_cuenta.php" onclick="return confirm('¿Eliminar cuenta definitivamente?')" style="text-decoration:none; font-size:12px; color:#C2CFDF;">Borrar Cuenta</a>
    </nav>
</header>

<div class="main-container">
    <aside class="sidebar">
        <p class="sidebar-section-label">Atención Médica</p>
        <button class="sidebar-btn" id="btn-agendar-cita">
            <span class="btn-icon">📅</span>
            <span>Agendar Cita</span>
        </button>
        </aside>

    <main class="content" id="main-content">
        </main>

    </div>

<div class="mini-tab-overlay" id="mini-tab" role="dialog" aria-modal="true">
    <div class="mini-tab-content">
        <div class="mini-tab-header">
            <h2 id="mini-tab-title" class="modal-title">Agendar Cita</h2>
            <button class="close-tab-btn" id="close-tab">✕</button>
        </div>
        <div class="mini-tab-body" id="mini-tab-body">
            <form action="agendar.php" method="POST" style="display: flex; flex-direction: column; gap: 15px;">
                <div class="input-group-php">
                    <label>Especialista (Default):</label>
                    <input type="text" name="medico" value="Dr. Alejandro Segovia" readonly 
                           style="background: #EFF3F8; border: none; padding: 10px; border-radius: 8px; width: 100%;">
                </div>
                
                <div class="input-group-php">
                    <label>Selecciona la Fecha:</label>
                    <input type="date" name="fecha" required 
                           min="<?php echo date('Y-m-d'); ?>" 
                           style="padding: 10px; border: 1px solid #C2CFDF; border-radius: 8px; width: 100%;">
                </div>

                <div class="input-group-php">
                    <label>Hora:</label>
                    <select name="hora" required style="padding: 10px; border-radius: 8px; width: 100%;">
                        <option value="09:00">09:00 AM</option>
                        <option value="11:00">11:00 AM</option>
                        <option value="16:00">04:00 PM</option>
                    </select>
                </div>

                <button type="submit" class="btn-submit-cita" 
                        style="background: #2D3561; color: white; padding: 12px; border: none; border-radius: 20px; cursor: pointer;">
                    Confirmar Cita
                </button>
            </form>
        </div>
    </div>
</div>

<script src="script.js"></script>
</body>
</html>