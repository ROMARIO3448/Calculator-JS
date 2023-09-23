const calcScreenPlaceholder = document.querySelector(".input__placeholder");

function blinkingAnimationFunction() {
    calcScreenPlaceholder.classList.toggle("input__placeholder_blink");
    setTimeout(blinkingAnimationFunction, 500);
}

setTimeout(blinkingAnimationFunction, 500);

//TODO REFACTOR
let arrayOfWhenToUndoFontSize = [
    ["100px", 0, "120px"],
    ["80px", 0, "100px"],
];
const minFontSize = 80;
const maxFontSize = 120;
const stepOfFontSizeReducing = 20;
const calcScreenContainer = document.querySelector(".calc__screen");
const preventScrollPixelsBuffer = 100;
let formerHeightOfCalcScreenInputBoundingClientRect = null;
const changeFontSizeForCalcScreenInput = (flag = true) => {
    const currentFontSizeOfCalcScreenContainer =
        getComputedStyle(calcScreenInput);
    const calcScreenInputBoundingClientRect =
        calcScreenInput.getBoundingClientRect();
    let flagForFormerHeightOfCalcScreenInputBoundingClientRect = true;

    const hasHeightAutoChanged =
        formerHeightOfCalcScreenInputBoundingClientRect &&
        formerHeightOfCalcScreenInputBoundingClientRect !=
            calcScreenInputBoundingClientRect.height;

    //.calc__screen {padding: 0px 40px 40px 40px;} +20px buffer = total 100px
    if (flag) {
        if (
            calcScreenInputBoundingClientRect.width >=
                calcScreenContainer.clientWidth - preventScrollPixelsBuffer &&
            parseInt(currentFontSizeOfCalcScreenContainer.fontSize) >
                minFontSize
        ) {
            const newFontSize =
                parseInt(currentFontSizeOfCalcScreenContainer.fontSize) -
                stepOfFontSizeReducing +
                "px";
            calcScreenInput.style.fontSize = newFontSize;
            calcScreenPlaceholder.style.fontSize = newFontSize;
            //we need this only to notice auto size changes... not intentional changes
            flagForFormerHeightOfCalcScreenInputBoundingClientRect = false;
            switch (newFontSize) {
                case arrayOfWhenToUndoFontSize[0][0]:
                    arrayOfWhenToUndoFontSize[0][1] =
                        calcScreenInput.textContent.length;
                    break;
                case arrayOfWhenToUndoFontSize[1][0]:
                    arrayOfWhenToUndoFontSize[1][1] =
                        calcScreenInput.textContent.length;
                    break;
                default:
            }
        } else if (
            calcScreenInputBoundingClientRect.width >=
                calcScreenContainer.clientWidth - preventScrollPixelsBuffer &&
            parseInt(currentFontSizeOfCalcScreenContainer.fontSize) ===
                minFontSize
        ) {
            //implemet transition to a new line
        } else {
        }
    } //if flag
    else {
        if (
            arrayOfWhenToUndoFontSize[1][1] &&
            arrayOfWhenToUndoFontSize[1][1] > calcScreenInput.textContent.length
        ) {
            calcScreenInput.style.fontSize = arrayOfWhenToUndoFontSize[1][2];
            calcScreenPlaceholder.style.fontSize =
                arrayOfWhenToUndoFontSize[1][2];
            arrayOfWhenToUndoFontSize[1][1] = null;
            //we need this only to notice auto size changes... not intentional changes
            flagForFormerHeightOfCalcScreenInputBoundingClientRect = false;
        } else if (
            !arrayOfWhenToUndoFontSize[1][1] &&
            arrayOfWhenToUndoFontSize[0][1] &&
            arrayOfWhenToUndoFontSize[0][1] > calcScreenInput.textContent.length
        ) {
            calcScreenInput.style.fontSize = arrayOfWhenToUndoFontSize[0][2];
            calcScreenPlaceholder.style.fontSize =
                arrayOfWhenToUndoFontSize[0][2];
            arrayOfWhenToUndoFontSize[0][1] = null;
            //we need this only to notice auto size changes... not intentional changes
            flagForFormerHeightOfCalcScreenInputBoundingClientRect = false;
        }
    }

    if (flagForFormerHeightOfCalcScreenInputBoundingClientRect) {
        formerHeightOfCalcScreenInputBoundingClientRect =
            calcScreenInputBoundingClientRect.height;
    } else {
        formerHeightOfCalcScreenInputBoundingClientRect = null;
    }
};
//TODO REFACTOR

let calcScreenResultString = "";
let isFirstOperatorInExpression = false;

const arrayOfOperatorsWhichShouldNotFollowEachOther = [
    "*",
    "/",
    "+",
    "-",
    "%",
    ".",
];
const arrayOfOperators = ["*", "/", "+", "-", "%"];

const buttonsGridContainer = document.querySelector(".calc__buttons");
const calcScreenInput = document.querySelector(".input__main");
const calcScreenResult = document.querySelector(".screen__result");

const invalidFormatUsed = document.querySelector(".calc__invalid-operation");
const evalErrorHandler = () => {
    invalidFormatUsed.classList.add("calc__invalid-operation_visible");
    setTimeout(() => {
        invalidFormatUsed.classList.remove("calc__invalid-operation_visible");
    }, 1000);
};

const toolbarDeleteImg = document.querySelector(".toolbar__delete>img");
const toolbarGridContainer = document.querySelector(".calc__toolbar");
let flagForToolbar = false;
const toolbarDeleteImgHandler = (event) => {
    if (event.target.closest(".toolbar__delete>img")) {
        if (calcScreenResultString) {
            flagForToolbar = true;
            buttonsGridContainer.click();
        }
    }
};
const toolbarSwitchImgHandler = () => {
    if (!calcScreenResultString) {
        toolbarDeleteImg.src = "assets/delete.png";
    } else {
        toolbarDeleteImg.src = "assets/delete-active.png";
    }
};
toolbarGridContainer.addEventListener("click", toolbarDeleteImgHandler);

let changeInputColor = false;
const changeCalcScreenInputColor = () => {
    if (changeInputColor) {
        calcScreenInput.classList.remove("input__main_green");
        changeInputColor = false;
    }
};

const checkStillContainsOperators = () => {
    let stillContainsOperators = false;
    for (let i = 0; i < calcScreenResultString.length; i++) {
        stillContainsOperators = arrayOfOperators.includes(
            calcScreenResultString[i]
        );
        if (stillContainsOperators) {
            break;
        }
    }
    isFirstOperatorInExpression = stillContainsOperators;
};

const correctDisplayOfScreenResults = (flag, temporaryConcatChar = "") => {
    let condition;
    if (!flag) {
        //false for flagForToolbarFalseLogic
        condition =
            isFirstOperatorInExpression &&
            !arrayOfOperators.includes(
                calcScreenResultString.slice(-1).toString()
            );
    } else {
        //true for flagForToolbarTrueLogic
        condition =
            isFirstOperatorInExpression &&
            !arrayOfOperators.includes(temporaryConcatChar);
    }
    if (condition) {
        let tempFinalCalcScreenResultString;
        if (!flag) {
            tempFinalCalcScreenResultString = calcScreenResultString;
        } else {
            tempFinalCalcScreenResultString =
                calcScreenResultString + temporaryConcatChar;
        }
        try {
            calcScreenResult.textContent = eval(
                tempFinalCalcScreenResultString
            );
        } catch (error) {
            evalErrorHandler();
        }
    } else {
        calcScreenResult.textContent = "";
    }
};

const flagForToolbarFalseLogic = () => {
    calcScreenResultString = calcScreenResultString.slice(0, -1);
    flagForToolbar = false;

    changeCalcScreenInputColor();
    checkStillContainsOperators();

    correctDisplayOfScreenResults(false);

    toolbarSwitchImgHandler();

    calcScreenInput.textContent = calcScreenResultString;
    changeFontSizeForCalcScreenInput(false);
};

const areOperatorsFollowEachOther = (temporaryConcatChar) => {
    if (
        arrayOfOperatorsWhichShouldNotFollowEachOther.includes(
            temporaryConcatChar
        ) &&
        arrayOfOperatorsWhichShouldNotFollowEachOther.includes(
            calcScreenResultString.slice(-1).toString()
        )
    ) {
        calcScreenResultString = calcScreenResultString.slice(0, -1);
    }
};

const equalButtonHandler = () => {
    if (isFirstOperatorInExpression) {
        try {
            calcScreenInput.textContent = eval(calcScreenResultString);
            calcScreenResultString = eval(calcScreenResultString).toString();
            calcScreenResult.textContent = "";
            isFirstOperatorInExpression = false;
            calcScreenInput.classList.add("input__main_green");
            changeInputColor = true;
        } catch (error) {
            evalErrorHandler();
        }
    }
};

const clearButtonHandler = () => {
    calcScreenResultString = "";
    isFirstOperatorInExpression = false;
    calcScreenResult.textContent = "";
    calcScreenInput.textContent = "";
    toolbarDeleteImg.src = "assets/delete.png";
};

const listOfNotImplementedButtons = ["+/-", "()"];

const flagForToolbarTrueLogic = (event) => {
    changeCalcScreenInputColor();

    if (event.target.classList.contains("button__item_unique-equal")) {
        equalButtonHandler();
        return;
    }

    let temporaryConcatChar =
        event.target.textContent.trim() === "÷"
            ? "/"
            : event.target.textContent.trim() === "x"
            ? "*"
            : event.target.textContent.trim() === ","
            ? "."
            : event.target.textContent.trim();

    if (temporaryConcatChar === "C") {
        clearButtonHandler();
        return;
    }

    if (listOfNotImplementedButtons.includes(temporaryConcatChar)) {
        window.alert("This feature is not implemented yet :(");
        return;
    }

    areOperatorsFollowEachOther(temporaryConcatChar);

    //avoid only operators in string
    if (
        arrayOfOperators.includes(temporaryConcatChar) &&
        !calcScreenResultString.slice(-1).toString()
    ) {
        temporaryConcatChar = "";
        evalErrorHandler();
    }

    correctDisplayOfScreenResults(true, temporaryConcatChar);

    if (arrayOfOperators.includes(temporaryConcatChar)) {
        isFirstOperatorInExpression = true;
    }

    calcScreenResultString += temporaryConcatChar;

    toolbarSwitchImgHandler();

    calcScreenInput.textContent = calcScreenResultString;

    changeFontSizeForCalcScreenInput();
};

const calcLogicHandler = (event) => {
    if (!event.target.classList.contains("button__item") && !flagForToolbar) {
        return;
    }
    if (flagForToolbar) {
        flagForToolbarFalseLogic();
    } else {
        flagForToolbarTrueLogic(event);
    }
};

buttonsGridContainer.addEventListener("click", calcLogicHandler);
