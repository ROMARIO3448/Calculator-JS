const calcScreenPlaceholder = document.querySelector(".input__placeholder");

function blinkingAnimationFunction() {
    calcScreenPlaceholder.classList.toggle("input__placeholder_blink");
}

setInterval(blinkingAnimationFunction, 500);

const buttonsGridContainer = document.querySelector(".calc__buttons");
const calcScreenInput = document.querySelector(".input__main");
const calcScreenResult = document.querySelector(".screen__result");
const calcScreenContainer = document.querySelector(".calc__screen");

const arrayOfOperators = ["*", "/", "+", "-", "%"];
const arrayOfOperatorsWhichShouldNotFollowEachOther = [
    "*",
    "/",
    "+",
    "-",
    "%",
    ".",
];

const invalidFormatUsed = document.querySelector(".calc__invalid-operation");
const evalErrorHandler = () => {
    invalidFormatUsed.classList.add("calc__invalid-operation_visible");
    setTimeout(() => {
        invalidFormatUsed.classList.remove("calc__invalid-operation_visible");
    }, 1000);
};

const arrayOfWhenToUndoFontSize = [
    ["100px", null, "120px"],
    ["80px", null, "100px"],
];
const minFontSize = 80;
const maxFontSize = 120;
const stepOfFontSizeReducing = 20;
const preventScrollPixelsBuffer = 100;
const calcScreenOverflovHandler = (currentFontSizeOfCalcScreenContainer) => {
    const newFontSize =
        parseInt(currentFontSizeOfCalcScreenContainer.fontSize) -
        stepOfFontSizeReducing +
        "px";
    calcScreenInput.style.fontSize = newFontSize;
    calcScreenPlaceholder.style.fontSize = newFontSize;
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
};
const calcScreenOverflovMinFontSizeHandler = () => {
    let indexOfLastOperator = -1;
    arrayOfOperators.forEach((value) => {
        const tempIndexOfLastOperator =
            calcScreenInput.textContent.lastIndexOf(value);
        indexOfLastOperator =
            tempIndexOfLastOperator > indexOfLastOperator
                ? tempIndexOfLastOperator
                : indexOfLastOperator;
    });

    let sliceNum =
        indexOfLastOperator > -1
            ? indexOfLastOperator - calcScreenInput.textContent.length
            : indexOfLastOperator;

    const tempVar = calcScreenInput.textContent.toString().slice(sliceNum);
    calcScreenInput.innerHTML = calcScreenInput.innerHTML
        .toString()
        .slice(0, sliceNum);
    calcScreenInput.insertAdjacentHTML("beforeend", `<br/>${tempVar}`);
};
const undoFontSizeHandler = () => {
    if (
        arrayOfWhenToUndoFontSize[1][1] &&
        arrayOfWhenToUndoFontSize[1][1] > calcScreenInput.textContent.length
    ) {
        calcScreenInput.style.fontSize = arrayOfWhenToUndoFontSize[1][2];
        calcScreenPlaceholder.style.fontSize = arrayOfWhenToUndoFontSize[1][2];
        arrayOfWhenToUndoFontSize[1][1] = null;
    } else if (
        !arrayOfWhenToUndoFontSize[1][1] &&
        arrayOfWhenToUndoFontSize[0][1] &&
        arrayOfWhenToUndoFontSize[0][1] > calcScreenInput.textContent.length
    ) {
        calcScreenInput.style.fontSize = arrayOfWhenToUndoFontSize[0][2];
        calcScreenPlaceholder.style.fontSize = arrayOfWhenToUndoFontSize[0][2];
        arrayOfWhenToUndoFontSize[0][1] = null;
    }
};
const changeFontSizeForCalcScreenInput = (flag = true) => {
    const currentFontSizeOfCalcScreenContainer =
        getComputedStyle(calcScreenInput);
    const calcScreenInputBoundingClientRect =
        calcScreenInput.getBoundingClientRect();
    if (flag) {
        if (
            calcScreenInputBoundingClientRect.width >=
                calcScreenContainer.clientWidth - preventScrollPixelsBuffer &&
            parseInt(currentFontSizeOfCalcScreenContainer.fontSize) >
                minFontSize
        ) {
            calcScreenOverflovHandler(currentFontSizeOfCalcScreenContainer);
        } else if (
            calcScreenInputBoundingClientRect.width >=
                calcScreenContainer.clientWidth - preventScrollPixelsBuffer &&
            parseInt(currentFontSizeOfCalcScreenContainer.fontSize) ===
                minFontSize
        ) {
            calcScreenOverflovMinFontSizeHandler();
        }
    } else {
        undoFontSizeHandler();
    }
};

const toolbarDeleteImg = document.querySelector(".toolbar__delete>img");
const toolbarGridContainer = document.querySelector(".calc__toolbar");
let flagForToolbar = false;
const toolbarDeleteImgHandler = (event) => {
    if (event.target.closest(".toolbar__delete>img")) {
        if (calcScreenInput.textContent) {
            flagForToolbar = true;
            buttonsGridContainer.click();
        }
    }
};
const toolbarSwitchImgHandler = () => {
    if (!calcScreenInput.textContent) {
        toolbarDeleteImg.src = "assets/delete.png";
    } else {
        toolbarDeleteImg.src = "assets/delete-active.png";
    }
};
toolbarGridContainer.addEventListener("click", toolbarDeleteImgHandler);

let isFirstOperatorInExpression = false;
const checkStillContainsOperators = () => {
    isFirstOperatorInExpression = /[*+-/%]/.test(
        calcScreenInput.textContent.toString()
    );
};

const correctDisplayOfScreenResults = (flag, temporaryConcatChar = "") => {
    let condition;
    if (!flag) {
        condition =
            isFirstOperatorInExpression &&
            !arrayOfOperators.includes(calcScreenInput.textContent.slice(-1));
    } else {
        condition =
            isFirstOperatorInExpression &&
            !arrayOfOperators.includes(temporaryConcatChar);
    }
    if (condition) {
        let tempFinalCalcScreenResultString;
        if (!flag) {
            tempFinalCalcScreenResultString = calcScreenInput.textContent;
        } else {
            tempFinalCalcScreenResultString =
                calcScreenInput.textContent + temporaryConcatChar;
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

let changeInputColor = false;
const changeCalcScreenInputColor = () => {
    if (changeInputColor) {
        calcScreenInput.classList.remove("input__main_green");
        changeInputColor = false;
    }
};

const flagForToolbarFalseLogic = () => {
    calcScreenInput.innerHTML = calcScreenInput.innerHTML
        .toString()
        .slice(0, -1);
    if (/<br>$/.test(calcScreenInput.innerHTML.toString())) {
        calcScreenInput.innerHTML = calcScreenInput.innerHTML
            .toString()
            .slice(0, -4);
    }

    flagForToolbar = false;

    changeCalcScreenInputColor();

    checkStillContainsOperators();

    correctDisplayOfScreenResults(false);

    changeFontSizeForCalcScreenInput(false);
    toolbarSwitchImgHandler();
};

const areOperatorsFollowEachOther = (temporaryConcatChar) => {
    if (
        arrayOfOperatorsWhichShouldNotFollowEachOther.includes(
            temporaryConcatChar
        ) &&
        arrayOfOperatorsWhichShouldNotFollowEachOther.includes(
            calcScreenInput.textContent.slice(-1)
        )
    ) {
        calcScreenInput.innerHTML = calcScreenInput.innerHTML.slice(0, -1);
    }
};

const equalButtonHandler = () => {
    if (isFirstOperatorInExpression) {
        try {
            calcScreenInput.textContent = eval(calcScreenInput.textContent);
            calcScreenResult.textContent = "";
            isFirstOperatorInExpression = false;
            calcScreenInput.classList.add("input__main_green");
            changeInputColor = true;
            arrayOfWhenToUndoFontSize[0][1] = null;
            arrayOfWhenToUndoFontSize[1][1] = null;
            calcScreenInput.style.fontSize = maxFontSize + "px";
            calcScreenPlaceholder.style.fontSize = maxFontSize + "px";
        } catch (error) {
            evalErrorHandler();
        }
    }
};

const clearButtonHandler = () => {
    isFirstOperatorInExpression = false;
    calcScreenResult.textContent = "";
    calcScreenInput.textContent = "";
    toolbarDeleteImg.src = "assets/delete.png";
    arrayOfWhenToUndoFontSize[0][1] = null;
    arrayOfWhenToUndoFontSize[1][1] = null;
    calcScreenInput.style.fontSize = maxFontSize + "px";
    calcScreenPlaceholder.style.fontSize = maxFontSize + "px";
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

    //avoid only operators in the string
    if (
        arrayOfOperators.includes(temporaryConcatChar) &&
        !calcScreenInput.textContent.slice(-1)
    ) {
        temporaryConcatChar = "";
        evalErrorHandler();
    }

    correctDisplayOfScreenResults(true, temporaryConcatChar);

    if (arrayOfOperators.includes(temporaryConcatChar)) {
        isFirstOperatorInExpression = true;
    }

    calcScreenInput.insertAdjacentHTML("beforeend", `${temporaryConcatChar}`);

    changeFontSizeForCalcScreenInput();
    toolbarSwitchImgHandler();
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
