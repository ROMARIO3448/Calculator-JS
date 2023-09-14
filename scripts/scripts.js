const calcScreenPlaceholder = document.querySelector(".calc__screen");

function blinkingAnimationFunction() {
    calcScreenPlaceholder.classList.toggle("calc__screen_blink");
    setTimeout(blinkingAnimationFunction, 500);
}

setTimeout(blinkingAnimationFunction, 500);
