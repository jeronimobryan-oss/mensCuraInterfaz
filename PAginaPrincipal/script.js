"use strict";
// REFERENCIAS DOM
const miniTab      = document.getElementById("mini-tab");
const miniTabTitle = document.getElementById("mini-tab-title");
const miniTabBody  = document.getElementById("mini-tab-body");
const closeTabBtn  = document.getElementById("close-tab");

// SISTEMA DE ACCESIBILIDAD
const STORAGE_KEY = "menscura_acc";

const acc = {
    tema:           "normal",
    textoGrande:    false,
    sinAnimaciones: false,
    altaContraste:  false,
};

function cargarPreferencias() {
    try {
        const guardado = localStorage.getItem(STORAGE_KEY);
        if (guardado) Object.assign(acc, JSON.parse(guardado));
    } catch (_) { /* localStorage no disponible */ }
    aplicarTema();
}

function guardarPreferencias() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(acc)); }
    catch (_) {}
}

function aplicarTema() {
    const root = document.documentElement;

    // Eliminar todas las clases de tema anteriores
    root.classList.remove(
        "tema-oscuro",
        "tema-alto-contraste",
        "tema-daltonismo",
        "texto-grande",
        "sin-animaciones"
    );

    // Aplicar tema de color
    if (acc.tema === "oscuro")         root.classList.add("tema-oscuro");
    if (acc.tema === "alto-contraste") root.classList.add("tema-alto-contraste");
    if (acc.tema === "daltonismo")     root.classList.add("tema-daltonismo");

    // Aplicar modificadores extra
    if (acc.textoGrande)    root.classList.add("texto-grande");
    if (acc.sinAnimaciones) root.classList.add("sin-animaciones");

    guardarPreferencias();
}

// Detectar preferencia de movimiento reducido del sistema operativo
if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    acc.sinAnimaciones = true;
}

// Detectar preferencia de esquema de color del sistema operativo
if (window.matchMedia("(prefers-color-scheme: dark)").matches && acc.tema === "normal") {
    acc.tema = "oscuro";
}

// PLANTILLAS DE CONTENIDO MODAL
const tabTemplates = {

    /*  CONSULTA EN LÍNEA  */
    consulta: `
        <div class="tab-grid-layout">
            <p style="font-size:0.85rem; color:var(--text-mid);">Configura los parámetros de tu sesión clínica de forma asíncrona y segura.</p>
            <div class="tab-input-group">
                <label for="c-esp">Especialista disponible</label>
                <select id="c-esp">
                    <option>Dra. Valeria Pérez Ochoa — Psicología Clínica</option>
                    <option>Dr. Alejandro Segovia Sarmiento — Psiquiatría</option>
                    <option>Mtra. Elihú Alejandro Ibarra — TCC</option>
                    <option>Dr. Jared Delgado Romero — Conductas de Riesgo</option>
                </select>
            </div>
            <div class="tab-input-group">
                <label for="c-modal">Modalidad de interconexión</label>
                <select id="c-modal">
                    <option>🎥 Videollamada de alta definición</option>
                    <option>💬 Chat directo de urgencia</option>
                    <option>📞 Llamada de audio</option>
                </select>
            </div>
            <div style="display:flex; gap:12px;">
                <div class="tab-input-group" style="flex:1;">
                    <label for="c-fecha">Fecha preferida</label>
                    <input type="date" id="c-fecha">
                </div>
                <div class="tab-input-group" style="flex:1;">
                    <label for="c-hora">Horario</label>
                    <input type="time" id="c-hora" value="10:00">
                </div>
            </div>
            <div class="tab-input-group">
                <label for="c-motivo">Motivo de la consulta</label>
                <textarea id="c-motivo" rows="3" placeholder="Describe brevemente cómo te sientes o el síntoma principal..."></textarea>
            </div>
            <button class="btn-submit-tab" onclick="cerrarPestana('Abriendo pasarela segura... Conectando con el especialista.')">🚀 Lanzar consulta en línea</button>
        </div>`,

    /*REAGENDAR CITA*/
    reagendar: `
        <div class="tab-grid-layout">
            <div class="tab-input-group">
                <label for="r-cita">Seleccionar cita activa</label>
                <select id="r-cita">
                    <option>Sesión de Control Emocional — Jue 28/05/2026 a las 10:00</option>
                    <option>Seguimiento Psiquiátrico — Mar 03/06/2026 a las 14:00</option>
                </select>
            </div>
            <div style="display:flex; gap:12px;">
                <div class="tab-input-group" style="flex:1;">
                    <label for="r-fecha">Nueva fecha</label>
                    <input type="date" id="r-fecha" value="2026-06-04">
                </div>
                <div class="tab-input-group" style="flex:1;">
                    <label for="r-hora">Nuevo horario</label>
                    <input type="time" id="r-hora" value="16:00">
                </div>
            </div>
            <div class="tab-input-group">
                <label for="r-razon">Razón del cambio (opcional)</label>
                <input type="text" id="r-razon" placeholder="Ej. Cruce de horario escolar o laboral">
            </div>
            <div class="modal-info-block">
                ⚠️ Los reagendados se procesan dentro de las primeras <strong>24 horas</strong>. Recibirás confirmación por correo electrónico institucional.
            </div>
            <button class="btn-submit-tab" onclick="cerrarPestana('Solicitud enviada. Recibirás confirmación por correo pronto.')">✅ Confirmar reprogramación</button>
        </div>`,

/*DIRECTIO MÉDICO*/
    directorio: `
        <div class="tab-grid-layout">
            <div style="display:flex; gap:10px;">
                <input type="text" id="dir-buscar" placeholder="Buscar por nombre o especialidad..." style="flex:1;" aria-label="Buscar especialista por nombre o especialidad">
                <button style="background:var(--navy); color:white; border:none; padding:0 18px; border-radius:12px; cursor:pointer; font-family:var(--font-body); font-size:0.85rem;" aria-label="Ejecutar búsqueda">🔍 Buscar</button>
            </div>
            <div class="tab-input-group">
                <label for="dir-filtro">Filtrar por especialidad</label>
                <select id="dir-filtro">
                    <option>Todos los especialistas</option>
                    <option>Psicología Clínica</option>
                    <option>Psiquiatría Médica</option>
                    <option>Terapia Cognitivo-Conductual</option>
                    <option>Prevención de Conductas de Riesgo</option>
                    <option>Psicología Infantil y Adolescente</option>
                    <option>Neuropsicología</option>
                </select>
            </div>
            <div role="list" style="display:flex; flex-direction:column; gap:10px; max-height:200px; overflow-y:auto; padding-right:4px;" aria-label="Resultados del directorio">
                <div role="listitem" class="psychologist-card-item" style="padding:10px 14px;">
                    <div class="psy-avatar" style="width:38px;height:38px;font-size:1.2rem;border-radius:10px;" aria-hidden="true">👩‍⚕️</div>
                    <div class="psy-details">
                        <h3 class="psy-name" style="font-size:0.88rem;">Dra. Valeria Pérez Ochoa</h3>
                        <p style="font-size:0.76rem;">Psicología Clínica · ⭐ 4.9</p>
                    </div>
                    <button class="action-btn-psy" style="font-size:0.75rem;padding:6px 12px;" aria-label="Agendar cita con la Dra. Valeria Pérez" onclick="cerrarPestana('Redirigiendo al módulo de agendado...')">Agendar</button>
                </div>
                <div role="listitem" class="psychologist-card-item" style="padding:10px 14px;">
                    <div class="psy-avatar" style="width:38px;height:38px;font-size:1.2rem;border-radius:10px;" aria-hidden="true">👨‍⚕️</div>
                    <div class="psy-details">
                        <h3 class="psy-name" style="font-size:0.88rem;">Dr. Alejandro Segovia Sarmiento</h3>
                        <p style="font-size:0.76rem;">Psiquiatría · ⭐ 4.8</p>
                    </div>
                    <button class="action-btn-psy" style="font-size:0.75rem;padding:6px 12px;" aria-label="Agendar cita con el Dr. Alejandro Segovia" onclick="cerrarPestana('Redirigiendo al módulo de agendado...')">Agendar</button>
                </div>
                <div role="listitem" class="psychologist-card-item" style="padding:10px 14px;">
                    <div class="psy-avatar" style="width:38px;height:38px;font-size:1.2rem;border-radius:10px;" aria-hidden="true">👨‍⚕️</div>
                    <div class="psy-details">
                        <h3 class="psy-name" style="font-size:0.88rem;">Dr. Jared Delgado Romero</h3>
                        <p style="font-size:0.76rem;">Conductas de Riesgo · ⭐ 4.7</p>
                    </div>
                    <button class="action-btn-psy" style="font-size:0.75rem;padding:6px 12px;" aria-label="Agendar cita con el Dr. Jared Delgado" onclick="cerrarPestana('Redirigiendo al módulo de agendado...')">Agendar</button>
                </div>
                <div role="listitem" class="psychologist-card-item" style="padding:10px 14px;">
                    <div class="psy-avatar" style="width:38px;height:38px;font-size:1.2rem;border-radius:10px;" aria-hidden="true">👩‍⚕️</div>
                    <div class="psy-details">
                        <h3 class="psy-name" style="font-size:0.88rem;">Mtra. Elihú Alejandro Ibarra</h3>
                        <p style="font-size:0.76rem;">Terapia Cognitivo-Conductual · ⭐ 4.9</p>
                    </div>
                    <button class="action-btn-psy" style="font-size:0.75rem;padding:6px 12px;" aria-label="Agendar cita con la Mtra. Elihú Ibarra" onclick="cerrarPestana('Redirigiendo al módulo de agendado...')">Agendar</button>
                </div>
            </div>
        </div>`,

    /* MI MEDICACIn */
    medicacion: `
        <div class="tab-grid-layout">
            <div class="med-card">
                <h4>Sertralina — 50 mg</h4>
                <p><strong>Frecuencia:</strong> Una tableta cada 24 horas, por las mañanas.</p>
                <p>⏰ Recordatorio automático: 08:00 AM</p>
            </div>
            <div class="med-card">
                <h4>Alprazolam — 0.25 mg (rescate)</h4>
                <p><strong>Uso:</strong> Solo en episodios de ansiedad aguda, máximo 1 diario.</p>
                <p>⚠️ Uso bajo supervisión médica obligatoria.</p>
            </div>
            <div style="background:var(--cream); border:1px solid var(--frost); border-radius:14px; padding:14px; display:flex; flex-direction:column; gap:10px;">
                <label class="task-item" style="cursor:pointer;">
                    <input type="checkbox" style="accent-color:var(--navy); width:17px; height:17px; margin-top:1px; flex-shrink:0;" aria-label="Marcar dosis de hoy como tomada">
                    <span>Marcar dosis de hoy como tomada</span>
                </label>
                <label class="task-item" style="cursor:pointer;">
                    <input type="checkbox" style="accent-color:var(--navy); width:17px; height:17px; margin-top:1px; flex-shrink:0;" aria-label="Activar recordatorio para mañana">
                    <span>Activar recordatorio para mañana</span>
                </label>
            </div>
            <button class="btn-submit-tab" onclick="cerrarPestana('Registro de adherencia guardado correctamente.')">💊 Actualizar mi medicación</button>
        </div>`,

    /*MIS RECETAS*/
    recetas: `
        <div class="tab-grid-layout">
            <p style="font-size:0.84rem; color:var(--text-mid);">Descarga las recetas autorizadas emitidas por tus médicos asignados.</p>
            <div class="recipe-card">
                <div>
                    <strong>Receta Controlada — Folio #2026-A</strong><br>
                    <small>Emitida por Dr. Alejandro Segovia · 15/05/2026</small>
                </div>
                <button class="recipe-download" aria-label="Descargar receta controlada folio 2026-A en PDF" onclick="mostrarToast('Descargando archivo PDF...')">📥 Descargar</button>
            </div>
            <div class="recipe-card">
                <div>
                    <strong>Receta General — Folio #2026-B</strong><br>
                    <small>Emitida por Dra. Valeria Pérez · 20/05/2026</small>
                </div>
                <button class="recipe-download" aria-label="Descargar receta general folio 2026-B en PDF" onclick="mostrarToast('Descargando archivo PDF...')">📥 Descargar</button>
            </div>
            <div class="modal-info-block">
                📋 Las recetas controladas tienen vigencia de <strong>30 días</strong> a partir de su fecha de emisión. Acude con tu farmacéutico con identificación oficial.
            </div>
        </div>`,

    /*HISTORIAL MÉDICO*/
    historial: `
        <div class="tab-grid-layout">
            <div class="modal-info-block">
                <p><strong>Expediente Clínico:</strong> #MC-14223</p>
                <p><strong>Diagnóstico:</strong> Ansiedad Generalizada Secundaria a Factores de Estrés del Entorno (F41.1)</p>
                <p><strong>Última evaluación:</strong> 20 de mayo de 2026</p>
                <p><strong>Médico tratante:</strong> Dr. Alejandro Segovia Sarmiento</p>
                <p><strong>Próxima revisión:</strong> 28 de mayo de 2026</p>
                <p><strong>Alergias documentadas:</strong> Ninguna conocida</p>
            </div>
            <div class="tab-input-group">
                <label for="h-periodo">Período a consultar</label>
                <select id="h-periodo">
                    <option>Últimos 3 meses</option>
                    <option>Últimos 6 meses</option>
                    <option>Último año</option>
                    <option>Historial completo</option>
                </select>
            </div>
            <button class="btn-submit-tab secondary" onclick="cerrarPestana('Solicitud de copia enviada al correo registrado.')">📋 Solicitar copia certificada</button>
        </div>`,

    /*MI PRGRESO*/
    progreso: `
        <div class="tab-grid-layout">
            <p style="font-size:0.84rem; color:var(--text-mid);">Métricas del periodo actual — Semana del 19 al 25 de mayo, 2026.</p>
            ${[
                ["Estabilidad emocional", 88],
                ["Adherencia a la medicación", 95],
                ["Tareas terapéuticas completadas", 72],
                ["Sesiones asistidas este mes (3/4)", 75],
                ["Calidad de sueño reportada", 80],
            ].map(([label, val]) => `
            <div>
                <div style="display:flex; justify-content:space-between; font-size:0.84rem; margin-bottom:5px;">
                    <span style="color:var(--text-mid);">${label}</span>
                    <strong style="color:var(--text-dark);">${val}%</strong>
                </div>
                <div class="metric-bar" role="progressbar" aria-valuenow="${val}" aria-valuemin="0" aria-valuemax="100" aria-label="${label}: ${val}%">
                    <div class="metric-bar-fill" style="width:${val}%"></div>
                </div>
            </div>`).join('')}
            <div class="modal-info-block">
                🌟 Tu evolución semanal es positiva. El Dr. Segovia ha registrado mejora en tu manejo de la ansiedad situacional.
            </div>
        </div>`,

    /* DIRIO DE ÁNIMO*/
    diario: `
        <div class="tab-grid-layout">
            <div class="tab-input-group">
                <label for="d-animo">¿Cómo calificarías tu estado de ánimo hoy?</label>
                <select id="d-animo">
                    <option>😊 Excelente — Con pleno control</option>
                    <option>😌 Bien — Calmo y estable</option>
                    <option>😐 Neutral — Sin cambios relevantes</option>
                    <option>😔 Bajo — Con preocupaciones leves</option>
                    <option>😢 Agobiado — Con ansiedad elevada</option>
                </select>
            </div>
            <div class="tab-input-group">
                <label for="d-energia">Nivel de energía</label>
                <select id="d-energia">
                    <option>⚡ Alta energía</option>
                    <option>🔋 Energía moderada</option>
                    <option>🪫 Energía baja / Cansancio notable</option>
                </select>
            </div>
            <div class="tab-input-group">
                <label for="d-texto">Pensamientos y reflexiones del día</label>
                <textarea id="d-texto" rows="4" placeholder="Registra libremente eventos significativos, emociones o reflexiones..."></textarea>
            </div>
            <label class="task-item" style="cursor:pointer;">
                <input type="checkbox" id="d-compartir" style="accent-color:var(--navy); width:17px; height:17px; margin-top:1px; flex-shrink:0;" aria-label="Compartir esta entrada con tu terapeuta">
                <span style="font-size:0.85rem; color:var(--text-mid);">Compartir con mi terapeuta en la próxima sesión</span>
            </label>
            <button class="btn-submit-tab" onclick="cerrarPestana('Entrada del diario guardada de forma segura.')">📓 Guardar entrada de hoy</button>
        </div>`,

    /*TAREAS TERAPÉUTICAS*/
    tareas: `
        <div class="tab-grid-layout">
            <p style="font-size:0.84rem; color:var(--text-mid);">Objetivos fijados por tu terapeuta para la semana en curso:</p>
            <div style="background:var(--cream); border:1px solid var(--frost); border-radius:16px; padding:16px; display:flex; flex-direction:column; gap:13px;" role="group" aria-label="Lista de tareas terapéuticas">
                ${[
                    "Practicar respiración diafragmática por 5 minutos cada mañana.",
                    "Escribir al menos una entrada en el diario de ánimo.",
                    "Evitar dinámicas de riesgo conductual identificadas en sesión.",
                    "Realizar 15 minutos de caminata al aire libre.",
                    "Practicar la técnica de relajación muscular progresiva.",
                    "Leer el material de psicoeducación enviado por tu terapeuta.",
                ].map((tarea, i) => `
                <label class="task-item" style="cursor:pointer;">
                    <input type="checkbox" id="tarea-${i}" style="accent-color:var(--navy); width:17px; height:17px; margin-top:2px; flex-shrink:0;" aria-label="${tarea}">
                    <span>${tarea}</span>
                </label>`).join('')}
            </div>
            <button class="btn-submit-tab" onclick="cerrarPestana('Progreso de tareas guardado correctamente.')">✅ Guardar avances</button>
        </div>`,

    /*RECURSOS DE APOYO*/
    recursos: `
        <div class="tab-grid-layout">
            <p style="font-size:0.84rem; color:var(--text-mid);">Materiales y recursos terapéuticos seleccionados para tu plan de tratamiento:</p>
            <div style="display:flex; flex-direction:column; gap:10px;">
                <div class="recipe-card">
                    <div>
                        <strong> Guía de Manejo de Ansiedad</strong><br>
                        <small>PDF · 24 páginas · Nivel básico</small>
                    </div>
                    <button class="recipe-download" aria-label="Ver guía de manejo de ansiedad" onclick="mostrarToast('Abriendo recurso...')">Ver</button>
                </div>
                <div class="recipe-card">
                    <div>
                        <strong> Meditación de Mindfulness (12 min)</strong><br>
                        <small>Audio · Técnica de atención plena</small>
                    </div>
                    <button class="recipe-download" aria-label="Reproducir audio de meditación mindfulness" onclick="mostrarToast('Reproduciendo audio...')">▶ Play</button>
                </div>
                <div class="recipe-card">
                    <div>
                        <strong> Registro de Pensamientos TCC</strong><br>
                        <small>Hoja de trabajo · Terapia Cognitiva</small>
                    </div>
                    <button class="recipe-download" aria-label="Descargar hoja de registro de pensamientos TCC" onclick="mostrarToast('Descargando...')">📥 Bajar</button>
                </div>
                <div class="recipe-card">
                    <div>
                        <strong> Video: Técnicas de grounding</strong><br>
                        <small>Video · 8 minutos · Técnica 5-4-3-2-1</small>
                    </div>
                    <button class="recipe-download" aria-label="Ver video de técnicas de grounding" onclick="mostrarToast('Abriendo video...')">▶ Ver</button>
                </div>
            </div>
        </div>`,

    /* MEDITACIÓN*/
    meditacion: `
        <div class="tab-grid-layout">
            <div class="tab-input-group">
                <label for="m-tipo">Tipo de meditación</label>
                <select id="m-tipo">
                    <option> Respiración consciente (5 min)</option>
                    <option> Mindfulness de atención plena (10 min)</option>
                    <option> Relajación para dormir (15 min)</option>
                    <option> Relajación muscular progresiva (12 min)</option>
                    <option> Visualización guiada — La playa (8 min)</option>
                </select>
            </div>
            <div class="tab-input-group">
                <label for="m-audio">Ambiente sonoro</label>
                <select id="m-audio">
                    <option> Lluvia suave</option>
                    <option> Música instrumental</option>
                    <option> Naturaleza — bosque</option>
                    <option> Olas del mar</option>
                    <option> Sin sonido de fondo</option>
                </select>
            </div>
            <div style="background:var(--frost); border-radius:16px; padding:18px; text-align:center;">
                <div style="font-size:2.4rem; margin-bottom:8px;" aria-hidden="true">🧘</div>
                <p style="font-size:0.87rem; color:var(--text-mid); line-height:1.55;">Encuentra un lugar cómodo, cierra los ojos y sigue las indicaciones de audio al presionar inicio.</p>
            </div>
            <button class="btn-submit-tab" onclick="cerrarPestana('Iniciando sesión de meditación...')">▶ Iniciar meditación</button>
        </div>`,

    /*MI PERFIL */
    perfil: `
        <div class="tab-grid-layout">
            <div style="text-align:center; padding:10px 0;">
                <div class="doc-avatar-circle" aria-hidden="true">👤</div>
                <h3 style="font-size:1.15rem; color:var(--text-dark); margin-bottom:4px;">Bryan Jeronimo Pardo</h3>
                <p style="color:var(--steel); font-size:0.85rem;">ID Paciente: #MC-14223</p>
            </div>
            <div class="modal-info-block">
                <p><strong>Fecha de registro:</strong> 12 de enero de 2026</p>
                <p><strong>Correo:</strong> bryan.pardo@correo.com</p>
                <p><strong>Teléfono:</strong> 646-000-0000</p>
                <p><strong>Plan:</strong> Mens Cura Plus</p>
                <p><strong>Seguro médico:</strong> IMSS Activo</p>
                <p><strong>Idioma preferido:</strong> Español (México)</p>
            </div>
            <button class="btn-submit-tab" onclick="cerrarPestana('Redirigiendo a edición de perfil...')">✏️ Editar perfil</button>
        </div>`,

    /*CONFIGURACIÓN Y ACCESIBILIDAD */
    config: buildConfigTemplate,
};

function buildConfigTemplate() {
    return `
    <div class="tab-grid-layout">

        <!-- Sección: Notificaciones -->
        <p class="config-section-title">Notificaciones</p>
        <div style="background:var(--cream); border:1px solid var(--frost); border-radius:16px; padding:14px; display:flex; flex-direction:column;">
            ${[
                ["notif-correo", "Recordatorios por correo electrónico", "Recibe confirmaciones y alertas de citas", true],
                ["notif-sms", "Notificaciones SMS de citas", "Avisos por mensaje de texto antes de cada sesión", true],
                ["notif-progreso", "Compartir progreso anónimo para investigación", "Contribuye a mejorar la plataforma de forma anónima", false],
                ["notif-confidencial", "Modo confidencial en capturas de pantalla", "Oculta contenido sensible en capturas del dispositivo", true],
            ].map(([id, label, desc, checked]) => `
            <div class="acc-toggle-row">
                <label class="acc-toggle-label" for="${id}">
                    ${label}
                    <small>${desc}</small>
                </label>
                <label class="toggle-switch" aria-label="${label}">
                    <input type="checkbox" id="${id}" ${checked ? "checked" : ""}>
                    <span class="toggle-track"></span>
                </label>
            </div>`).join('')}
        </div>

        <!-- Sección: Tema de color -->
        <p class="config-section-title"> Tema de color</p>
        <div class="acc-grid" role="group" aria-label="Seleccionar tema de color">
            <button class="acc-option-btn ${acc.tema === 'normal' ? 'selected' : ''}"
                onclick="cambiarTema('normal')" aria-pressed="${acc.tema === 'normal'}">
                <span class="acc-icon">☀️</span> Normal
            </button>
            <button class="acc-option-btn ${acc.tema === 'oscuro' ? 'selected' : ''}"
                onclick="cambiarTema('oscuro')" aria-pressed="${acc.tema === 'oscuro'}">
                <span class="acc-icon">🌙</span> Modo oscuro
            </button>
            <button class="acc-option-btn ${acc.tema === 'alto-contraste' ? 'selected' : ''}"
                onclick="cambiarTema('alto-contraste')" aria-pressed="${acc.tema === 'alto-contraste'}">
                <span class="acc-icon">◑</span> Alto contraste
            </button>
            <button class="acc-option-btn ${acc.tema === 'daltonismo' ? 'selected' : ''}"
                onclick="cambiarTema('daltonismo')" aria-pressed="${acc.tema === 'daltonismo'}">
                <span class="acc-icon">👁️</span> Para daltonismo
            </button>
        </div>

        <!-- Sección: Tamaño de texto -->
        <p class="config-section-title"> Tamaño de texto</p>
        <div style="background:var(--cream); border:1px solid var(--frost); border-radius:16px; padding:14px;">
            <div class="acc-toggle-row" style="border-bottom:none;">
                <label class="acc-toggle-label" for="tog-texto-grande">
                    Texto grande
                    <small>Aumenta el tamaño de fuente en un 20% en toda la aplicación</small>
                </label>
                <label class="toggle-switch" aria-label="Activar texto grande">
                    <input type="checkbox" id="tog-texto-grande" ${acc.textoGrande ? "checked" : ""} onchange="toggleTextoGrande(this.checked)">
                    <span class="toggle-track"></span>
                </label>
            </div>
        </div>

        <!-- Sección: Movimiento -->
        <p class="config-section-title"> Movimiento y animaciones</p>
        <div style="background:var(--cream); border:1px solid var(--frost); border-radius:16px; padding:14px;">
            <div class="acc-toggle-row" style="border-bottom:none;">
                <label class="acc-toggle-label" for="tog-sin-anim">
                    Reducir animaciones
                    <small>Desactiva transiciones y carruseles automáticos. Recomendado para epilepsia fotosensible.</small>
                </label>
                <label class="toggle-switch" aria-label="Reducir animaciones">
                    <input type="checkbox" id="tog-sin-anim" ${acc.sinAnimaciones ? "checked" : ""} onchange="toggleAnimaciones(this.checked)">
                    <span class="toggle-track"></span>
                </label>
            </div>
        </div>

        <!-- Sección: Idioma -->
        <p class="config-section-title">🌐 Idioma del sistema</p>
        <div class="tab-input-group">
            <label for="cfg-idioma">Idioma</label>
            <select id="cfg-idioma">
                <option>Español (México)</option>
                <option>Español (España)</option>
                <option>English (US)</option>
            </select>
        </div>

        <button class="btn-submit-tab" onclick="cerrarPestana('Preferencias guardadas correctamente.')">💾 Guardar configuración</button>
    </div>`;
}

// FUNCIONES DE ACCESIBILIDAD (llamadas desde el modal)

window.cambiarTema = function (nuevoTema) {
    acc.tema = nuevoTema;
    aplicarTema();
    // Refrescar el modal de config para reflejar el estado
    miniTabBody.innerHTML = buildConfigTemplate();
    mostrarToast(`Tema cambiado a: ${nuevoTema}`);
};

window.toggleTextoGrande = function (activo) {
    acc.textoGrande = activo;
    aplicarTema();
};

window.toggleAnimaciones = function (activo) {
    acc.sinAnimaciones = activo;
    aplicarTema();
};

// SISTEMA DE MODALES

let focusAntes = null;

function abrirPestana(titulo, llave) {
    focusAntes = document.activeElement;

    miniTabTitle.textContent = titulo;

    const template = tabTemplates[llave];
    if (typeof template === "function") {
        miniTabBody.innerHTML = template();
    } else if (typeof template === "string") {
        miniTabBody.innerHTML = template;
    } else {
        miniTabBody.innerHTML = `<p style="color:var(--text-mid);">Módulo en actualización. Intenta más tarde.</p>`;
    }

    miniTab.classList.add("open");

    // Mover foco al primer elemento interactivo dentro del modal
    requestAnimationFrame(() => {
        const primero = miniTab.querySelector("button, input, select, textarea, [tabindex]");
        if (primero) primero.focus();
    });
}

window.cerrarPestana = function (mensaje = "") {
    if (mensaje) mostrarToast(mensaje);
    miniTab.classList.remove("open");
    // Restaurar foco al elemento que abrió el modal
    if (focusAntes) focusAntes.focus();
};

// Cerrar con tecla Escape
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && miniTab.classList.contains("open")) {
        cerrarPestana();
    }
});

// Trampa de foco dentro del modal (accesibilidad teclado)
miniTab.addEventListener("keydown", (e) => {
    if (e.key !== "Tab") return;
    const focusables = miniTab.querySelectorAll(
        'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    const primero = focusables[0];
    const ultimo  = focusables[focusables.length - 1];

    if (e.shiftKey) {
        if (document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
    } else {
        if (document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
    }
});

// Cerrar haciendo clic en el fondo
miniTab.addEventListener("click", (e) => {
    if (e.target === miniTab) cerrarPestana();
});

// Botones de la barra lateral
document.querySelectorAll(".sidebar-btn[data-target]").forEach(btn => {
    btn.addEventListener("click", () => {
        const target = btn.getAttribute("data-target");
        const label  = btn.querySelector("span:not(.btn-icon)")?.textContent.trim() || btn.textContent.trim();
        abrirPestana(label, target);
    });
});

document.getElementById("btn-perfil").addEventListener("click", () => abrirPestana("Mi Perfil", "perfil"));
document.getElementById("btn-config").addEventListener("click", () => abrirPestana("Configuración y Accesibilidad", "config"));
document.getElementById("quick-diary-btn").addEventListener("click", () => abrirPestana("Diario de Ánimo", "diario"));
closeTabBtn.addEventListener("click", () => cerrarPestana());

// Perfil del especialista
window.abrirPerfilMedico = function (nombre, esp, tel, correo, exp) {
    abrirPestana("Perfil del Especialista", null);
    miniTabBody.innerHTML = `
        <div class="tab-grid-layout">
            <div style="text-align:center; padding:8px 0;">
                <div class="doc-avatar-circle" aria-hidden="true">🩺</div>
                <h3 style="font-size:1.1rem; color:var(--text-dark); margin-bottom:4px;">${nombre}</h3>
                <p style="color:var(--steel); font-size:0.85rem; font-weight:600;">${esp}</p>
            </div>
            <div class="modal-info-block">
                <p><strong>Experiencia:</strong> ${exp}</p>
                <p><strong>Teléfono:</strong> ${tel}</p>
                <p><strong>Correo:</strong> ${correo}</p>
                <p><strong>Modalidad:</strong> Presencial y Virtual</p>
                <p><strong>Idiomas:</strong> Español, Inglés</p>
                <p><strong>Calificación:</strong> ⭐ 4.9 / 5.0</p>
            </div>
            <button class="btn-submit-tab" onclick="cerrarPestana('Redirigiendo al módulo de agendado...')">📅 Agendar cita con este especialista</button>
        </div>`;
};

// TOAST NOTIFICATIONS
window.mostrarToast = function (mensaje) {
    const container = document.getElementById("toast-container");
    const toast = document.createElement("div");
    toast.className = "toast-msg";
    toast.textContent = mensaje;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = "0";
        setTimeout(() => toast.remove(), 420);
    }, 2600);
};

// API DE NOTICIAS DE PSICOLOGÍA
(function cargarNoticias() {
    const API_KEY  = "e35c2f1850b042e0a1e057fd034f1b9b";
    const query    = encodeURIComponent("salud mental OR psicología OR bienestar emocional");
    const newsUrl  = `https://newsapi.org/v2/everything?q=${query}&language=es&pageSize=12&sortBy=publishedAt&apiKey=${API_KEY}`;

    fetch(newsUrl)
        .then(r => r.json())
        .then(data => {
            const filtered = (data.articles || []).filter(a => a.title && a.urlToImage);
            if (!filtered.length) { cargarRespaldoEstatico(); return; }
            renderizarNoticias(filtered.slice(0, 3));
        })
        .catch(cargarRespaldoEstatico);
})();

function renderizarNoticias(articulos) {
    const container = document.getElementById("news-container");
    container.innerHTML = "";
    articulos.forEach((article, idx) => {
        const link = document.createElement("a");
        link.href   = article.url;
        link.target = "_blank";
        link.rel    = "noopener noreferrer";
        link.classList.add("slide-item");
        link.setAttribute("aria-label", `Noticia ${idx + 1}: ${article.title}`);
        link.innerHTML = `
            <img src="${article.urlToImage}"
                 alt=""
                 onerror="this.src='https://images.unsplash.com/photo-1590650153855-d9e808231d41?w=400'">
            <div class="info-noticias">
                <h3>${article.title.substring(0, 85)}…</h3>
                <p>${new Date(article.publishedAt).toLocaleDateString('es-MX', { day:'numeric', month:'long', year:'numeric' })}</p>
            </div>`;
        container.appendChild(link);
    });
}

function cargarRespaldoEstatico() {
    renderizarNoticias([
        {
            url: "#",
            urlToImage: "https://images.unsplash.com/photo-1590650153855-d9e808231d41?w=400",
            title: "La terapia cognitivo-conductual sigue siendo el tratamiento más eficaz para la ansiedad generalizada",
            publishedAt: "2026-05-20"
        },
        {
            url: "#",
            urlToImage: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=400",
            title: "¿Qué significa despedirse de tu mascota antes de salir, según la psicología moderna?",
            publishedAt: "2026-05-19"
        },
        {
            url: "#",
            urlToImage: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400",
            title: "Nuevas investigaciones vinculan el sueño reparador con la reducción del estrés crónico",
            publishedAt: "2026-05-18"
        },
    ]);
}

// GEOLOCALIZACIÓN
document.getElementById("find-me").addEventListener("click", () => {
    const status   = document.getElementById("status");
    const mapFrame = document.getElementById("google-map");

    if (!navigator.geolocation) {
        status.textContent = "Geolocalización no compatible en este dispositivo.";
        return;
    }

    status.textContent = "Buscando coordenadas…";

    navigator.geolocation.getCurrentPosition(
        ({ coords: { latitude: lat, longitude: lng } }) => {
            status.textContent = "Ubicación encontrada ✓";
            mapFrame.src = `https://maps.google.com/maps?q=psicologos+y+psiquiatras&ll=${lat},${lng}&t=&z=14&ie=UTF-8&iwloc=&output=embed`;
        },
        (err) => {
            const msgs = {
                1: "Permiso de ubicación denegado.",
                2: "Ubicación no disponible. Usando mapa regional.",
                3: "Tiempo de espera agotado.",
            };
            status.textContent = msgs[err.code] || "Error al obtener la ubicación.";
        },
        { timeout: 10000, maximumAge: 60000 }
    );
});

// DIARIO MINI
const ideasDiario = [
    "Escribe sobre una persona que te haga sentir gratitud hoy.",
    "¿Qué pequeño logro alcanzaste esta semana que te genera paz interna?",
    "Describe un lugar seguro que te reconforte en momentos difíciles.",
    "Anota tres cosas sencillas por las que estés agradecido hoy.",
    "¿Qué aprendiste sobre ti mismo durante esta semana?",
    "¿Hubo un momento de alegría genuina hoy? Descríbelo con detalle.",
    "¿Qué actividad te hizo sentir presente y conectado hoy?",
];

let indexIdea = 0;

window.rotarFraseMotivacional = function () {
    indexIdea = (indexIdea + 1) % ideasDiario.length;
    const el = document.getElementById("mood-prompt-text");
    if (el) el.textContent = ideasDiario[indexIdea];
};

// FECHA
window.addEventListener("DOMContentLoaded", () => {
    const el = document.getElementById("live-date");
    if (el) {
        const opciones = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
        el.textContent = new Date().toLocaleDateString('es-MX', opciones);
    }
    cargarPreferencias();
});