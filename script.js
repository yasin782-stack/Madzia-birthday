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
  screens.forEach(s => s.classList.remove("active"));
  const screen = $(id);

  if(screen) screen.classList.add("active");

  if(id === "cake") loadCake();
  if(id === "celebration") celebration();
}

/* ---------- MUSIC ---------- */

function toggleMusic(){
  const music = $("bgMusic");
  if(!music) return;

  if(music.paused){
    music.play().then(() => musicStarted = true).catch(() => {});
  }else{
    music.pause();
  }
}

function enterBirthday(){
  const music = $("bgMusic");

  if(music && !musicStarted){
    music.play().then(() => musicStarted = true).catch(() => {});
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
  setTimeout(() => star.remove(), 1300);
}

function createSparkle(x,y){
  const container = $("sparkles");
  if(!container) return;

  const spark = document.createElement("span");
  spark.className = "spark";
  spark.style.left = x + "px";
  spark.style.top = y + "px";

  container.appendChild(spark);
  setTimeout(() => spark.remove(), 1500);
}

/* ---------- TOUCH EFFECTS ---------- */

function createHeart(x,y){
  const heart = document.createElement("span");
  heart.className = "heart";
  heart.textContent = "❤️";
  heart.style.left = x + "px";
  heart.style.top = y + "px";

  $("floatingHearts").appendChild(heart);
  setTimeout(() => heart.remove(), 1800);
}

function createTrailHeart(x,y){
  const heart = document.createElement("span");
  heart.className = "trail-heart";
  heart.textContent = "♥";
  heart.style.left = x + "px";
  heart.style.top = y + "px";

  $("heartTrail").appendChild(heart);
  setTimeout(() => heart.remove(), 800);
}

document.addEventListener("click", e => {
  if(e.target.closest("button,input,.envelope,#cakeMount")) return;

  createHeart(e.clientX,e.clientY);
  createSparkle(e.clientX,e.clientY);
});

document.addEventListener("pointermove", e => {
  if(e.buttons) createTrailHeart(e.clientX,e.clientY);
});

/* ---------- MOON ---------- */

function reactToMoon(){
  const moon = $("moonObject");
  const message = $("moonMessage");

  moon.classList.add("reacted");

  message.textContent = "The moon noticed you. 🌙✨";

  for(let i = 0; i < 8; i++){
    setTimeout(() => {
      createSparkle(
        moon.getBoundingClientRect().left +
        Math.random() * moon.offsetWidth,
        moon.getBoundingClientRect().top +
        Math.random() * moon.offsetHeight
      );
    }, i * 100);
  }

  setTimeout(() => moon.classList.remove("reacted"),700);
}

/* ---------- CONFESSION ---------- */

function openEnvelope(){
  $("confessionEnvelope").classList.add("opened");
  $("letterReveal").classList.remove("hidden");
}

function yesAnswer(){
  $("answerMessage").textContent =
    "Then let's keep this little memory. ❤️✨";

  $("confessionContinue").classList.remove("hidden");
}

function noAnswer(){
  $("answerMessage").textContent =
    "That's okay. The memory can still stay here. 🌙";

  $("confessionContinue").classList.remove("hidden");
}

/* ---------- WISHES ---------- */

function showWish(index){
  const stars = document.querySelectorAll(".wish-star");

  if(stars[index].classList.contains("used")) return;

  stars[index].classList.add("used");
  wishCount++;

  $("wishCounter").textContent = wishCount + " / 6";
  $("wishDisplay").textContent = wishes[index];

  createHeart(
    window.innerWidth / 2,
    window.innerHeight / 2
  );

  if(wishCount === 6){
    setTimeout(() => {
      $("secretStar").classList.remove("hidden");
    },800);
  }
}

function unlockSecretStar(){
  $("secretStarMessage").textContent =
    "You found the little secret hidden among the stars. 🌠❤️";

  $("wishesContinue").classList.remove("hidden");

  for(let i = 0; i < 15; i++){
    setTimeout(() => {
      createSparkle(
        Math.random() * window.innerWidth,
        Math.random() * window.innerHeight
      );
    },i * 70);
  }
}

/* ---------- CAKE ---------- */

async function loadCake(){
  if(cakeLoaded) return;

  const mount = $("cakeMount");
  if(!mount) return;

  try{
    const response = await fetch("cake/cake.html");
    if(!response.ok) throw new Error("Cake component not found");

    mount.innerHTML = await response.text();

    await new Promise((resolve,reject) => {
      const script = document.createElement("script");
      script.src = "cake/cake.js";
      script.onload = resolve;
      script.onerror = reject;
      document.body.appendChild(script);
    });

    cakeLoaded = true;
  }catch(error){
    mount.innerHTML =
      "<p>Unable to load the birthday cake. Please refresh the page.</p>";
    console.error(error);
  }
}

/* ---------- MICROPHONE ---------- */

async function startMic(){
  if(micActive) return;

  try{
    micStream = await navigator.mediaDevices.getUserMedia({audio:true});

    audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();

    const source = audioContext.createMediaStreamSource(micStream);

    analyser = audioContext.createAnalyser();
    analyser.fftSize = 512;

    source.connect(analyser);
    micActive = true;

    const data = new Uint8Array(analyser.fftSize);
    detectBlow(data);
  }catch(error){
    console.error(error);

    const instruction = $("blowInstruction");
    if(instruction){
      instruction.textContent =
        "Microphone unavailable — use the button below.";
    }
  }
}

function detectBlow(data){
  if(!micActive || !analyser) return;

  analyser.getByteTimeDomainData(data);

  let total = 0;

  for(let i = 0; i < data.length; i++){
    const value = (data[i] - 128) / 128;
    total += value * value;
  }

  const volume = Math.sqrt(total / data.length);

  if(window.MadziaCake?.reactFlamesToAir){
    window.MadziaCake.reactFlamesToAir(
      Math.min(volume * 4,1)
    );
  }

  if(volume > .20){
    blowCandles();
    return;
  }

  requestAnimationFrame(() => detectBlow(data));
}

function blowCandles(){
  micActive = false;

  if(micStream){
    micStream.getTracks().forEach(track => track.stop());
    micStream = null;
  }

  if(audioContext){
    audioContext.close().catch(() => {});
    audioContext = null;
  }

  if(window.MadziaCake?.blowCandles){
    window.MadziaCake.blowCandles();
  }else{
    document.querySelectorAll(".flame").forEach(flame => {
      flame.classList.add("blown-out");
    });

    document.querySelectorAll(".candle").forEach(candle => {
      const smoke = document.createElement("span");
      smoke.className = "smoke";
      candle.appendChild(smoke);
    });
  }

  const message = $("cakeMessage");

  if(message){
    message.textContent = "Happy Birthday, Madzia! 🎂❤️";
    message.classList.remove("hidden");
  }

  setTimeout(() => showScreen("celebration"),2200);
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
  const answer = input.value.trim().toUpperCase();
  const verification = $("verification");
  const message = $("secretMessage");

  if(answer === SECRET_ANSWER){
    verification.innerHTML =
      "🔐 VERIFYING MEMORY...<br>" +
      "✓ MEMORY FOUND<br>" +
      "✓ SECRET UNLOCKED";

    message.innerHTML =
      "You remembered the first photo… 👀❤️<br>" +
      "Maybe that's proof that some little moments are worth " +
      "remembering forever. 🌙✨";

    $("finalContinue").classList.remove("hidden");
  }else{
    verification.textContent =
      "❌ Memory not found. Try again.";
    message.textContent = "";
  }
}

/* ---------- START ---------- */

createStars();

setInterval(shootingStar,5000);

document.addEventListener("DOMContentLoaded",() => {
  setTimeout(shootingStar,1500);
});
