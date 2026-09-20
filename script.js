/* =========================================================
   MADZIA BIRTHDAY
   MASTER JAVASCRIPT
========================================================= */


/* =========================================================
   CONFIGURATION
========================================================= */

// IMPORTANT:
// Replace the text below with the actual shirt colour.
// Example:
// const SECRET_ANSWER = "black";

const SECRET_ANSWER = "BLACK";


/* =========================================================
   GLOBAL ELEMENTS
========================================================= */

const sky = document.getElementById("sky");
const starsContainer = document.getElementById("stars");
const shootingStarsContainer =
    document.getElementById("shootingStars");
const sparklesContainer =
    document.getElementById("sparkles");
const heartTrailContainer =
    document.getElementById("heartTrail");

const bgMusic = document.getElementById("bgMusic");
const musicToggle =
    document.getElementById("musicToggle");

let musicStarted = false;
let musicPlaying = false;

let candlesBlown = false;

let audioContext = null;
let analyser = null;
let microphone = null;
let microphoneStream = null;
let microphoneRunning = false;

let pointerDown = false;
let lastTrailTime = 0;

let wishesCompleted = 0;

let shootingStarTimer = null;
let sparkleTimer = null;


/* =========================================================
   INITIAL SETUP
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    createStars();

    startAmbientEffects();

    setupSkyInteractions();

    setupCakeInteraction();

    updateMusicButton();

});


/* =========================================================
   STAR FIELD
========================================================= */

function createStars() {

    if (!starsContainer) {
        return;
    }

    starsContainer.innerHTML = "";

    const starCount = 125;

    for (let i = 0; i < starCount; i++) {

        const star = document.createElement("span");

        star.classList.add("star");

        const sizeType = Math.random();

        if (sizeType < 0.2) {
            star.classList.add("small");
        }
        else if (sizeType > 0.88) {
            star.classList.add("big");
        }

        star.style.left =
            Math.random() * 100 + "%";

        star.style.top =
            Math.random() * 100 + "%";

        star.style.animationDelay =
            Math.random() * 5 + "s";

        star.style.animationDuration =
            2.5 + Math.random() * 4 + "s";

        starsContainer.appendChild(star);
    }
}


/* =========================================================
   STAR REACTION
========================================================= */

function reactToNearestStar(x, y) {

    if (!starsContainer) {
        return;
    }

    const stars =
        starsContainer.querySelectorAll(".star");

    let nearestStar = null;
    let nearestDistance = Infinity;

    stars.forEach(star => {

        const rect = star.getBoundingClientRect();

        const starX =
            rect.left + rect.width / 2;

        const starY =
            rect.top + rect.height / 2;

        const distance =
            Math.hypot(
                starX - x,
                starY - y
            );

        if (distance < nearestDistance) {

            nearestDistance = distance;
            nearestStar = star;
        }
    });

    if (
        nearestStar &&
        nearestDistance < 90
    ) {

        nearestStar.classList.add("active");

        setTimeout(() => {

            nearestStar.classList.remove("active");

        }, 700);

        createSparkles(
            x,
            y,
            5
        );
    }
}


/* =========================================================
   SHOOTING STARS
========================================================= */

function createShootingStar() {

    if (!shootingStarsContainer) {
        return;
    }

    const star =
        document.createElement("span");

    star.className =
        "shooting-star";

    star.style.left =
        Math.random() * 85 + "%";

    star.style.top =
        Math.random() * 45 + "%";

    star.style.animationDuration =
        0.8 + Math.random() * 0.8 + "s";

    shootingStarsContainer.appendChild(star);

    setTimeout(() => {

        star.remove();

    }, 2200);
}


function startShootingStars() {

    if (shootingStarTimer) {
        clearInterval(shootingStarTimer);
    }

    shootingStarTimer =
        setInterval(() => {

            createShootingStar();

        }, 6500 + Math.random() * 4500);
}


/* =========================================================
   SPARKLES
========================================================= */

function createSparkle(x, y) {

    if (!sparklesContainer) {
        return;
    }

    const sparkle =
        document.createElement("span");

    sparkle.className =
        "sparkle";

    sparkle.style.left =
        x + "px";

    sparkle.style.top =
        y + "px";

    sparkle.style.setProperty(
        "--sparkle-x",
        (Math.random() * 50 - 25) + "px"
    );

    sparkle.style.setProperty(
        "--sparkle-y",
        (Math.random() * 50 - 25) + "px"
    );

    sparklesContainer.appendChild(
        sparkle
    );

    setTimeout(() => {

        sparkle.remove();

    }, 1200);
}


function createSparkles(x, y, amount = 8) {

    for (let i = 0; i < amount; i++) {

        setTimeout(() => {

            createSparkle(
                x + Math.random() * 30 - 15,
                y + Math.random() * 30 - 15
            );

        }, i * 35);
    }
}


function startAmbientSparkles() {

    if (sparkleTimer) {
        clearInterval(sparkleTimer);
    }

    sparkleTimer =
        setInterval(() => {

            if (
                window.innerWidth <= 0 ||
                window.innerHeight <= 0
            ) {
                return;
            }

            const x =
                Math.random() *
                window.innerWidth;

            const y =
                Math.random() *
                window.innerHeight;

            createSparkle(
                x,
                y
            );

        }, 1800);
}


/* =========================================================
   HEARTS
========================================================= */

function createHeart(x, y) {

    const heart =
        document.createElement("span");

    heart.className =
        "floating-heart";

    heart.textContent = "♥";

    heart.style.left =
        x + "px";

    heart.style.top =
        y + "px";

    heart.style.setProperty(
        "--heart-x",
        (Math.random() * 100 - 50) + "px"
    );

    heart.style.setProperty(
        "--heart-y",
        (-70 - Math.random() * 80) + "px"
    );

    document.body.appendChild(
        heart
    );

    setTimeout(() => {

        heart.remove();

    }, 1800);
}


function createHearts(x, y, amount = 5) {

    for (let i = 0; i < amount; i++) {

        setTimeout(() => {

            createHeart(
                x + Math.random() * 35 - 17,
                y + Math.random() * 20 - 10
            );

        }, i * 70);
    }
}


/* =========================================================
   HEART TRAIL
========================================================= */

function createTrailHeart(x, y) {

    if (!heartTrailContainer) {
        return;
    }

    const heart =
        document.createElement("span");

    heart.className =
        "trail-heart";

    heart.textContent = "♥";

    heart.style.left =
        x + "px";

    heart.style.top =
        y + "px";

    heartTrailContainer.appendChild(
        heart
    );

    setTimeout(() => {

        heart.remove();

    }, 900);
}


function handlePointerMove(event) {

    if (!pointerDown) {
        return;
    }

    const now =
        Date.now();

    if (
        now - lastTrailTime < 45
    ) {
        return;
    }

    lastTrailTime = now;

    createTrailHeart(
        event.clientX,
        event.clientY
    );
}


/* =========================================================
   GLOBAL SKY INTERACTION
========================================================= */

function setupSkyInteractions() {

    document.addEventListener(
        "pointerdown",
        event => {

            const target =
                event.target;

            if (
                target.closest(
                    "button, input, .gift, .envelope, .moon, .wish-star, .secret-star, .music-toggle"
                )
            ) {
                return;
            }

            pointerDown = true;

            const x =
                event.clientX;

            const y =
                event.clientY;

            createHearts(
                x,
                y,
                4
            );

            createSparkles(
                x,
                y,
                5
            );

            reactToNearestStar(
                x,
                y
            );
        }
    );


    document.addEventListener(
        "pointerup",
        () => {

            pointerDown = false;

        }
    );


    document.addEventListener(
        "pointercancel",
        () => {

            pointerDown = false;

        }
    );


    document.addEventListener(
        "pointermove",
        handlePointerMove
    );
}


/* =========================================================
   SCREEN SYSTEM
========================================================= */

function showScreen(screenId) {

    const screens =
        document.querySelectorAll(".screen");

    screens.forEach(screen => {

        screen.classList.remove("active");

    });


    const target =
        document.getElementById(screenId);

    if (!target) {
        return;
    }

    target.classList.add("active");


    updateSkyProgress(
        screenId
    );


    if (screenId === "celebration") {

        setTimeout(() => {

            createConfetti();
            createBalloons();
            createHearts(
                window.innerWidth / 2,
                window.innerHeight / 2,
                12
            );
            createSparkles(
                window.innerWidth / 2,
                window.innerHeight / 2,
                15
            );

        }, 300);
    }


    if (screenId === "final") {

        if (sky) {
            sky.classList.add("magical");
        }

        createSparkles(
            window.innerWidth / 2,
            window.innerHeight / 2,
            15
        );
    }


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* =========================================================
   SKY PROGRESSION
========================================================= */

function updateSkyProgress(screenId) {

    if (!sky) {
        return;
    }

    const magicalScreens = [
        "memories",
        "moon",
        "confession",
        "wishes",
        "cake",
        "celebration",
        "secret",
        "final"
    ];

    if (
        magicalScreens.includes(screenId)
    ) {

        sky.classList.add("magical");

    }
    else {

        sky.classList.remove("magical");

    }
}


/* =========================================================
   OPENING
========================================================= */

function enterBirthday() {

    startMusic();

    createHearts(
        window.innerWidth / 2,
        window.innerHeight / 2,
        8
    );

    createSparkles(
        window.innerWidth / 2,
        window.innerHeight / 2,
        10
    );

    createShootingStar();

    showScreen(
        "memories"
    );
}


/* =========================================================
   MUSIC
========================================================= */

function startMusic() {

    if (!bgMusic) {
        return;
    }

    bgMusic.volume = 0.55;

    const playPromise =
        bgMusic.play();

    if (
        playPromise &&
        typeof playPromise.then === "function"
    ) {

        playPromise
            .then(() => {

                musicStarted = true;
                musicPlaying = true;

                updateMusicButton();

            })
            .catch(() => {

                musicStarted = false;
                musicPlaying = false;

                updateMusicButton();

            });

    }
    else {

        musicStarted = true;
        musicPlaying = true;

        updateMusicButton();
    }
}


function toggleMusic() {

    if (!bgMusic) {
        return;
    }

    if (
        bgMusic.paused
    ) {

        startMusic();

    }
    else {

        bgMusic.pause();

        musicPlaying = false;

        updateMusicButton();
    }
}


function updateMusicButton() {

    if (!musicToggle) {
        return;
    }

    if (
        bgMusic &&
        !bgMusic.paused
    ) {

        musicToggle.textContent =
            "🔊";

        musicToggle.setAttribute(
            "aria-label",
            "Pause music"
        );

    }
    else {

        musicToggle.textContent =
            "🔇";

        musicToggle.setAttribute(
            "aria-label",
            "Play music"
        );
    }
}


/* =========================================================
   MOON
========================================================= */

function reactToMoon() {

    const moon =
        document.getElementById(
            "moonObject"
        );

    const message =
        document.getElementById(
            "moonMessage"
        );

    if (moon) {

        moon.classList.toggle(
            "moon-reacted"
        );
    }


    if (message) {

        message.textContent =
            "Even the moon is staying awake tonight. 🌙✨";

        message.classList.add(
            "show"
        );
    }


    if (moon) {

        const rect =
            moon.getBoundingClientRect();

        createSparkles(
            rect.left + rect.width / 2,
            rect.top + rect.height / 2,
            12
        );

        createHearts(
            rect.left + rect.width / 2,
            rect.top + rect.height / 2,
            5
        );
    }
}


/* =========================================================
   CONFESSION
========================================================= */

function yesAnswer() {

    const question =
        document.getElementById(
            "confessionQuestion"
        );

    const envelope =
        document.getElementById(
            "confessionEnvelope"
        );

    if (question) {

        question.classList.add(
            "hidden"
        );
    }


    if (envelope) {

        envelope.classList.remove(
            "hidden"
        );
    }


    createHearts(
        window.innerWidth / 2,
        window.innerHeight / 2,
        8
    );
}


function noAnswer() {

    const message =
        document.getElementById(
            "confessionMessage"
        );

    if (message) {

        message.textContent =
            "That's okay. Some questions are worth thinking about. ✨";

        message.classList.add(
            "show"
        );
    }
}


function openEnvelope() {

    const envelope =
        document.querySelector(
            ".envelope"
        );

    const reveal =
        document.getElementById(
            "letterReveal"
        );


    if (envelope) {

        envelope.classList.add(
            "open"
        );
    }


    setTimeout(() => {

        if (reveal) {

            reveal.classList.remove(
                "hidden"
            );

            reveal.classList.add(
                "show"
            );
        }


        createHearts(
            window.innerWidth / 2,
            window.innerHeight / 2,
            7
        );

    }, 850);
}


/* =========================================================
   WISHES
========================================================= */

const wishes = [

    "May your smile always find a reason to appear. ✨",

    "May every new chapter bring you beautiful memories. 🌙",

    "May your dreams slowly become the moments you once wished for. ⭐",

    "May you always have people around you who genuinely care about you. ❤️",

    "May this year bring you peaceful days, happy surprises and countless reasons to smile. 🎂",

    "And most importantly... may this birthday become one of the memories you never forget. 💫"

];


function showWish(index) {

    if (
        index < 0 ||
        index >= wishes.length
    ) {
        return;
    }


    const display =
        document.getElementById(
            "wishDisplay"
        );

    const counter =
        document.getElementById(
            "wishCounter"
        );


    if (display) {

        display.textContent =
            wishes[index];

        display.classList.add(
            "show"
        );
    }


    const stars =
        document.querySelectorAll(
            ".wish-star"
        );

    if (stars[index]) {

        stars[index].classList.add(
            "completed"
        );
    }


    wishesCompleted =
        Math.max(
            wishesCompleted,
            index + 1
        );


    if (counter) {

        counter.textContent =
            `${wishesCompleted} / ${wishes.length}`;
    }


    const star =
        stars[index];

    if (star) {

        const rect =
            star.getBoundingClientRect();

        createSparkles(
            rect.left + rect.width / 2,
            rect.top + rect.height / 2,
            10
        );
    }


    if (
        wishesCompleted === wishes.length
    ) {

        revealSecretStar();
    }
}


/* =========================================================
   SECRET SHOOTING STAR
========================================================= */

function revealSecretStar() {

    const secretStar =
        document.getElementById(
            "secretStar"
        );

    if (!secretStar) {
        return;
    }

    setTimeout(() => {

        secretStar.classList.remove(
            "hidden"
        );

        secretStar.classList.add(
            "appear"
        );

        createShootingStar();

        createSparkles(
            window.innerWidth * 0.75,
            window.innerHeight * 0.25,
            20
        );

    }, 900);
}


function unlockSecretStar() {

    const message =
        document.getElementById(
            "secretStarMessage"
        );

    if (message) {

        message.textContent =
            "You found the little secret hiding among the stars. 🌠✨";

        message.classList.add(
            "show"
        );
    }


    const secretStar =
        document.getElementById(
            "secretStar"
        );

    if (secretStar) {

        const rect =
            secretStar.getBoundingClientRect();

        createHearts(
            rect.left + rect.width / 2,
            rect.top + rect.height / 2,
            8
        );

        createSparkles(
            rect.left + rect.width / 2,
            rect.top + rect.height / 2,
            15
        );
    }
}


/* =========================================================
   CAKE INTERACTION
========================================================= */

function setupCakeInteraction() {

    const cake =
        document.querySelector(
            ".cake-component"
        );

    if (!cake) {
        return;
    }

    cake.addEventListener(
        "click",
        event => {

            if (
                event.target.closest(
                    "button"
                )
            ) {
                return;
            }

            if (!candlesBlown) {

                blowCandles();

            }
        }
    );
}


/* =========================================================
   BLOW CANDLES
========================================================= */

function blowCandles() {

    if (candlesBlown) {
        return;
    }

    candlesBlown = true;


    const flames        document.querySelectorAll(
            ".flame"
        );

    flames.forEach(
        (flame, index) => {

            flame.classList.add(
                "blown-out"
            );

            createSmoke(
                flame,
                index
            );
        }
    );


    stopMicrophone();


    const message =
        document.getElementById(
            "candleMessage"
        );

    if (message) {

        message.textContent =
            "✨ Wish made... ✨";

        message.classList.add(
            "show"
        );
    }


    createSparkles(
        window.innerWidth / 2,
        window.innerHeight / 2,
        20
    );


    createHearts(
        window.innerWidth / 2,
        window.innerHeight / 2,
        10
    );


    setTimeout(() => {

        const continueButton =
            document.getElementById(
                "cakeContinue"
            );

        if (continueButton) {

            continueButton.classList.add(
                "show"
            );
        }

    }, 1000);
}


/* =========================================================
   CANDLE SMOKE
========================================================= */

function createSmoke(
    flame,
    index
) {

    if (!flame) {
        return;
    }

    const smoke =
        document.createElement(
            "span"
        );

    smoke.className =
        "smoke";

    smoke.style.setProperty(
        "--smoke-delay",
        (index * 0.12) + "s"
    );

    flame.parentElement.appendChild(
        smoke
    );


    setTimeout(() => {

        smoke.remove();

    }, 3000);
}


/* =========================================================
   MICROPHONE CANDLE DETECTION
========================================================= */

async function startMic() {

    if (candlesBlown) {
        return;
    }


    if (
        !navigator.mediaDevices ||
        !navigator.mediaDevices.getUserMedia
    ) {

        showMicFallback();

        return;
    }


    try {

        microphoneStream =
            await navigator.mediaDevices.getUserMedia({
                audio: true
            });


        audioContext =
            new (
                window.AudioContext ||
                window.webkitAudioContext
            )();


        analyser =
            audioContext.createAnalyser();

        analyser.fftSize = 1024;


        microphone =
            audioContext.createMediaStreamSource(
                microphoneStream
            );


        microphone.connect(
            analyser
        );


        microphoneRunning = true;


        const message =
            document.getElementById(
                "candleMessage"
            );

        if (message) {

            message.textContent =
                "Blow gently toward the microphone... 🎂";

            message.classList.add(
                "show"
            );
        }


        detectBlow();

    }
    catch (error) {

        console.log(
            "Microphone unavailable:",
            error
        );

        showMicFallback();
    }
}


/* =========================================================
   DETECT BLOW
========================================================= */

function detectBlow() {

    if (
        !microphoneRunning ||
        !analyser ||
        candlesBlown
    ) {
        return;
    }


    const data =
        new Uint8Array(
            analyser.fftSize
        );


    analyser.getByteTimeDomainData(
        data
    );


    let sum = 0;


    for (
        let i = 0;
        i < data.length;
        i++
    ) {

        const value =
            (data[i] - 128) / 128;

        sum += value * value;
    }


    const volume =
        Math.sqrt(
            sum / data.length
        );


    if (volume > 0.22) {

        blowCandles();

        return;
    }


    requestAnimationFrame(
        detectBlow
    );
}


/* =========================================================
   STOP MICROPHONE
========================================================= */

function stopMicrophone() {

    microphoneRunning = false;


    if (microphoneStream) {

        microphoneStream
            .getTracks()
            .forEach(track => {

                track.stop();

            });

        microphoneStream = null;
    }


    if (microphone) {

        try {

            microphone.disconnect();

        }
        catch (error) {

            console.log(error);

        }

        microphone = null;
    }


    if (audioContext) {

        try {

            audioContext.close();

        }
        catch (error) {

            console.log(error);

        }

        audioContext = null;
    }


    analyser = null;
}


/* =========================================================
   MICROPHONE FALLBACK
========================================================= */

function showMicFallback() {

    const message =
        document.getElementById(
            "candleMessage"
        );

    if (message) {

        message.textContent =
            "Microphone isn't available. Tap the cake to blow out the candles. 🎂";

        message.classList.add(
            "show"
        );
    }
}


/* =========================================================
   CONFETTI
========================================================= */

function createConfetti() {

    const container =
        document.getElementById(
            "confetti"
        );

    if (!container) {
        return;
    }


    container.innerHTML = "";


    const amount = 90;


    for (
        let i = 0;
        i < amount;
        i++
    ) {

        const piece =
            document.createElement(
                "span"
            );

        piece.className =
            "confetti-piece";


        piece.style.left =
            Math.random() * 100 + "%";


        piece.style.animationDelay =
            Math.random() * 2 + "s";


        piece.style.animationDuration =
            2 + Math.random() * 3 + "s";


        piece.style.transform =
            `rotate(${Math.random() * 360}deg)`;


        container.appendChild(
            piece
        );
    }
}


/* =========================================================
   BALLOONS
========================================================= */

function createBalloons() {

    const container =
        document.getElementById(
            "balloons"
        );

    if (!container) {
        return;
    }


    container.innerHTML = "";


    const amount = 12;


    for (
        let i = 0;
        i < amount;
        i++
    ) {

        const balloon =
            document.createElement(
                "span"
            );

        balloon.className =
            "balloon";


        balloon.style.left =
            Math.random() * 100 + "%";


        balloon.style.animationDelay =
            Math.random() * 2 + "s";


        balloon.style.animationDuration =
            4 + Math.random() * 4 + "s";


        balloon.style.setProperty(
            "--balloon-x",
            (Math.random() * 80 - 40) + "px"
        );


        container.appendChild(
            balloon
        );
    }
}


/* =========================================================
   SECRET QUESTION
========================================================= */

function checkSecretAnswer() {

    const input =
        document.getElementById(
            "secretAnswer"
        );

    const verification =
        document.getElementById(
            "verification"
        );

    const secretMessage =
        document.getElementById(
            "secretMessage"
        );


    if (!input) {
        return;
    }


    const answer =
        input.value
            .trim()
            .toLowerCase();


    if (
        SECRET_ANSWER ===
        "YOUR_SHIRT_COLOUR"
    ) {

        if (verification) {

            verification.textContent =
                "Set the shirt colour in script.js first.";

            verification.classList.add(
                "show"
            );
        }

        return;
    }


    if (
        answer ===
        SECRET_ANSWER
            .trim()
            .toLowerCase()
    ) {

        if (verification) {

            verification.classList.add(
                "show"
            );

            verification.textContent =
                "🔐 VERIFYING MEMORY...";


            setTimeout(() => {

                verification.textContent =
                    "✓ MEMORY FOUND";

            }, 900);


            setTimeout(() => {

                verification.textContent =
                    "✓ SECRET UNLOCKED";

            }, 1800);
        }


        setTimeout(() => {

            if (secretMessage) {

                secretMessage.classList.remove(
                    "hidden"
                );

                secretMessage.classList.add(
                    "show"
                );
            }


            createHearts(
                window.innerWidth / 2,
                window.innerHeight / 2,
                12
            );


            createSparkles(
                window.innerWidth / 2,
                window.innerHeight / 2,
                18
            );

        }, 2300);

    }
    else {

        if (verification) {

            verification.textContent =
                "Not quite... try again. ✨";

            verification.classList.add(
                "show"
            );
        }

        if (secretMessage) {

            secretMessage.classList.remove(
                "show"
            );
        }
    }
}


/* =========================================================
   AMBIENT EFFECTS
========================================================= */

function startAmbientEffects() {

    startShootingStars();

    startAmbientSparkles();


    setTimeout(() => {

        createShootingStar();

    }, 2500);
}


/* =========================================================
   PAGE VISIBILITY
========================================================= */

document.addEventListener(
    "visibilitychange",
    () => {

        if (
            document.hidden
        ) {
            return;
        }


        if (
            musicStarted &&
            bgMusic &&
            bgMusic.paused
        ) {

            updateMusicButton();
        }
    }
);


/* =========================================================
   WINDOW RESIZE
========================================================= */

window.addEventListener(
    "resize",
    () => {

        // Keeps effects responsive
        // without rebuilding the star field.

    }
);


/* =========================================================
   DEBUG HELPERS
========================================================= */

window.MadziaBirthday = {

    music: () =>
        toggleMusic(),

    shootingStar: () =>
        createShootingStar(),

    hearts: () =>
        createHearts(
            window.innerWidth / 2,
            window.innerHeight / 2,
            10
        ),

    sparkles: () =>
        createSparkles(
            window.innerWidth / 2,
            window.innerHeight / 2,
            10
        ),

    blowCandles: () =>
        blowCandles()

};


/* =========================================================
   INITIAL MUSIC STATE
========================================================= */

if (bgMusic) {

    bgMusic.addEventListener(
        "play",
        () => {

            musicPlaying = true;

            updateMusicButton();

        }
    );


    bgMusic.addEventListener(
        "pause",
        () => {

            musicPlaying = false;

            updateMusicButton();

        }
    );
}
