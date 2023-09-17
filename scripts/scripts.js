const calcScreenPlaceholder = document.querySelector(".input__placeholder");

function blinkingAnimationFunction() {
    calcScreenPlaceholder.classList.toggle("input__placeholder_blink");
    setTimeout(blinkingAnimationFunction, 500);
}

setTimeout(blinkingAnimationFunction, 500);

const toolbarDeleteImg = document.querySelector(".toolbar__delete>img");

const switchToolbarDeleteImgState = () => {
    if (!calcScreenResultString) {
        toolbarDeleteImg.src = "assets/delete.png";
    } else {
        toolbarDeleteImg.src = "assets/delete-active.png";
    }
};

const correctDisplayOfScreenResult = () => {};

//global vars
let calcScreenResultString = "";
let isFirstOperatorInExpression = false;

//buttons implementation
const arrayOfOperators = ["*", "/", "+", "-", "%", "."];
const buttonsGridContainer = document.querySelector(".calc__buttons");
const calcScreenResult = document.querySelector(".screen__result");
const calcScreenInput = document.querySelector(".input__main");
buttonsGridContainer.addEventListener("click", (event) => {
    if (!event.target.classList.contains("button__item")) {
        return;
    }
    if (event.target.classList.contains("button__item_unique-equal")) {
        try {
            calcScreenResult.textContent = eval(calcScreenResultString);
        } catch (error) {
            //Here I should implement custom css "Invalid format used" alarm
        }
        return;
    }
    let temporaryConcatChar =
        event.target.textContent.trim() === "÷"
            ? "/"
            : event.target.textContent.trim() === "x"
            ? "*"
            : event.target.textContent.trim() === ","
            ? "."
            : event.target.textContent.trim() === "C"
            ? ""
            : event.target.textContent.trim();

    //in this block we exclude the possibility of adding multiple operands in a row
    if (
        arrayOfOperators.includes(temporaryConcatChar) &&
        arrayOfOperators.includes(calcScreenResultString.slice(-1).toString())
    ) {
        calcScreenResultString = calcScreenResultString.slice(0, -1);
    }
    //if the current value contains an operand and the previous value contains an operand
    //then we delete the previous value

    //one more check
    //if the current value is equal to the operand, and the previous is an empty string, then
    //avoid the situation in the line of operations where there will be only operands
    if (
        arrayOfOperators.includes(temporaryConcatChar) &&
        !calcScreenResultString.slice(-1).toString()
    ) {
        temporaryConcatChar = "";
        //Here I should implement custom css "Invalid format used" alarm
    }
    //

    //block correctDisplayOfScreenResult
    if (arrayOfOperators.includes(temporaryConcatChar)) {
        isFirstOperatorInExpression = true;
    }
    if (
        isFirstOperatorInExpression &&
        temporaryConcatChar &&
        !arrayOfOperators.includes(temporaryConcatChar)
    ) {
        try {
            calcScreenResult.textContent = eval(calcScreenResultString);
        } catch (error) {
            //Here I should implement custom css "Invalid format used" alarm
        }
    }
    //end block correctDisplayOfScreenResult

    if (temporaryConcatChar) {
        calcScreenResultString += temporaryConcatChar;
    } else {
        calcScreenResultString = "";
    }

    switchToolbarDeleteImgState();
    calcScreenInput.textContent = calcScreenResultString;
});
