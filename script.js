const display = document.getElementById("display");
const message = document.getElementById("message");
const historyDisplay = document.getElementById("history");
const buttons = document.querySelector(".buttons");

let current = "0";
let previous = null;
let operator = null;
let resetNext = false;

// Update the main display.
function updateDisplay() {
  display.value = current;
}

// Add a number to the current input.
function enterNumber(number) {
  message.textContent = "";

  if (current === "Error" || resetNext) {
    current = number;
    resetNext = false;
  } else if (current === "0") {
    current = number;
  } else if (current.length < 15) {
    current += number;
  }

  updateDisplay();
}

// Add a decimal point.
function enterDecimal() {
  message.textContent = "";

  if (current === "Error" || resetNext) {
    current = "0.";
    resetNext = false;
  } else if (!current.includes(".")) {
    current += ".";
  }

  updateDisplay();
}

// Select an arithmetic operation.
function chooseOperator(nextOperator) {
  message.textContent = "";

  if (current === "Error") return;

  if (operator && resetNext) {
    operator = nextOperator;
    return;
  }

  if (operator && !resetNext) {
    calculate();
    if (current === "Error") return;
  }

  previous = Number(current);
  operator = nextOperator;
  resetNext = true;

  historyDisplay.textContent =
    `${previous} ${symbol(operator)}`;
}

// Display the familiar math symbol.
function symbol(op) {
  return { "+": "+", "-": "−", "*": "×", "/": "÷" }[op];
}

// Calculate the result.
function calculate() {
  if (operator === null || previous === null) return;

  const a = previous;
  const b = Number(current);
  const expression = `${a} ${symbol(operator)} ${b}`;

  let result;

  switch (operator) {
    case "+":
      result = a + b;
      break;
    case "-":
      result = a - b;
      break;
    case "*":
      result = a * b;
      break;
    case "/":
      if (b === 0) {
        current = "Error";
        display.value = current;
        message.textContent = "Cannot divide by zero!";
        historyDisplay.textContent = expression;
        previous = null;
        operator = null;
        resetNext = true;
        return;
      }
      result = a / b;
      break;
  }

  if (!Number.isFinite(result)) {
    current = "Error";
    message.textContent = "Invalid calculation!";
  } else {
    current = String(Number(result.toPrecision(10)));
    historyDisplay.textContent = `${expression} =`;
  }

  previous = null;
  operator = null;
  resetNext = true;
  updateDisplay();
}

// Reset all values.
function clearCalculator() {
  current = "0";
  previous = null;
  operator = null;
  resetNext = false;

  message.textContent = "";
  historyDisplay.textContent = "Ready for your next calculation";
  updateDisplay();
}

// Delete the last digit.
function deleteDigit() {
  message.textContent = "";

  if (current === "Error" || resetNext) {
    clearCalculator();
    return;
  }

  current = current.length > 1
    ? current.slice(0, -1)
    : "0";

  if (current === "-") current = "0";

  updateDisplay();
}

// Change positive to negative or vice versa.
function toggleSign() {
  if (current === "Error" || Number(current) === 0) return;

  current = String(-Number(current));
  updateDisplay();
}

// Handle all calculator button clicks.
buttons.addEventListener("click", function (event) {
  const button = event.target.closest("button");
  if (!button) return;

  if (button.dataset.number !== undefined) {
    enterNumber(button.dataset.number);
  } else if (button.dataset.operator) {
    chooseOperator(button.dataset.operator);
  } else {
    switch (button.dataset.action) {
      case "clear":
        clearCalculator();
        break;
      case "delete":
        deleteDigit();
        break;
      case "decimal":
        enterDecimal();
        break;
      case "sign":
        toggleSign();
        break;
      case "calculate":
        calculate();
        break;
    }
  }
});
