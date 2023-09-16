const calcScreenPlaceholder = document.querySelector(".input__placeholder");

function blinkingAnimationFunction() {
    calcScreenPlaceholder.classList.toggle("input__placeholder_blink");
    setTimeout(blinkingAnimationFunction, 500);
}

setTimeout(blinkingAnimationFunction, 500);

//buttons implementation
let calcScreenResultString = "";
const arrayOfOperators = ["*", "/", "+", "-", "%", "."];
const buttonsGridContainer = document.querySelector(".calc__buttons");
const calcScreenResult = document.querySelector(".screen__result");
const calcScreenInput = document.querySelector(".input__main");
buttonsGridContainer.addEventListener("click", (event) => {
    if (!event.target.classList.contains("button__item")) {
        return;
    }
    if (event.target.classList.contains("button__item_unique-equal")) {
        calcScreenResult.textContent = eval(calcScreenResultString);
        return;
    }
    const temporaryConcatValue =
        event.target.textContent.trim() === "÷"
            ? "/"
            : event.target.textContent.trim() === "x"
            ? "*"
            : event.target.textContent.trim() === ","
            ? "."
            : event.target.textContent.trim() === "C"
            ? ""
            : event.target.textContent.trim();
    if (
        arrayOfOperators.includes(temporaryConcatValue) &&
        arrayOfOperators.includes(calcScreenResultString.slice(-1).toString())
    ) {
        return;
    }
    if (temporaryConcatValue) {
        calcScreenResultString += temporaryConcatValue;
    } else {
        calcScreenResultString = "";
    }
    calcScreenInput.textContent = calcScreenResultString;
    calcScreenResult.textContent = "";
});
