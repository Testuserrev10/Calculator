"use client";

import { useState } from "react";
import type { FormEvent } from "react";

type Theme = "light" | "dark" | "neon";

const themes: { value: Theme; label: string }[] = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "neon", label: "Neon" },
];

export default function Home() {
  const [theme, setTheme] = useState<Theme>("light");
  const [firstNumber, setFirstNumber] = useState("");
  const [secondNumber, setSecondNumber] = useState("");
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (firstNumber.trim() === "" || secondNumber.trim() === "") {
      setResult(null);
      setError("Enter both numbers to continue.");
      return;
    }

    const first = Number(firstNumber);
    const second = Number(secondNumber);

    if (!Number.isFinite(first) || !Number.isFinite(second)) {
      setResult(null);
      setError("Use numbers only, including decimals or negative values.");
      return;
    }

    setError("");
    setResult(first + second);
  }

  return (
    <main className={`app-shell theme-${theme}`}>
      <section className="calculator" aria-labelledby="page-title">
        <header className="topbar">
          <div className="brand-mark" aria-hidden="true">
            +
          </div>
          <div className="theme-switcher">
            <span className="theme-label">Theme</span>
            <div className="theme-options" role="group" aria-label="Choose theme">
              {themes.map((option) => (
                <button
                  className={theme === option.value ? "theme-option active" : "theme-option"}
                  key={option.value}
                  onClick={() => setTheme(option.value)}
                  type="button"
                  aria-pressed={theme === option.value}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </header>

        <div className="intro">
          <p className="eyebrow">A little math, made clear</p>
          <h1 id="page-title">Add it up.</h1>
          <p className="subtitle">Enter two numbers and get your answer in one bright, simple step.</p>
        </div>

        <form className="addition-form" onSubmit={handleSubmit} noValidate>
          <div className="fields-row">
            <label className="number-field">
              <span>First number</span>
              <input
                inputMode="decimal"
                onChange={(event) => setFirstNumber(event.target.value)}
                placeholder="0"
                type="text"
                value={firstNumber}
                aria-invalid={Boolean(error)}
              />
            </label>
            <span className="operator" aria-hidden="true">
              +
            </span>
            <label className="number-field">
              <span>Second number</span>
              <input
                inputMode="decimal"
                onChange={(event) => setSecondNumber(event.target.value)}
                placeholder="0"
                type="text"
                value={secondNumber}
                aria-invalid={Boolean(error)}
              />
            </label>
          </div>

          <button className="add-button" type="submit">
            Calculate sum <span aria-hidden="true">→</span>
          </button>

          <div className={result !== null ? "result-panel has-result" : "result-panel"} aria-live="polite">
            {error ? (
              <p className="message error-message" role="alert">
                {error}
              </p>
            ) : result !== null ? (
              <>
                <span className="result-label">Your sum</span>
                <strong className="result-value">{result}</strong>
              </>
            ) : (
              <p className="message">Your answer will appear here.</p>
            )}
          </div>
        </form>

        <p className="helper-text">Tip: negative numbers and decimals work too.</p>
      </section>
    </main>
  );
}
