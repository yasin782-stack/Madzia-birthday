const cake = document.getElementById("birthdayCake");
const flames = document.querySelectorAll("#birthdayCake .flame");

let blown = false;

/* ---------- 3D CAKE ---------- */

function setupCake(){
  if(!cake) return;

  const wrapper = cake.querySelector(".cake-wrapper");

  cake.addEventListener("pointermove", e => {
    if(!wrapper) return;

    const r = cake.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width - .5) * 8;
    const y = ((e.clientY - r.top) / r.height - .5) * -6;

    wrapper.style.transform =
      `rotateX(${y}deg) rotateY(${x}deg)`;
  });

  cake.addEventListener("pointerleave", () => {
    if(wrapper)
      wrapper.style.transform = "rotateX(0) rotateY(0)";
  });
}

/* ---------- FLAME REACTION ---------- */

function reactFlamesToAir(intensity){
  if(blown) return;

  intensity = Math.max(0,Math.min(1,intensity));

  flames.forEach((flame,i) => {
    const direction = i % 2 ? 1 : -1;
    const rotate = direction * intensity * 25;
    const scale = 1 - intensity * .25;

    flame.style.transform =
      `translateX(-50%) rotate(${rotate}deg) scaleX(${scale})`;
  });
}

/* ---------- BLOW CANDLES ---------- */

function blowCandles(){
  if(blown) return;

  blown = true;

  flames.forEach((flame,i) => {
    flame.classList.add("blown-out");

    const smoke = document.createElement("span");
    smoke.className = "smoke";
    smoke.style.setProperty(
      "--smoke-delay",
      i * .15 + "s"
    );

    flame.parentElement.appendChild(smoke);
  });

  const glow = cake.querySelector(".candle-glow");
  if(glow) glow.style.opacity = "0";

  const instruction = document.getElementById("blowInstruction");
  if(instruction)
    instruction.textContent = "Wish made... ✨";

  const candleMessage = document.getElementById("candleMessage");
  if(candleMessage){
    candleMessage.textContent =
      "Make a wish... and let it shine. ✨";
    candleMessage.classList.add("show");
  }

  const message = document.getElementById("cakeMessage");
  if(message){
    message.textContent =
      "Happy Birthday, Madzia! 🎂❤️";
    message.classList.add("show");
  }

  const micButton = document.getElementById("startMicButton");
  const fallback = document.getElementById("blowFallbackButton");

  if(micButton) micButton.disabled = true;
  if(fallback) fallback.disabled = true;

  setTimeout(() => {
    const next = document.getElementById("cakeContinue");
    if(next) next.classList.add("show");
  },1200);
}

/* ---------- RESET ---------- */

function resetCakeFlames(){
  blown = false;

  flames.forEach(flame => {
    flame.classList.remove("blown-out");
    flame.style.transform = "";
  });

  cake.querySelectorAll(".smoke").forEach(s => s.remove());

  const glow = cake.querySelector(".candle-glow");
  if(glow) glow.style.opacity = "";

  const next = document.getElementById("cakeContinue");
  if(next) next.classList.remove("show");
}

/* ---------- EFFECT ---------- */

function createCakeSpark(x,y){
  const spark = document.createElement("span");

  spark.textContent = "✦";
  spark.style.position = "fixed";
  spark.style.left = x + "px";
  spark.style.top = y + "px";
  spark.style.zIndex = "50";
  spark.style.pointerEvents = "none";
  spark.style.fontSize = "20px";

  document.body.appendChild(spark);

  spark.animate(
    [
      {opacity:1,transform:"scale(.5)"},
      {opacity:0,transform:"scale(2) translateY(-20px)"}
    ],
    {duration:800,easing:"ease-out"}
  );

  setTimeout(() => spark.remove(),800);
}

/* ---------- PUBLIC API ---------- */

window.MadziaCake = {
  reactFlamesToAir,
  blowCandles,
  resetCakeFlames,
  createCakeSpark
};

setupCake();
