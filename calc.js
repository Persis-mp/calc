// Get the calculator display and buttons.
const display = document.getElementById("display");
const expression = document.getElementById("expression");
const buttons = document.getElementById("buttons");

// Variables for storing calculations.
let currentInput = "0";
let previousNumber = null;
let operator = null;
let resetInput = false;

// Update the number shown on the screen.
function updateDisplay() {
  display.textContent = currentInput;
}

// Enter a number.
function enterNumber(number) {
  if (currentInput === "Error" || resetInput) {
    currentInput = number;
    resetInput = false;
  } else if (currentInput === "0") {
    currentInput = number;
  } else {
    currentInput += number;
  }

  updateDisplay();
}

// Enter a decimal point.
function enterDecimal() {
  if (currentInput === "Error" || resetInput) {
    currentInput = "0.";
    resetInput = false;
  } else if (!currentInput.includes(".")) {
    currentInput += ".";
  }

  updateDisplay();
}

// Choose a mathematical operation.
function chooseOperator(selectedOperator) {
  if (currentInput === "Error") {
    clearCalculator();
    return;
  }

  if (operator !== null && !resetInput) {
    calculateResult();
  }

  previousNumber = Number(currentInput);
  operator = selectedOperator;
  resetInput = true;

  expression.textContent =
    previousNumber + " " + getOperatorSymbol(operator);
}

// Display the correct symbol for an operator.
function getOperatorSymbol(op) {
  if (op === "+") return "+";
  if (op === "-") return "−";
  if (op === "*") return "×";
  if (op === "/") return "÷";

  return op;
}

// Perform the calculation.
function calculateResult() {
  if (operator === null || previousNumber === null || resetInput) {
    return;
  }

  const secondNumber = Number(currentInput);
  let result;

  if (operator === "+") {
    result = previousNumber + secondNumber;
  } else if (operator === "-") {
    result = previousNumber - secondNumber;
  } else if (operator === "*") {
    result = previousNumber * secondNumber;
  } else if (operator === "/") {
    if (secondNumber === 0) {
      currentInput = "Error";
      display.textContent = "Cannot divide by zero";
      expression.textContent = "";
      previousNumber = null;
      operator = null;
      resetInput = true;
      return;
    }

    result = previousNumber / secondNumber;
  }

  // Reduce floating-point display errors.
  currentInput = String(Number(result.toPrecision(10)));

  expression.textContent =
    previousNumber + " " +
    getOperatorSymbol(operator) + " " +
    secondNumber + " =";

  previousNumber = null;
  operator = null;
  resetInput = true;

  updateDisplay();
}

// Clear everything.
function clearCalculator() {
  currentInput = "0";
  previousNumber = null;
  operator = null;
  resetInput = false;

  expression.textContent = "";
  updateDisplay();
}

// Delete the last digit.
function deleteLast() {
  if (currentInput === "Error") {
    clearCalculator();
    return;
  }

  if (resetInput) {
    return;
  }

  if (currentInput.length > 1) {
    currentInput = currentInput.slice(0, -1);
  } else {
    currentInput = "0";
  }

  if (currentInput === "-") {
    currentInput = "0";
  }

  updateDisplay();
}

// Change a positive number to negative, or vice versa.
function changeSign() {
  if (currentInput === "Error") return;

  if (Number(currentInput) !== 0) {
    currentInput = String(Number(currentInput) * -1);
  }

  updateDisplay();
}

// Convert the current number to a percentage.
function convertToPercent() {
  if (currentInput === "Error") return;

  currentInput = String(Number(currentInput) / 100);
  updateDisplay();
}

// Listen for clicks on calculator buttons.
buttons.addEventListener("click", function(event) {
  const button = event.target.closest("button");

  if (!button) return;

  // Number button.
  if (button.dataset.number !== undefined) {
    enterNumber(button.dataset.number);
  }

  // Operator button.
  if (button.dataset.operator !== undefined) {
    chooseOperator(button.dataset.operator);
  }

  // Other buttons.
  const action = button.dataset.action;

  if (action === "clear") {
    clearCalculator();
  } else if (action === "delete") {
    deleteLast();
  } else if (action === "decimal") {
    enterDecimal();
  } else if (action === "equals") {
    calculateResult();
  } else if (action === "sign") {
    changeSign();
  } else if (action === "percent") {
    convertToPercent();
  }
});
