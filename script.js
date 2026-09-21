const SECRET_ANSWER = "BLACK";

const $ = id => document.getElementById(id);
const screens = document.querySelectorAll(".screen");

const wishes = [
  "May your days always have reasons to smile. ❤️",
  "May your dreams slowly become beautiful realities. ✨",
  "May you always be surrounded by people who value you. 🌙",
  "May every new year of your life bring something wonderful. 🌸",
  "May your happiest memories still be ahead of you. ⭐",
  "And most importantly, may you always stay wonderfully yourself. ❤️"
];

let wishCount = 0;
let musicStarted = false;
let cakeLoaded = false;
let micStream = null;
let audioContext = null;
let analyser = null;
let micActive = false;

/* ---------- SCREEN ---------- */

function showScreen(id){
  screens.forEach(screen => screen.classList.remove("active"));

  const screen = $(id);
  if(!screen) return;

  screen.classList.add("active");

  if(id === "cake"){
    loadCake();
  }

  if(id === "celebration"){
    celebration();
  }
}

/* ---------- MUSIC ---------- */

function toggleMusic(){
  const music = $("bgMusic");
  if(!music) return;

  if(music.paused){
    music.play()
      .then(() => musicStarted = true)
      .catch(() => {});
  }else{
    music.pause();
  }
}

function enterBirthday(){
  const music = $("bgMusic");

  if(music && !musicStarted){
    music.play()
      .then(() => musicStarted = true)
      .catch(() => {});
  }

  showScreen("memories");
}

/* ---------- SKY ---------- */

function createStars(){
  const container = $("stars");
  if(!container) return;

  for(let i = 0; i < 90; i++){
    const star = document.createElement("span");

    star.className = "star";
    star.style.left = Math.random() * 100 + "%";
    star.style.top = Math.random() * 100 + "%";
    star.style.animationDelay = Math.random() * 3 + "s";

    container.appendChild(star);
  }
}

function shootingStar(){
  const container = $("shootingStars");
  if(!container) return;

  const star = document.createElement("span");

  star.className = "shooting-star";
  star.style.left = 80 + Math.random() * 20 + "%";
  star.style.top = Math.random() * 45 + "%";

  container.appendChild(star);

  setTimeout(() => star.remove(),1300);
}

function createSparkle(x,y){
  const container = $("sparkles");
  if(!container) return;

  const spark = document.createElement("span");

  spark.className = "spark";
  spark.style.left = x + "px";
  spark.style.top = y + "px";

  container.appendChild(spark);

  setTimeout(() => spark.remove(),1500);
}

/* ---------- TOUCH EFFECTS ---------- */

function createHeart(x,y){
  const container = $("floatingHearts");
  if(!container) return;

  const heart = document.createElement("span");

  heart.className = "heart";
  heart.textContent = "❤️";
  heart.style.left = x + "px";
  heart.style.top = y + "px";

  container.appendChild(heart);

  setTimeout(() => heart.remove(),1800);
}

function createTrailHeart(x,y){
  const container = $("heartTrail");
  if(!container) return;

  const heart = document.createElement("span");

  heart.className = "trail-heart";
  heart.textContent = "♥";
  heart.style.left = x + "px";
  heart.style.top = y + "px";

  container.appendChild(heart);

  setTimeout(() => heart.remove(),800);
}

document.addEventListener("click",event => {
  if(event.target.closest("button,input,.envelope,#cakeMount")){
    return;
  }

  createHeart(event.clientX,event.clientY);
  createSparkle(event.clientX,event.clientY);
});

document.addEventListener("pointermove",event => {
  if(event.buttons){
    createTrailHeart(event.clientX,event.clientY);
  }
});

/* ---------- MOON ---------- */

function reactToMoon(){
  const moon = $("moonObject");
  const message = $("moonMessage");

  if(!moon || !message) return;

  moon.classList.add("reacted");

  message.textContent = "The moon noticed you. 🌙✨";

  for(let i = 0; i < 8; i++){
    setTimeout(() => {
      const rect = moon.getBoundingClientRect();

      createSparkle(
        rect.left + Math.random() * rect.width,
        rect.top + Math.random() * rect.height
      );
    },i * 100);
  }

  setTimeout(() => {
    moon.classList.remove("reacted");
  },700);
}

/* ---------- CONFESSION ---------- */

function openEnvelope(){
  const envelope = $("confessionEnvelope");
  const letter = $("letterReveal");

  if(!envelope || !letter) return;

  envelope.classList.add("opened");
  letter.classList.remove("hidden");
}

function yesAnswer(){
  const message = $("answerMessage");
  const next = $("confessionContinue");

  if(message){
    message.textContent =
      "Then let's keep this little memory. ❤️✨";
  }

  if(next){
    next.classList.remove("hidden");
  }
}

function noAnswer(){
  const message = $("answerMessage");
  const next = $("confessionContinue");

  if(message){
    message.textContent =
      "That's okay. The memory can still stay here. 🌙";
  }

  if(next){
    next.classList.remove("hidden");
  }
}

/* ---------- WISHES ---------- */

function showWish(index){
  if(index < 0 || index >= wishes.length) return;

  const stars = document.querySelectorAll(".wish-star");
  const display = $("wishDisplay");
  const counter = $("wishCounter");

  if(!display || !counter) return;

  if(!stars[index].classList.contains("used")){
    stars[index].classList.add("used");
    wishCount++;
  }

  display.textContent = wishes[index];
  counter.textContent = wishCount + " / 6";

  for(let i = 0; i < 5; i++){
    setTimeout(() => {
      createSparkle(
        window.innerWidth / 2 + (Math.random() - .5) * 180,
        window.innerHeight / 2 + (Math.random() - .5) * 100
      );
    },i * 100);
  }

  if(wishCount === 6){
    const secretStar = $("secretStar");

    if(secretStar){
      secretStar.classList.remove("hidden");
    }
  }
}

function unlockSecretStar(){
  const message = $("secretStarMessage");
  const next = $("wishesContinue");

  if(message){
    message.textContent =
      "A secret shooting star appeared just for this moment. 🌠✨";
  }

  for(let i = 0; i < 12; i++){
    setTimeout(() => {
      createSparkle(
        window.innerWidth / 2 + (Math.random() - .5) * 200,
        window.innerHeight / 2 + (Math.random() - .5) * 150
      );
    },i * 80);
  }

  if(next){
    next.classList.remove("hidden");
  }
}

/* ---------- CAKE ---------- */

async function loadCake(){
  if(cakeLoaded) return;

  const mount = $("cakeMount");
  if(!mount) return;

  try{
    const response = await fetch("cake/cake.html");

    if(!response.ok){
      throw new Error("Cake HTML could not be loaded.");
    }

    mount.innerHTML = await response.text();

    const script = document.createElement("script");
    script.src = "cake/cake.js";

    script.onload = () => {
      cakeLoaded = true;
    };

    document.body.appendChild(script);

  }catch(error){
    console.error("Cake loading error:",error);
    mount.innerHTML =
      "<p>Sorry, the birthday cake could not load. 🎂</p>";
  }
}

/* ---------- MICROPHONE ---------- */

async function startMic(){
  if(micActive) return;

  try{
    micStream = await navigator.mediaDevices.getUserMedia({
      audio:true
    });

    audioContext =
      new (window.AudioContext || window.webkitAudioContext)();

    const source =
      audioContext.createMediaStreamSource(micStream);

    analyser = audioContext.createAnalyser();
    analyser.fftSize = 512;

    source.connect(analyser);

    micActive = true;

    const button = $("startMicButton");

    if(button){
      button.textContent = "🎤 Listening...";
      button.disabled = true;
    }

    detectBlow();

  }catch(error){
    console.error("Microphone error:",error);

    const instruction = $("blowInstruction");

    if(instruction){
      instruction.textContent =
        "Microphone unavailable — use Tap to Blow ✨";
    }
  }
}

function detectBlow(){
  if(!micActive || !analyser) return;

  const data =
    new Uint8Array(analyser.fftSize);

  analyser.getByteTimeDomainData(data);

  let total = 0;

  for(let i = 0; i < data.length; i++){
    const value = (data[i] - 128) / 128;
    total += value * value;
  }

  const volume =
    Math.sqrt(total / data.length);

  if(volume > .20){
    blowCandles();
    return;
  }

  requestAnimationFrame(detectBlow);
}

function stopMic(){
  micActive = false;

  if(micStream){
    micStream.getTracks().forEach(track => track.stop());
    micStream = null;
  }

  if(audioContext){
    audioContext.close().catch(() => {});
    audioContext = null;
  }

  analyser = null;
}

/* ---------- BLOW CANDLES ---------- */

function blowCandles(){
  stopMic();

  if(window.MadziaCake?.blowCandles){
    window.MadziaCake.blowCandles();
    return;
  }

  /* Fallback if cake.js did not load */

  const flames =
    document.querySelectorAll("#birthdayCake .flame");

  flames.forEach((flame,index) => {
    flame.classList.add("blown-out");

    const smoke = document.createElement("span");

    smoke.className = "smoke";
    smoke.style.setProperty(
      "--smoke-delay",
      index * .15 + "s"
    );

    flame.parentElement.appendChild(smoke);
  });

  const glow =
    document.querySelector("#birthdayCake .candle-glow");

  if(glow){
    glow.style.opacity = "0";
  }

  const message = $("cakeMessage");

  if(message){
    message.textContent =
      "Happy Birthday, Madzia! 🎂❤️";
    message.classList.add("show");
  }

  const next = $("cakeContinue");

  if(next){
    setTimeout(() => {
      next.classList.add("show");
    },1200);
  }
}

/* ---------- CELEBRATION ---------- */

function celebration(){
  createConfetti();
  createBalloons();
}

function createConfetti(){
  const container = $("confettiContainer");
  if(!container) return;

  container.innerHTML = "";

  for(let i = 0; i < 80; i++){
    const piece = document.createElement("span");

    piece.className = "confetti";
    piece.style.left = Math.random() * 100 + "%";
    piece.style.top = -20 - Math.random() * 50 + "px";
    piece.style.background =
      `hsl(${Math.random() * 360},80%,65%)`;
    piece.style.animationDelay =
      Math.random() * 2 + "s";

    container.appendChild(piece);
  }
}

function createBalloons(){
  const container = $("balloonContainer");
  if(!container) return;

  container.innerHTML = "";

  for(let i = 0; i < 12; i++){
    const balloon = document.createElement("span");

    balloon.className = "balloon";
    balloon.style.left = Math.random() * 100 + "%";
    balloon.style.background =
      `hsl(${Math.random() * 360},75%,65%)`;
    balloon.style.animationDelay =
      Math.random() * 3 + "s";

    container.appendChild(balloon);
  }
}

/* ---------- SECRET ---------- */

function checkSecretAnswer(){
  const input = $("secretAnswer");
  const verification = $("verification");
  const message = $("secretMessage");
  const next = $("finalContinue");

  if(!input || !verification || !message) return;

  const answer =
    input.value.trim().toUpperCase();

  if(answer === SECRET_ANSWER){

    verification.innerHTML =
      "🔐 VERIFYING MEMORY...<br>" +
      "✓ MEMORY FOUND<br>" +
      "✓ SECRET UNLOCKED";

    message.innerHTML =
      "You remembered the first photo… 👀❤️<br>" +
      "Maybe that's proof that some little moments are worth " +
      "remembering forever. 🌙✨";

    if(next){
      next.classList.remove("hidden");
    }

  }else{

    verification.textContent =
      "❌ Memory not found. Try again.";

    message.textContent = "";

    if(next){
      next.classList.add("hidden");
    }
  }
}

/* ---------- START ---------- */

createStars();

setInterval(shootingStar,5000);

document.addEventListener("DOMContentLoaded",() => {
  setTimeout(shootingStar,1500);
});
