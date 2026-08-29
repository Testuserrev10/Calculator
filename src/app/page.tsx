"use client";

import { useEffect, useState } from "react";

type Operator = "+" | "−" | "×" | "÷";

type Button = {
  label: string;
  kind: "number" | "operator" | "utility" | "equals";
  action: string;
  wide?: boolean;
};

const buttons: Button[] = [
  { label: "C", kind: "utility", action: "clear" },
  { label: "⌫", kind: "utility", action: "backspace" },
  { label: "÷", kind: "operator", action: "divide" },
  { label: "×", kind: "operator", action: "multiply" },
  { label: "7", kind: "number", action: "7" },
  { label: "8", kind: "number", action: "8" },
  { label: "9", kind: "number", action: "9" },
  { label: "−", kind: "operator", action: "subtract" },
  { label: "4", kind: "number", action: "4" },
  { label: "5", kind: "number", action: "5" },
  { label: "6", kind: "number", action: "6" },
  { label: "+", kind: "operator", action: "add" },
  { label: "1", kind: "number", action: "1" },
  { label: "2", kind: "number", action: "2" },
  { label: "3", kind: "number", action: "3" },
  { label: "=", kind: "equals", action: "equals" },
  { label: "0", kind: "number", action: "0", wide: true },
  { label: ".", kind: "number", action: "decimal" },
];

const operatorMap: Record<string, Operator> = {
  add: "+",
  subtract: "−",
  multiply: "×",
  divide: "÷",
};

function evaluateExpression(expression: string) {
  const tokens = expression.match(/(?:\d+\.?\d*|[+−×÷])/g) ?? [];
  if (tokens.join("") !== expression || tokens.length === 0) {
    throw new Error("Invalid calculation");
  }

  const values: number[] = [];
  const operators: Operator[] = [];
  const precedence: Record<Operator, number> = { "+": 1, "−": 1, "×": 2, "÷": 2 };

  const applyOperator = () => {
    const operator = operators.pop();
    const right = values.pop();
    const left = values.pop();
    if (!operator || left === undefined || right === undefined) {
      throw new Error("Invalid calculation");
    }
    if (operator === "÷" && right === 0) {
      throw new Error("Cannot divide by zero");
    }
    values.push(
      operator === "+"
        ? left + right
        : operator === "−"
          ? left - right
          : operator === "×"
            ? left * right
            : left / right,
    );
  };

  tokens.forEach((token, index) => {
    if (!Number.isNaN(Number(token))) {
      values.push(Number(token));
      return;
    }
    const operator = token as Operator;
    if (index === tokens.length - 1) {
      throw new Error("Finish the calculation first");
    }
    while (
      operators.length > 0 &&
      precedence[operators[operators.length - 1]] >= precedence[operator]
    ) {
      applyOperator();
    }
    operators.push(operator);
  });

  while (operators.length > 0) applyOperator();
  const result = values[0];
  if (result === undefined || !Number.isFinite(result)) {
    throw new Error("Invalid calculation");
  }
  return Number(result.toFixed(10));
}

function formatResult(value: number | string) {
  if (typeof value === "string") return value;
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 10 }).format(value);
}

export default function Home() {
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState<number | string>("0");
  const [hasEvaluated, setHasEvaluated] = useState(false);

  const reset = () => {
    setExpression("");
    setResult("0");
    setHasEvaluated(false);
  };

  const inputDigit = (digit: string) => {
    const nextExpression = hasEvaluated ? digit : `${expression}${digit}`;
    setExpression(nextExpression);
    setResult(nextExpression);
    setHasEvaluated(false);
  };

  const inputDecimal = () => {
    const currentNumber = expression.split(/[+−×÷]/).pop() ?? "";
    if (currentNumber.includes(".")) return;
    const nextExpression = `${expression}${currentNumber ? "." : "0."}`;
    setExpression(nextExpression);
    setResult(nextExpression);
    setHasEvaluated(false);
  };

  const inputOperator = (operator: Operator) => {
    if (!expression) return;
    const trimmed = expression.replace(/[+−×÷]$/, "");
    const nextExpression = `${trimmed}${operator}`;
    setExpression(nextExpression);
    setResult(nextExpression);
    setHasEvaluated(false);
  };

  const backspace = () => {
    if (hasEvaluated) return reset();
    const nextExpression = expression.slice(0, -1);
    setExpression(nextExpression);
    setResult(nextExpression || "0");
  };

  const calculate = () => {
    if (!expression) return;
    try {
      const nextResult = evaluateExpression(expression);
      setResult(nextResult);
      setExpression(String(nextResult));
      setHasEvaluated(true);
    } catch (error) {
      setResult(error instanceof Error ? error.message : "Invalid calculation");
      setHasEvaluated(false);
    }
  };

  const handleAction = (action: string) => {
    if (/^\d$/.test(action)) inputDigit(action);
    else if (action === "decimal") inputDecimal();
    else if (action === "clear") reset();
    else if (action === "backspace") backspace();
    else if (action === "equals") calculate();
    else if (operatorMap[action]) inputOperator(operatorMap[action]);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const keyActions: Record<string, string> = {
        "+": "add",
        "-": "subtract",
        "*": "multiply",
        "/": "divide",
        Enter: "equals",
        "=": "equals",
        Escape: "clear",
        Backspace: "backspace",
        ".": "decimal",
      };
      const action = /^\d$/.test(event.key) ? event.key : keyActions[event.key];
      if (!action) return;
      event.preventDefault();
      handleAction(action);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  return (
    <main className="calculator-shell">
      <div className="ambient ambient-top" aria-hidden="true" />
      <div className="ambient ambient-bottom" aria-hidden="true" />

      <section className="calculator-card" aria-label="Basic calculator">
        <header className="calculator-header">
          <div className="brand-mark" aria-hidden="true">
            <span className="brand-drop" />
            <span className="brand-line" />
          </div>
          <div>
            <p className="eyebrow">Everyday utility</p>
            <h1>Infuse</h1>
          </div>
          <span className="status-pill">
            <span className="status-dot" /> Ready
          </span>
        </header>

        <div className="display-panel" aria-live="polite">
          <div className="display-label">Current calculation</div>
          <div className="expression" aria-label={`Current calculation: ${expression || "empty"}`}>
            {expression || "Start calculating"}
          </div>
          <div className={`result ${typeof result === "string" && result.length > 12 ? "result-message" : ""}`}>
            {formatResult(result)}
          </div>
          <div className="display-trace" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
        </div>

        <div className="keypad" aria-label="Calculator keypad">
          {buttons.map((button) => (
            <button
              className={`key key-${button.kind} ${button.wide ? "key-wide" : ""}`}
              key={button.action}
              type="button"
              aria-label={button.label === "⌫" ? "Backspace" : button.label}
              onClick={() => handleAction(button.action)}
            >
              {button.label}
            </button>
          ))}
        </div>

        <footer className="calculator-footer">
          <span className="footer-pulse" aria-hidden="true" />
          <span>Clear thinking, one step at a time</span>
          <span className="keyboard-hint">Keyboard ready</span>
        </footer>
      </section>
    </main>
  );
}
