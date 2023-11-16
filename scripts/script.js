/*Dynamic adaptive section*/
const container = document.querySelector("._container");
const calcScreen = document.querySelector(".calc__screen");
const calcToolbar = document.querySelector(".calc__toolbar");
const calcButtons = document.querySelector(".calc__buttons");
const calcInvalidOperation = document.querySelector(".calc__invalid-operation");

/*const setFontSizeAndPaddingDependingOnContainerWidth = () => {
    const ratioBetweenContainerWidthAndFontSizeForCalcScreen = 120 / 1080;
    const ratioBetweenContainerWidthAndFontSizeForCalcToolbar = 100 / 1080;
    const ratioBetweenContainerWidthAndFontSizeForCalcButtons = 100 / 1080;
    const ratioBetweenContainerWidthAndContainerPadding = 128 / 1080;
    const ratioBetweenContainerWidthAndFontSizeForCalcInvalidOperation =
        55 / 1080;

    const newConatinerPadding =
        (container.clientWidth *
            ratioBetweenContainerWidthAndContainerPadding) /
            2 +
        "px";

    container.style.paddingLeft = newConatinerPadding;
    container.style.paddingRight = newConatinerPadding;

    calcScreen.style.fontSize =
        container.clientWidth *
            ratioBetweenContainerWidthAndFontSizeForCalcScreen +
        "px";
    calcToolbar.style.fontSize =
        container.clientWidth *
            ratioBetweenContainerWidthAndFontSizeForCalcToolbar +
        "px";
    calcButtons.style.fontSize =
        container.clientWidth *
            ratioBetweenContainerWidthAndFontSizeForCalcButtons +
        "px";
    calcInvalidOperation.style.fontSize =
        container.clientWidth *
            ratioBetweenContainerWidthAndFontSizeForCalcInvalidOperation +
        "px";
};

window.addEventListener(
    "resize",
    setFontSizeAndPaddingDependingOnContainerWidth
);

setFontSizeAndPaddingDependingOnContainerWidth();*/
/*End of dynamic adaptive*/

const calcScreenPlaceholder = document.querySelector(".input__placeholder");

function blinkingAnimationFunction() {
    calcScreenPlaceholder.classList.toggle("input__placeholder_blink");
}

setInterval(blinkingAnimationFunction, 500);

const calcScreenInput = document.querySelector(".input__main");
const calcScreenResult = document.querySelector(".screen__result");

const regexpListOfOperators = /[/\-+*%]/;
const regexpDivideByZero = /\/0/;

const arrayOfOperators = ["*", "/", "+", "-", "%"];
const arrayOfOperatorsWhichShouldNotFollowEachOther = [
    "*",
    "/",
    "+",
    "-",
    "%",
    ".",
];

const invalidOperationsList = ["Invalid format used.", "Can't divide by zero."];
const evalErrorHandler = (invalidOperationName = invalidOperationsList[0]) => {
    calcInvalidOperation.textContent = invalidOperationName;
    calcInvalidOperation.classList.add("calc__invalid-operation_visible");
    setTimeout(() => {
        calcInvalidOperation.classList.remove(
            "calc__invalid-operation_visible"
        );
    }, 1000);
};

const arrayOfWhenToUndoFontSize = [
    ["100px", null, "120px"],
    ["80px", null, "100px"],
];
const arrayOfWhenToUndoNewLine = [];
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
    arrayOfWhenToUndoNewLine.push(calcScreenInput.textContent.length);
};
const undoNewLineHandler = () => {
    if (arrayOfWhenToUndoNewLine.length === 0) {
        return;
    }
    if (
        arrayOfWhenToUndoNewLine[arrayOfWhenToUndoNewLine.length - 1] >
        calcScreenInput.textContent.length
    ) {
        arrayOfWhenToUndoNewLine.pop();
        const lastIndexOfBr = calcScreenInput.innerHTML.lastIndexOf("<br>");
        if (lastIndexOfBr + 4 === calcScreenInput.innerHTML.length) {
            calcScreenInput.innerHTML = calcScreenInput.innerHTML
                .toString()
                .slice(0, lastIndexOfBr);
            return;
        }
        calcScreenInput.innerHTML =
            calcScreenInput.innerHTML.toString().slice(0, lastIndexOfBr) +
            calcScreenInput.textContent
                .toString()
                .slice(lastIndexOfBr + 4 - calcScreenInput.innerHTML.length);
    }
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
                calcScreen.clientWidth - preventScrollPixelsBuffer &&
            parseInt(currentFontSizeOfCalcScreenContainer.fontSize) >
                minFontSize
        ) {
            calcScreenOverflovHandler(currentFontSizeOfCalcScreenContainer);
        } else if (
            calcScreenInputBoundingClientRect.width >=
                calcScreen.clientWidth - preventScrollPixelsBuffer &&
            parseInt(currentFontSizeOfCalcScreenContainer.fontSize) ===
                minFontSize
        ) {
            calcScreenOverflovMinFontSizeHandler();
        }
    } else {
        undoFontSizeHandler();
        undoNewLineHandler();
    }
};

const toolbarScientificModeImg = document.querySelector(
    ".toolbar__scientific-mode>img"
);
const calcContainer = document.querySelector(".calc__container");
const toolbarDeleteImg = document.querySelector(".toolbar__delete>img");
let flagForToolbar = false;
const toolbarDeleteImgHandler = (event) => {
    if (event.target.closest(".toolbar__delete>img")) {
        if (calcScreenInput.textContent) {
            flagForToolbar = true;
            calcButtons.click();
        }
    } else if (event.target.closest(".toolbar__scientific-mode>img")) {
        redirectAfterRotation();
    }
};
const toolbarSwitchImgHandler = () => {
    if (!calcScreenInput.textContent) {
        toolbarDeleteImg.src = "assets/delete.png";
    } else {
        toolbarDeleteImg.src = "assets/delete-active.png";
    }
};
const redirectAfterRotation = () => {
    calcContainer.classList.add("calc__container_rotation");
    //temporary solution
    setTimeout(() => {
        window.location.href = "./scientific-mode.html";
    }, 250);

    //TODO sometimes the rotation hasn't ended but redirection had already started
    //it is necessary to fix this before uncommenting the following code
    /*calcContainer.addEventListener(
        "transitionend",
        () => {
            window.location.href = "./scientific-mode.html";
        },
        {
            once: true,
        }
    );*/
};
calcToolbar.addEventListener("click", toolbarDeleteImgHandler);
let isToolbarDeleteImgActive = false;
const emulateClick = () => {
    let timeId = setTimeout(emulateClick, 50);
    if (!isToolbarDeleteImgActive) {
        clearTimeout(timeId);
    } else {
        toolbarDeleteImg.click();
    }
};
calcToolbar.addEventListener("mousedown", (event) => {
    if (event.target.closest(".toolbar__delete>img")) {
        isToolbarDeleteImgActive = true;
        setTimeout(emulateClick, 500);
    }
});
calcContainer.addEventListener("mouseup", () => {
    isToolbarDeleteImgActive = false;
});
calcContainer.addEventListener("mouseleave", () => {
    isToolbarDeleteImgActive = false;
});

let isFirstOperatorInExpression = false;
const checkStillContainsOperators = () => {
    isFirstOperatorInExpression = regexpListOfOperators.test(
        calcScreenInput.textContent.toString()
    );
};

const regexpAllowDivideByZeroIf = [/0\.[1-9]{1,}/, /0\.0{1,}[1-9]{1,}/];
const allowDivideByZeroIf = (temporaryConcatChar = "") => {
    const arrayOfNumbers = (calcScreenInput.textContent + temporaryConcatChar)
        .toString()
        .split(regexpListOfOperators);
    return arrayOfNumbers.some((elem) => {
        return (
            regexpAllowDivideByZeroIf[0].test(elem) ||
            regexpAllowDivideByZeroIf[1].test(elem)
        );
    });
};
const correctDisplayOfScreenResults = (flag, temporaryConcatChar = "") => {
    //prevent calcScreenResult output if /0 is in expression
    if (
        regexpDivideByZero.test(calcScreenInput.textContent.toString()) ||
        regexpDivideByZero.test(
            calcScreenInput.textContent.toString() + temporaryConcatChar
        )
    ) {
        if (allowDivideByZeroIf(temporaryConcatChar)) {
        } else {
            calcScreenResult.textContent = "";
            return;
        }
    }

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

const ifOperatorConctatElseClear = (event) => {
    if (event.target.textContent.trim() === "=") {
        //TODO behaviour in samsung calculator is different
        //if input was 3+5+1 and you press equal, the result
        //will be 9 and every next equal will add 1 to the result
        return;
    }
    if (changeInputColor) {
        let temporaryChar =
            event.target.textContent.trim() === "÷"
                ? "/"
                : event.target.textContent.trim() === "x"
                ? "*"
                : event.target.textContent.trim();
        if (event.target.textContent.trim() === ",") {
            calcScreenInput.textContent = "0";
            return;
        }
        if (regexpListOfOperators.test(temporaryChar)) {
            return;
        } else {
            calcScreenInput.textContent = "";
        }
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
        if (
            regexpDivideByZero.test(calcScreenInput.textContent.toString()) &&
            !allowDivideByZeroIf()
        ) {
            evalErrorHandler(invalidOperationsList[1]);
        } else {
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

const avoidInvalidNumbersAndOperations = (temporaryConcatChar) => {
    const arrayOfNumbers = (calcScreenInput.textContent + temporaryConcatChar)
        .toString()
        .split(regexpListOfOperators);
    return arrayOfNumbers.some((elem) => {
        return /^0\d/.test(elem) || /^-{0,}\d{1,}\.{1,}\d{1,}\.{1,}/.test(elem);
    });
};

const listOfNotImplementedButtons = ["+/-", "()"];

const flagForToolbarTrueLogic = (event) => {
    ifOperatorConctatElseClear(event);
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

    temporaryConcatChar = avoidInvalidNumbersAndOperations(temporaryConcatChar)
        ? ""
        : temporaryConcatChar;

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

calcButtons.addEventListener("click", calcLogicHandler);
