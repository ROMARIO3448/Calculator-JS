const calcScreenPlaceholder = document.querySelector(".input__placeholder");

function blinkingAnimationFunction() {
    calcScreenPlaceholder.classList.toggle("input__placeholder_blink");
    setTimeout(blinkingAnimationFunction, 500);
}

setTimeout(blinkingAnimationFunction, 500);
