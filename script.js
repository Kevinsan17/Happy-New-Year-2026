/* =========================================
   1. CONFIGURACIÓN GENERAL
   ========================================= */
const TARGET_DATE_STRING = "2026-01-01T00:00:00+02:00";
const DEBUG_MODE = false; // CAMBIAR A 'false' PARA VERSIÓN FINAL

/* =========================================
   2. DATOS: LOS 12 DESEOS
   ========================================= */
const wishes = [
    "I wish we start this year choosing each other every day, even when the distance feels heavy.",
    "I wish our love feels safe, patient, and full of small gestures that remind us we are not alone.",
    "I wish we keep discovering new parts of each other, learning deeply who we are, and falling in love again with who we are becoming.",
    "I wish we laugh more than we worry, finding joy in our silly moments, and letting laughter bring us closer even on hard days.",
    "I wish I can be your safe place when the world feels too heavy, and that you always feel safe being yourself with me.",
    "I wish we keep dreaming about the day distance becomes just a memory and not a barrier.",
    "I wish we create memories even through the distance, and that they feel just as real, close and warm.",
    "I wish we learn to communicate better, with kindness, patience, and the courage to be vulnerable.",
    "I wish we grow as individuals while being a safe place for each other, choosing to grow together without fear.",
    "I wish we face every difficulty as a team, choosing understanding, patience, and love even when things feel hard.",
    "I wish we never forget how grateful we are for each other and for the love we share.",
    "I wish we look back at this year and feel proud of how we loved, how we laughed, how we learned from each other, and how we chose to stay."
];

/* =========================================
   3. ESTADO Y DOM
   ========================================= */
let currentWishIndex = 0;
let isAnimating = false;

// Secciones
const lockScreen = document.getElementById('lock-screen');
const newYearSection = document.getElementById('newyear-section');
const mapSection = document.getElementById('map-section');
const letterSection = document.getElementById('letter-section');

// Botones y Elementos
const unlockBtn = document.getElementById('enter-btn');
const goToMapBtn = document.getElementById('go-to-map-btn');
const backToLockBtn = document.getElementById('back-to-lock-btn'); // Botón inicio en NY
const backToNYBtn = document.getElementById('back-to-ny-btn'); // Botón atras en Mapa

/* =========================================
   4. LOGICA DEL CONTADOR
   ========================================= */
const els = {
    d: document.getElementById('days'), h: document.getElementById('hours'),
    m: document.getElementById('minutes'), s: document.getElementById('seconds')
};

function updateTimer() {
    const now = new Date().getTime();
    const target = new Date(TARGET_DATE_STRING).getTime();
    const distance = target - now;

    if (DEBUG_MODE || distance < 0) {
        clearInterval(timerInterval);
        unlockBtn.classList.remove('hidden');
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    els.d.innerText = String(days).padStart(2, '0');
    els.h.innerText = String(hours).padStart(2, '0');
    els.m.innerText = String(minutes).padStart(2, '0');
    els.s.innerText = String(seconds).padStart(2, '0');
}
const timerInterval = setInterval(updateTimer, 1000);
updateTimer();

/* =========================================
   5. NAVEGACIÓN Y SECUENCIA
   ========================================= */

// PASO 1: DE BLOQUEO A AÑO NUEVO (INICIO DE ANIMACIÓN)
unlockBtn.addEventListener('click', () => {
    lockScreen.style.opacity = '0';
    setTimeout(() => {
        lockScreen.style.display = 'none';
        newYearSection.classList.remove('hidden-section');
        // Iniciar fuegos artificiales y globo
        initFireworks();
        setTimeout(startNewYearSequence, 500);
    }, 1000);
});

// PASO 2: ANIMACIÓN DEL GLOBO
function startNewYearSequence() {
    const balloonActor = document.getElementById('balloon-actor');
    const digit5 = document.getElementById('digit-5');
    const digit6Final = document.getElementById('digit-6-final');
    const digit6Traveler = document.getElementById('digit-6-traveler');
    const headerText = document.getElementById('header-text');
    const subText = document.getElementById('sub-text');

    // 1. Entra Globo
    balloonActor.classList.remove('hidden');
    balloonActor.classList.add('animate-enter-right');

    // 2. Intercambio (2.5s)
    setTimeout(() => {
        digit6Final.classList.remove('hidden');
        digit6Traveler.style.opacity = '0';
        balloonActor.classList.remove('animate-enter-right');
        balloonActor.classList.add('animate-grab-5');
    }, 2500);

    // 3. Subida (3.5s)
    setTimeout(() => {
        balloonActor.classList.remove('animate-grab-5');
        balloonActor.classList.add('animate-fly-up');
        digit5.classList.add('kidnapped-5');
    }, 3500);

    // 4. Final y Botón Siguiente (4.5s)
    setTimeout(() => {
        digit5.style.opacity = '0';
        digit6Final.classList.add('slide-into-place');
        headerText.classList.add('show-text-final');
        subText.classList.add('show-text-final');

        // MOSTRAR BOTÓN PARA IR AL MAPA
        goToMapBtn.classList.remove('hidden');
        setTimeout(() => { goToMapBtn.style.opacity = '1'; }, 100);
    }, 4500);
}

// PASO 3: DE AÑO NUEVO A MAPA
goToMapBtn.addEventListener('click', () => {
    newYearSection.classList.add('hidden-section');
    mapSection.classList.remove('hidden-section');

    // Apagamos fuegos artificiales, encendemos estrellas
    const fireworksCanvas = document.getElementById('fireworksCanvas');
    fireworksCanvas.classList.add('hidden');
    initStarfield();
    showWish(0);
});

// BOTÓN: ATRÁS (DEL MAPA A AÑO NUEVO)
backToNYBtn.addEventListener('click', () => {
    mapSection.classList.add('hidden-section');
    newYearSection.classList.remove('hidden-section');
    // Reactivar fuegos artificiales
    const fireworksCanvas = document.getElementById('fireworksCanvas');
    fireworksCanvas.classList.remove('hidden');
});

// BOTÓN: INICIO (DE AÑO NUEVO A BLOQUEO - RECARGAR)
backToLockBtn.addEventListener('click', () => {
    window.location.reload();
});

/* =========================================
   6. LÓGICA DE TARJETAS Y ANIMACIÓN DE AVIÓN (MEJORADA)
   ========================================= */
const wishTextEl = document.getElementById('wish-text');
const wishCounterEl = document.getElementById('wish-counter');
const nextWishBtn = document.getElementById('next-wish-btn');
const goToLetterBtn = document.getElementById('go-to-letter-btn');
const cardEl = document.getElementById('current-wish-card');
const planeGroup = document.getElementById('paper-plane-group');

// Variable para controlar si estamos escribiendo
let isTypingWish = false;

function showWish(index) {
    // 1. SI YA PASAMOS EL ÚLTIMO DESEO (Iteración 13) -> MOSTRAR BOTÓN CARTA
    if (index >= wishes.length) {
        wishCounterEl.textContent = "Wishes Sent"; // Opcional: Mensaje final
        wishTextEl.innerHTML = "All my wishes are now with you ✨"; // Mensaje final en la tarjeta

        // Ocultar botón de enviar y mostrar el de la carta
        nextWishBtn.classList.add('hidden');
        goToLetterBtn.classList.remove('hidden');
        return;
    }

    // 2. ESTADO NORMAL: MOSTRAR DESEO
    // Aseguramos que se vea el botón de enviar (incluso en el último deseo)
    nextWishBtn.classList.remove('hidden');
    goToLetterBtn.classList.add('hidden');

    wishCounterEl.textContent = `Wish ${index + 1} of ${wishes.length}`;

    // Animación de entrada de la tarjeta
    cardEl.classList.remove('card-enter');
    void cardEl.offsetWidth; // Reiniciar animación
    cardEl.classList.add('card-enter');

    // INICIAR EFECTO DE ESCRITURA
    typeWish(wishes[index]);
}

// FUNCIÓN PARA ESCRIBIR EL DESEO LETRA POR LETRA
function typeWish(text) {
    isTypingWish = true;
    wishTextEl.innerHTML = ""; // Limpiar texto anterior
    wishTextEl.classList.add('typing-cursor'); // Poner cursor |

    // Desactivar botón mientras escribe para que no se salten
    nextWishBtn.disabled = true;
    nextWishBtn.style.opacity = "0.5";
    nextWishBtn.style.cursor = "wait";

    let charIndex = 0;

    function typeChar() {
        if (charIndex < text.length) {
            wishTextEl.innerHTML += text.charAt(charIndex);
            charIndex++;
            // Velocidad de escritura (ajusta el 50 para más rápido o lento)
            setTimeout(typeChar, 50);
        } else {
            // TERMINÓ DE ESCRIBIR
            isTypingWish = false;
            wishTextEl.classList.remove('typing-cursor'); // Quitar cursor

            // Reactivar botón
            nextWishBtn.disabled = false;
            nextWishBtn.style.opacity = "1";
            nextWishBtn.style.cursor = "pointer";
        }
    }
    typeChar();
}

// BOTÓN ENVIAR SIGUIENTE DESEO
nextWishBtn.addEventListener('click', () => {
    // Bloqueo de seguridad
    if (isAnimating || isTypingWish) return;

    isAnimating = true;
    nextWishBtn.disabled = true;

    // 1. ANIMACIÓN DEL AVIÓN
    planeGroup.classList.remove('plane-flying');
    void planeGroup.offsetWidth;
    planeGroup.classList.add('plane-flying');

    // 2. CAMBIO DE ÍNDICE Y CARGA DEL SIGUIENTE
    // Esperamos a que el avión vuele un poco (1.5s)
    setTimeout(() => {
        currentWishIndex++;
        showWish(currentWishIndex);
    }, 1500);

    // 3. REACTIVAR INTERFAZ
    // Esperamos a que termine la animación del avión (2.1s)
    setTimeout(() => {
        isAnimating = false;
        // Solo reactivamos el botón si NO se está escribiendo (typeWish lo controla)
        // Y si aún no hemos llegado al final
        if (currentWishIndex < wishes.length) {
            // El botón se habilitará solo cuando typeWish termine
        }
        planeGroup.classList.remove('plane-flying');
    }, 2100);
});

/* =========================================
   7. CARTA FINAL
   ========================================= */
const typewriterElement = document.getElementById('typewriter-text');
const finalMessage = "Hi baby,\n" +
    "As we start a new year together, I just wanted to take a moment to tell you something that comes straight from my heart.\n\n" +

    "Thank you for coming into my life. " +
    "You truly make me smile and laugh in ways I didn’t even know I needed.\n" +
    "Thank you for your understanding, for being my biggest supporter, and for genuinely caring about me. " +
    "I appreciate you more than I can fully put into words.\n\n" +

    "Looking back at 2025, I’m really grateful for everything we lived together — the good moments, the hard ones, the lessons, and the growth. None of it was perfect, but it was real, and it meant a lot to me. Thank you for staying, for trying, and for sharing this part of our journey with me.\n\n" +

    "As we step into 2026, I don’t expect everything to be easy. What I do hope is that we keep choosing each other, learning together, and growing stronger as a team. I believe in us, in what we’re building, and in the love we’re nurturing, even across the distance.\n\n" +

    "These wishes come from my heart, and they’re all for us.\n" +
    "Thank you for being you, and for letting me be myself with you."

let hasTyped = false;

goToLetterBtn.addEventListener('click', () => {
    mapSection.classList.add('hidden-section');
    letterSection.classList.remove('hidden-section');
    if (!hasTyped) {
        hasTyped = true;
        setTimeout(() => { typeWriter(finalMessage, 0); typewriterElement.classList.add('typewriter-cursor'); }, 500);
    }
});

const backToMapBtn = document.getElementById('back-to-map-btn');
backToMapBtn.addEventListener('click', () => {
    letterSection.classList.add('hidden-section');
    mapSection.classList.remove('hidden-section');
});

// 1. Agrega esta línea para seleccionar la firma (puedes ponerla justo antes de la función)
const signatureEl = document.querySelector('.final-signature');

function typeWriter(text, i) {
    if (i < text.length) {
        if (text.charAt(i) === '\n') {
            typewriterElement.innerHTML += '<br>';
        } else {
            typewriterElement.innerHTML += text.charAt(i);
        }
        setTimeout(() => typeWriter(text, i + 1), 70);
    } else {
        // --- AQUÍ OCURRE LA MAGIA CUANDO TERMINA DE ESCRIBIR ---
        setTimeout(() => {
            // 1. Quita el cursor parpadeante
            typewriterElement.classList.remove('typewriter-cursor');

            // 2. Muestra la firma suavemente
            signatureEl.classList.add('reveal-signature');

        }, 1000); // Espera 1 segundo después de terminar la carta para mostrar la firma
    }
}

/* =========================================
   8. EFECTOS VISUALES (ESTRELLAS Y FUEGOS)
   ========================================= */
// --- ESTRELLAS ---
const starCanvas = document.getElementById('star-canvas');
const sCtx = starCanvas.getContext('2d');
let stars = []; let sW, sH;

function initStarfield() {
    sW = window.innerWidth; sH = window.innerHeight;
    starCanvas.width = sW; starCanvas.height = sH;
    stars = [];
    const numStars = Math.floor((sW * sH) / 4000);
    for (let i = 0; i < numStars; i++) {
        stars.push({ x: Math.random() * sW, y: Math.random() * sH, radius: Math.random() * 1.5, alpha: Math.random(), speed: Math.random() * 0.05 });
    }
}
function animateStars() {
    sCtx.clearRect(0, 0, sW, sH);
    stars.forEach(star => {
        sCtx.beginPath(); sCtx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        sCtx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`; sCtx.fill();
        star.alpha += (Math.random() - 0.5) * 0.05;
        if (star.alpha < 0.1) star.alpha = 0.1; if (star.alpha > 1) star.alpha = 1;
        star.y -= star.speed; if (star.y < 0) star.y = sH;
    });
    requestAnimationFrame(animateStars);
}

// --- FUEGOS ARTIFICIALES ---
function initFireworks() {
    const fCanvas = document.getElementById('fireworksCanvas');
    fCanvas.classList.remove('hidden');
    const fCtx = fCanvas.getContext('2d');
    fCanvas.width = window.innerWidth; fCanvas.height = window.innerHeight;
    let particles = [];

    class Particle {
        constructor(x, y, color, vX, vY, size, decay) {
            this.x = x; this.y = y; this.color = color; this.vX = vX; this.vY = vY; this.size = size; this.decay = decay; this.alpha = 1;
        }
        draw() {
            fCtx.save(); fCtx.globalAlpha = this.alpha; fCtx.beginPath();
            fCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2); fCtx.fillStyle = this.color; fCtx.fill(); fCtx.restore();
        }
        update() {
            this.vX *= 0.96; this.vY += 0.05; this.x += this.vX; this.y += this.vY; this.alpha -= this.decay;
        }
    }

    function createExplosion(x, y, color) {
        for (let i = 0; i < 50; i++) {
            const angle = Math.random() * Math.PI * 2; const speed = Math.random() * 5 + 2;
            particles.push(new Particle(x, y, color, Math.cos(angle) * speed, Math.sin(angle) * speed, Math.random() * 3, 0.015));
        }
    }

    function animateF() {
        fCtx.fillStyle = 'rgba(10, 10, 21, 0.2)'; fCtx.fillRect(0, 0, fCanvas.width, fCanvas.height);
        if (Math.random() < 0.03) { // Lanzar cohete
            const sX = Math.random() * fCanvas.width; const sY = fCanvas.height;
            const tX = (fCanvas.width / 2) + (Math.random() - 0.5) * (fCanvas.width * 0.8);
            const tY = (fCanvas.height / 3) + (Math.random() - 0.5) * (fCanvas.height * 0.5);
            const angle = Math.atan2(tY - sY, tX - sX); const v = Math.random() * 3 + 12;
            particles.push(new Particle(sX, sY, `hsl(${Math.random() * 360}, 50%, 50%)`, Math.cos(angle) * v, Math.sin(angle) * v, 3, 0));
        }
        particles.forEach((p, i) => {
            if (p.alpha <= 0) particles.splice(i, 1);
            else {
                p.update(); p.draw();
                if (p.decay === 0 && (p.vY >= -1.5 || p.y < 50)) { createExplosion(p.x, p.y, p.color); p.alpha = 0; }
            }
        });
        requestAnimationFrame(animateF);
    }
    animateF();

}


