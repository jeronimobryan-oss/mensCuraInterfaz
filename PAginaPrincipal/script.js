// =====================================
// API DE NOTICIAS
// =====================================

const API_KEY = "e35c2f1850b042e0a1e057fd034f1b9b";

const query = encodeURIComponent(
    "salud mental OR psicología OR trastornos mentales"
);

const url =
`https://newsapi.org/v2/everything?q=${query}&language=es&pageSize=10&sortBy=publishedAt&apiKey=${API_KEY}`;

fetch(url)

.then(res => res.json())

.then(data => {

    const container =
        document.getElementById("news-container");

    container.innerHTML = "";

    if (!data.articles || data.articles.length === 0) {

        container.innerHTML =
            "<p style='color:white;'>No hay noticias disponibles</p>";

        return;
    }

    // FILTRAR ARTÍCULOS
    const filteredArticles = data.articles.filter(article =>
        article.title &&
        /salud|mental|psicolog/i.test(article.title)
    );

    if (filteredArticles.length === 0) {

        container.innerHTML =
            "<p style='color:white;'>No hay noticias disponibles</p>";

        return;
    }

    // MOSTRAR SOLO 3 ARTÍCULOS
    filteredArticles.slice(0, 3).forEach(article => {

        const link = document.createElement("a");

        link.href = article.url;
        link.target = "_blank";
        link.classList.add("slide-item");

        const image = article.urlToImage
            ? article.urlToImage
            : "https://source.unsplash.com/600x400/?psychology";

        const date = article.publishedAt
            ? new Date(article.publishedAt)
                .toLocaleDateString()
            : "";

        link.innerHTML = `
            <img src="${image}">
            <div class="info-noticias">
                <h4>${article.title}</h4>
                <p>${date}</p>
            </div>
        `;

        container.appendChild(link);
    });
})

.catch(err => {

    console.error("ERROR:", err);

    document.getElementById("news-container").innerHTML =
        "<p style='color:white;'>No hay noticias disponibles</p>";
});


// =====================================
// GEOLOCALIZACIÓN
// =====================================

function encontrarUbicacion() {

    const status =
        document.querySelector("#status");

    const mapFrame =
        document.querySelector("#google-map");

    // ÉXITO
    function success(position) {

        const latitude =
            position.coords.latitude;

        const longitude =
            position.coords.longitude;

        console.log("LAT:", latitude);
        console.log("LNG:", longitude);

        status.textContent =
            `Ubicación encontrada`;

        // UBICACIÓN EXACTA DEL USUARIO
        mapFrame.src =
        `https://maps.google.com/maps?q=${latitude},${longitude}&hl=es&z=14&output=embed`;
    }

    // ERROR
    function error(err) {

        console.error(err);

        status.textContent =
            "No se pudo obtener tu ubicación";
    }

    // VERIFICAR SOPORTE
    if (!navigator.geolocation) {

        status.textContent =
            "La geolocalización no es compatible";

        return;
    }

    status.textContent =
        "Obteniendo ubicación...";

    navigator.geolocation.getCurrentPosition(
        success,
        error,
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }
    );
}


// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// DIBUJO EN CANVAS
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

function dibujoDelDia() {
    const canvas = document.getElementById('mood-canvas');
    const ctx = canvas.getContext('2d');
    const colorPicker = document.getElementById('brush-color');
    const sizeSlider = document.getElementById('brush-size');
    const sizeDisplay = document.getElementById('size-display');
    const btnDraw = document.getElementById('btn-draw');
    const btnErase = document.getElementById('btn-erase');
    const btnClear = document.getElementById('btn-clear');
    const btnDownload = document.getElementById('btn-download');

    let drawing = false;
    let mode = 'draw';
    let lastX = 0, lastY = 0;

    function setupCanvas() {
        const rect = canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
    }

    function getPosition(e) {
        const rect = canvas.getBoundingClientRect();
        if (e.touches) {
            return {
                x: e.touches[0].clientX - rect.left,
                y: e.touches[0].clientY - rect.top
            };
        }
        return {
            x: e.clientX - rect.left, y: e.clientY - rect.top
        };
    }

    function startDraw(e) {
        e.preventDefault();
        drawing = true;
        const pos = getPosition(e);
        lastX = pos.x;
        lastY = pos.y;
        ctx.beginPath();
        ctx.arc(lastX, lastY, (parseInt(sizeSlider.value) / 2), 0, Math.PI * 2);
        ctx.fillStyle = mode === 'erase' ? '#fafbfc' : colorPicker.value;
        ctx.fill();
    }

    function draw(e) {
        if (!drawing) return;
        e.preventDefault();
        const pos = getPosition(e);
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(pos.x, pos.y);
        ctx.strokeStyle = mode === 'erase' ? '#fafbfc' : colorPicker.value;
        ctx.lineWidth = parseInt(sizeSlider.value);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
        lastX = pos.x;
        lastY = pos.y;
    }

    function stopDraw() {
        drawing = false;
    }

    // Eventos del mouse
    canvas.addEventListener('mousedown', startDraw);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDraw);
    canvas.addEventListener('mouseleave', stopDraw);

    // Eventos táctiles
    canvas.addEventListener('touchstart', startDraw, { passive: false });
    canvas.addEventListener('touchmove', draw, { passive: false });
    canvas.addEventListener('touchend', stopDraw);

    // Controles
    sizeSlider.addEventListener('input', () => {
        sizeDisplay.textContent = sizeSlider.value + 'px';
    });

    btnDraw.addEventListener('click', () => {
        mode = 'draw';
        canvas.style.cursor = 'crosshair';
        btnDraw.classList.add('active');
        btnErase.classList.remove('active');
    });

    btnErase.addEventListener('click', () => {
        mode = 'erase';
        canvas.style.cursor = 'cell';
        btnErase.classList.add('active');
        btnDraw.classList.remove('active');
    });

    btnClear.addEventListener('click', () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    btnDownload.addEventListener('click', () => {
        const date = new Date();
        const offscreen = document.createElement('canvas');
        offscreen.width = canvas.width;
        offscreen.height = canvas.height;
        const offCtx = offscreen.getContext('2d');
        offCtx.fillStyle = '#ffffff';
        offCtx.fillRect(0, 0, offscreen.width, offscreen.height);
        offCtx.drawImage(canvas, 0, 0);

        const link = document.createElement('a');
        link.download = `mi-dia-menscura-${date.toISOString().slice(0,10)}.png`;
        link.href = offscreen.toDataURL('image/png');
        link.click();
    });

    document.querySelectorAll('.mode-btn[data-mode]').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.mode-btn[data-mode]').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            mode = btn.dataset.mode;
            canvas.style.cursor = mode === 'erase' ? 'cell' : 'crosshair';
        });
    });

    setupCanvas();
    window.addEventListener('resize', setupCanvas);
}

// BOTÓN GEOLOCALIZACIÓN
document
    .querySelector("#find-me")
    .addEventListener("click", encontrarUbicacion);

dibujoDelDia();