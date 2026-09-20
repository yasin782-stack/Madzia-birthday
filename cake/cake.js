
/* =========================================================
   MADZIA BIRTHDAY — CAKE JAVASCRIPT
========================================================= */


/* =========================================================
   CAKE ELEMENTS
========================================================= */

const cakeComponent =
    document.getElementById("birthdayCake");

const cakeFlames =
    document.querySelectorAll(
        "#birthdayCake .flame"
    );

const cakeCandles =
    document.querySelectorAll(
        "#birthdayCake .candle"
    );


/* =========================================================
   CAKE STATE
========================================================= */

let cakeReady = false;
let cakeTiltX = 0;
let cakeTiltY = 0;


/* =========================================================
   INITIALIZE
========================================================= */

function initializeCake() {

    if (!cakeComponent) {
        return;
    }

    cakeReady = true;

    setupCakeTilt();

    setupCakePointerEffects();

}


/* =========================================================
   3D CAKE TILT
========================================================= */

function setupCakeTilt() {

    if (!cakeComponent) {
        return;
    }


    cakeComponent.addEventListener(
        "pointermove",
        event => {

            const wrapper =
                cakeComponent.querySelector(
                    ".cake-wrapper"
                );

            if (!wrapper) {
                return;
            }


            const rect =
                cakeComponent.getBoundingClientRect();


            const x =
                event.clientX -
                rect.left;


            const y =
                event.clientY -
                rect.top;


            const centerX =
                rect.width / 2;


            const centerY =
                rect.height / 2;


            cakeTiltY =
                ((x - centerX) / centerX) * 5;


            cakeTiltX =
                ((centerY - y) / centerY) * 4;


            wrapper.style.transform =
                `rotateX(${cakeTiltX}deg)
                 rotateY(${cakeTiltY}deg)`;
        }
    );


    cakeComponent.addEventListener(
        "pointerleave",
        () => {

            const wrapper =
                cakeComponent.querySelector(
                    ".cake-wrapper"
                );

            if (!wrapper) {
                return;
            }


            wrapper.style.transform =
                "rotateX(0deg) rotateY(0deg)";
        }
    );
}


/* =========================================================
   CAKE POINTER EFFECTS
========================================================= */

function setupCakePointerEffects() {

    if (!cakeComponent) {
        return;
    }


    cakeComponent.addEventListener(
        "pointerdown",
        event => {

            if (
                event.target.closest(
                    "button"
                )
            ) {
                return;
            }


            createCakeSpark(
                event.clientX,
                event.clientY
            );
        }
    );
}


/* =========================================================
   CAKE SPARK
========================================================= */

function createCakeSpark(
    x,
    y
) {

    const spark =
        document.createElement(
            "span"
        );

    spark.className =
        "cake-spark";

    spark.textContent =
        "✦";

    spark.style.left =
        x + "px";

    spark.style.top =
        y + "px";


    document.body.appendChild(
        spark
    );


    setTimeout(() => {

        spark.remove();

    }, 900);
}


/* =========================================================
   CANDLE FLAME REACTION
========================================================= */

function reactFlamesToAir(
    intensity
) {

    if (
        !cakeFlames ||
        cakeFlames.length === 0
    ) {
        return;
    }


    const clamped =
        Math.min(
            Math.max(
                intensity,
                0
            ),
            1
        );


    cakeFlames.forEach(
        (flame, index) => {

            const direction =
                index % 2 === 0
                    ? -1
                    : 1;


            const rotation =
                direction *
                clamped *
                22;


            const scaleX =
                1 -
                clamped * 0.25;


            const scaleY =
                1 +
                clamped * 0.25;


            flame.style.transform =
                `translateX(-50%)
                 rotate(${rotation}deg)
                 scale(${scaleX}, ${scaleY})`;
        }
    );
}


/* =========================================================
   RESET FLAMES
========================================================= */

function resetCakeFlames() {

    cakeFlames.forEach(
        flame => {

            flame.classList.remove(
                "blown-out"
            );


            flame.style.transform =
                "";
        }
    );
}


/* =========================================================
   CAKE CELEBRATION GLOW
========================================================= */

function cakeCelebrationGlow() {

    if (!cakeComponent) {
        return;
    }


    cakeComponent.classList.add(
        "cake-celebrating"
    );


    setTimeout(() => {

        cakeComponent.classList.remove(
            "cake-celebrating"
        );

    }, 2500);
}


/* =========================================================
   CAKE MESSAGE HELPER
========================================================= */

function showCakeMessage(
    message
) {

    const element =
        document.getElementById(
            "cakeMessage"
        );

    if (!element) {
        return;
    }


    element.textContent =
        message;


    element.classList.add(
        "show"
    );
}


/* =========================================================
   CAKE CONTINUE HELPER
========================================================= */

function enableCakeContinue() {

    const button =
        document.getElementById(
            "cakeContinue"
        );

    if (!button) {
        return;
    }


    button.classList.add(
        "show"
    );
}


/* =========================================================
   GLOBAL CAKE HELPERS
========================================================= */

window.MadziaCake = {

    spark: createCakeSpark,

    reactFlames:
        reactFlamesToAir,

    resetFlames:
        resetCakeFlames,

    celebration:
        cakeCelebrationGlow,

    message:
        showCakeMessage,

    continue:
        enableCakeContinue

};


/* =========================================================
   INITIALIZE AFTER PAGE LOAD
========================================================= */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeCake
    );

}
else {

    initializeCake();

}
