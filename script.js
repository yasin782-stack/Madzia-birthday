
/* =====================================================
   CREATE STARS
===================================================== */

const stars =
    document.getElementById("stars");

for(let i = 0; i < 100; i++){

    const star =
        document.createElement("div");

    star.className = "star";

    star.style.left =
        Math.random() * 100 + "%";

    star.style.top =
        Math.random() * 100 + "%";

    star.style.animationDelay =
        Math.random() * 3 + "s";

    star.style.opacity =
        Math.random();

    stars.appendChild(star);
}


/* =====================================================
   SCREEN SWITCHING
===================================================== */

function showScreen(id){

    document
        .querySelectorAll(".screen")
        .forEach(screen => {

            screen.classList.remove("active");

        });

    const target =
        document.getElementById(id);

    if(target){

        target.classList.add("active");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }

}


/* =====================================================
   YES
===================================================== */

function yesAnswer(){

    document
        .getElementById("answerButtons")
        .style.display = "none";

    document
        .getElementById("yesReveal")
        .classList.add("show");

    document
        .getElementById("noReveal")
        .classList.remove("show");

    document
        .getElementById("confessionContinue")
        .style.display = "inline-block";

    createHearts();
    createSparkles();
}


/* =====================================================
   NO
===================================================== */

function noAnswer(){

    document
        .getElementById("answerButtons")
        .style.display = "none";

    document
        .getElementById("noReveal")
        .classList.add("show");

    document
        .getElementById("yesReveal")
        .classList.remove("show");

    document
        .getElementById("confessionContinue")
        .style.display = "inline-block";

}


/* =====================================================
   WISHES
===================================================== */

const wishes = [

    "I wish you endless happiness. ❤️",

    "I wish you countless reasons to smile. 🌸",

    "I wish you beautiful memories. 🌙",

    "I wish every new year of your life brings something wonderful. ✨",

    "I wish you laughter on even the ordinary days. 💕",

    "And most importantly... I wish you a very happy birthday. 🎂❤️"

];


function showWish(index){

    document
        .getElementById("wishResult")
        .textContent =
        wishes[index];

    createSparkles();

}


/* =====================================================
   CANDLE VARIABLES
===================================================== */

let candlesBlown = false;

let audioContext = null;
let analyser = null;
let microphone = null;
let microphoneStream = null;
let microphoneRunning = false;


/* =====================================================
   BLOW CANDLES
===================================================== */

function blowCandles(){

    if(candlesBlown)
        return;

    candlesBlown = true;

    document
        .querySelectorAll(".flame")
        .forEach(flame => {

            flame.classList.add("off");

        });

    document
        .querySelectorAll(".smoke")
        .forEach(smoke => {

            smoke.classList.add("show");

        });

    stopMicrophone();

    createSparkles();

    setTimeout(() => {

        showScreen("celebration");

        createConfetti();
        createBalloons();
        createHearts();

    }, 1200);

    setTimeout(() => {

        showScreen("final");

    }, 7500);

}


/* =====================================================
   MICROPHONE
===================================================== */

async function startMic(){

    if(microphoneRunning)
        return;

    if(
        !navigator.mediaDevices ||
        !navigator.mediaDevices.getUserMedia
    ){

        alert(
            "Microphone access is not supported here. Use the button below instead."
        );

        return;
    }

    try{

        microphoneStream =
            await navigator
                .mediaDevices
                .getUserMedia({
                    audio: true
                });

        audioContext =
            new (
                window.AudioContext ||
                window.webkitAudioContext
            )();

        analyser =
            audioContext.createAnalyser();

        analyser.fftSize = 512;

        analyser.smoothingTimeConstant = .75;

        microphone =
            audioContext
                .createMediaStreamSource(
                    microphoneStream
                );

        microphone.connect(analyser);

        microphoneRunning = true;

        detectBlow();

    }

    catch(error){

        console.error(error);

        alert(
            "Microphone permission was not available. Use the button below instead."
        );

        stopMicrophone();

    }

}


/* =====================================================
   DETECT BLOW
===================================================== */

function detectBlow(){

    if(
        !microphoneRunning ||
        !analyser
    ){
        return;
    }

    const data =
        new Uint8Array(
            analyser.frequencyBinCount
        );

    analyser.getByteFrequencyData(data);

    let total = 0;

    for(let i = 0; i < data.length; i++){

        total += data[i];

    }

    const average =
        total / data.length;

    if(average > 55){

        blowCandles();

        return;

    }

    requestAnimationFrame(detectBlow);

}


/* =====================================================
   STOP MICROPHONE
===================================================== */

function stopMicrophone(){

    microphoneRunning = false;

    if(microphoneStream){

        microphoneStream
            .getTracks()
            .forEach(track => {

                track.stop();

            });

        microphoneStream = null;

    }

    if(audioContext){

        try{

            audioContext.close();

        }
        catch(error){

            console.log(error);

        }

        audioContext = null;

    }

    microphone = null;
    analyser = null;

}


/* =====================================================
   CONFETTI
===================================================== */

function createConfetti(){

    for(let i = 0; i < 120; i++){

        const piece =
            document.createElement("div");

        piece.className = "confetti";

        piece.textContent =
            Math.random() > .5
            ? "•"
            : "✦";

        piece.style.left =
            Math.random() * 100 + "vw";

        piece.style.fontSize =
            (10 + Math.random() * 16) + "px";

        piece.style.animationDuration =
            (2 + Math.random() * 4) + "s";

        piece.style.animationDelay =
            Math.random() * 2 + "s";

        document.body.appendChild(piece);

        setTimeout(() => {

            piece.remove();

        }, 7000);

    }

}


/* =====================================================
   BALLOONS
===================================================== */

function createBalloons(){

    for(let i = 0; i < 18; i++){

        const balloon =
            document.createElement("div");

        balloon.className = "balloon";

        balloon.textContent = "🎈";

        balloon.style.left =
            Math.random() * 100 + "vw";

        balloon.style.bottom =
            "-80px";

        balloon.style.fontSize =
            (30 + Math.random() * 30) + "px";

        balloon.style.animationDuration =
            (5 + Math.random() * 5) + "s";

        balloon.style.animationDelay =
            Math.random() * 2 + "s";

        document.body.appendChild(balloon);

        setTimeout(() => {

            balloon.remove();

        }, 10000);

    }

}


/* =====================================================
   HEARTS
===================================================== */

function createHearts(){

    const symbols = [
        "❤️",
        "💖",
        "💕",
        "💗",
        "💓",
        "💞"
    ];

    for(let i = 0; i < 35; i++){

        const heart =
            document.createElement("div");

        heart.className = "heart";

        heart.textContent =
            symbols[
                Math.floor(
                    Math.random() *
                    symbols.length
                )
            ];

        heart.style.left =
            Math.random() * 100 + "vw";

        heart.style.fontSize =
            (16 + Math.random() * 24) + "px";

        heart.style.animationDuration =
            (4 + Math.random() * 5) + "s";

        heart.style.animationDelay =
            Math.random() * 2 + "s";

        document.body.appendChild(heart);

        setTimeout(() => {

            heart.remove();

        }, 9000);

    }

}


/* =====================================================
   SPARKLES
===================================================== */

function createSparkles(){

    const symbols = [
        "✨",
        "⭐",
        "💫",
        "✦",
        "🌟"
    ];

    for(let i = 0; i < 20; i++){

        const sparkle =
            document.createElement("div");

        sparkle.className = "sparkle";

        sparkle.textContent =
            symbols[
                Math.floor(
                    Math.random() *
                    symbols.length
                )
            ];

        sparkle.style.left =
            Math.random() * 100 + "vw";

        sparkle.style.top =
            Math.random() * 100 + "vh";

        sparkle.style.fontSize =
            (15 + Math.random() * 25) + "px";

        sparkle.style.animationDelay =
            Math.random() * .8 + "s";

        document.body.appendChild(sparkle);

        setTimeout(() => {

            sparkle.remove();

        }, 2500);

    }

}
