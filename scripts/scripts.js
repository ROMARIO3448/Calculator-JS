const calcScreenPlaceholder = document.querySelector(".input__placeholder");

function blinkingAnimationFunction() {
    calcScreenPlaceholder.classList.toggle("input__placeholder_blink");
    setTimeout(blinkingAnimationFunction, 500);
}

setTimeout(blinkingAnimationFunction, 500);

const toolbarDeleteImg = document.querySelector(".toolbar__delete>img");

const isToolbarDeleteImgActive = () => {
    if (calcScreenResultString) {
        toolbarDeleteImg.src = "assets/delete.png";
    } else {
        toolbarDeleteImg.src = "assets/delete-active.png";
    }
};

//global var
let calcScreenResultString = "";

//buttons implementation
const arrayOfOperators = ["*", "/", "+", "-", "%", "."];
const buttonsGridContainer = document.querySelector(".calc__buttons");
const calcScreenResult = document.querySelector(".screen__result");
const calcScreenInput = document.querySelector(".input__main");
buttonsGridContainer.addEventListener("click", (event) => {
    if (!event.target.classList.contains("button__item")) {
        return;
    }
    isToolbarDeleteImgActive();
    if (event.target.classList.contains("button__item_unique-equal")) {
        try {
            calcScreenResult.textContent = eval(calcScreenResultString);
        } catch (error) {}
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
        calcScreenResultString = calcScreenResultString.slice(0, -1);
    }
    if (temporaryConcatValue) {
        calcScreenResultString += temporaryConcatValue;
    } else {
        calcScreenResultString = "";
    }
    calcScreenInput.textContent = calcScreenResultString;
    calcScreenResult.textContent = "";
});
