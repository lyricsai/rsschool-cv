const input = document.querySelector("#input__numbers");
const ac = document.querySelector(".ac");
const del = document.querySelector(".del");
const equal = document.querySelector(".equal");

const numbers = Array.from(document.querySelectorAll(".num"));
const actions = Array.from(document.querySelectorAll(".action"));

let calculation = {
    first: null,
    second: null,
    result: null,
    action: null,
    cacheAction: null,
    cacheResult: null,
};

const clear = () => {
    calculation.first = null;
    calculation.second = null;
    calculation.action = null;
};

const allClear = () => {
    input.value = "";
    clear();
    calculation.cacheAction = null;
    calculation.result = null;
    console.log(calculation);
};

const deleteNumbers = () => {
    calculation.first
        ? (calculation.second = null)
        : (calculation.action = null);

    calculation.action = null;
    input.value = calculation.first || "";
    console.log(calculation);
};

const appendNumber = (symbol) => {
    // if (
    //     input.value.length > 1 &&
    //     symbol.innerText !== "." &&
    //     input.value[0] === "0"
    // ) {
    //     input.value = symbol.innerText;
    // } else
    if (calculation.cacheResult) {
        calculation.first = symbol.innerText;
        input.value = symbol.innerText;
        calculation.cacheResult = null;
    } else if (calculation.result) {
        calculation.first = calculation.result;
        calculation.result = null;
        input.value += symbol.innerText;
        updateDisplay();
    } else {
        input.value += symbol.innerText;
    }
};

const compute = ({ action, first, second }) => {
    if (first && second) {
        switch (action) {
            case "+":
                return +first + +second;
            case "-":
                return first - second;
            case "*":
                return first * second;
            case "÷":
                return first / second;
            default:
                return;
        }
    } else {
        return;
    }
};

const updateDisplay = () => {
    // if (calculation.first && !calculation.second && calculation.cacheAction) {
    //     return;
    // }
    if (!calculation.first) {
        calculation.first = input.value;
        console.log("first update", calculation);
    } else {
        calculation.second = input.value.substring(
            calculation.first.length + 1
        );
        console.log("up", calculation);
        input.value = compute(calculation);
        // calculation.result = input.value;
        clear();
        calculation.action = calculation.cacheAction;
        console.log("result", calculation);
    }
};

const equalRes = (vals) => {
    updateDisplay();
    console.log("eq", calculation);

    if (!calculation.second) {
        return;
    }

    input.value = compute(vals);
    console.log(calculation);
    clear();
    calculation.cacheResult = compute(vals);
    return calculation.cacheResult;
};

ac.addEventListener("click", allClear);

numbers.forEach((num) => {
    num.addEventListener("click", ({ target }) => appendNumber(target));
});

actions.forEach((act) => {
    act.addEventListener("click", ({ target }) => {
        if (calculation.action && calculation.first && !calculation.second) {
            calculation.cacheAction = target.innerText;
            input.value = calculation.first + calculation.cacheAction;
            calculation.cacheAction = null;
        }
        // repeat action
        else if (calculation.result) {
            calculation.first = calculation.result;
            calculation.result = null;
            calculation.second = null;
            calculation.action = target.innerText;
            updateDisplay();
            console.log(calculation);

            // no action
        } else if (!calculation.action && input.value.match(/[+\-÷\*]/)) {
            return;

            //first action
        } else if (!calculation.action) {
            //NaN or '' values
            if (isNaN(+input.value) || !input.value) {
                console.log("nan", isNaN(+input.value));
                console.log(calculation);
                return;

                // change action
            } else if (
                calculation.first &&
                !calculation.second &&
                !calculation.result
            ) {
                calculation.action = target.innerText;
                input.value = calculation.first + calculation.action;
                console.log("changing", input.value);
            } else {
                calculation.action = target.innerText;
                updateDisplay();
                appendNumber(target);
                console.log("valid action", calculation);

                // return;
            }

            //valid values for computing exist
        } else if (
            calculation.action &&
            calculation.first &&
            calculation.second
        ) {
            updateDisplay();
            input.value = compute(calculation);
            calculation.first = input.value;
            console.log(calculation);

            //act in progress
        } else {
            updateDisplay();
            console.log(calculation);
        }
    });
});

equal.addEventListener("click", equalRes);

del.addEventListener("click", deleteNumbers);
