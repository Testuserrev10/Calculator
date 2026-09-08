"use client";

import { useState, type FormEvent } from "react";

export default function Home() {
  const [firstNumber, setFirstNumber] = useState("");
  const [secondNumber, setSecondNumber] = useState("");
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const first = Number(firstNumber);
    const second = Number(secondNumber);

    if (firstNumber.trim() === "" || secondNumber.trim() === "") {
      setError("Enter a number in both fields to continue.");
      setResult(null);
      return;
    }

    if (!Number.isFinite(first) || !Number.isFinite(second)) {
      setError("Use valid numbers only, such as 12, -4, or 3.5.");
      setResult(null);
      return;
    }

    setError("");
    setResult(first + second);
  }

  function handleReset() {
    setFirstNumber("");
    setSecondNumber("");
    setResult(null);
    setError("");
  }

  return (
    <main className="app-shell">
      <div className="page-frame">
        <header className="site-header">
          <div className="brand-mark" aria-hidden="true">
            <span />
            <span />
          </div>
          <p className="eyebrow">Everyday arithmetic</p>
          <p className="header-note">Simple by design</p>
        </header>

        <section className="hero" aria-labelledby="page-title">
          <div className="hero-copy">
            <p className="section-kicker">Addition studio</p>
            <h1 id="page-title">Add two numbers.<br /><em>Keep moving.</em></h1>
            <p className="intro">
              A quiet space for quick calculations, with nothing between you and the answer.
            </p>
          </div>

          <div className="calculator-card">
            <div className="card-header">
              <div>
                <p className="card-kicker">Your calculation</p>
                <h2>What would you like to add?</h2>
              </div>
              <span className="step-indicator" aria-label="Step 1 of 1">01</span>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              <div className="input-row">
                <label className="number-field">
                  <span>First number</span>
                  <input
                    type="number"
                    inputMode="decimal"
                    value={firstNumber}
                    onChange={(event) => setFirstNumber(event.target.value)}
                    placeholder="0"
                    aria-invalid={Boolean(error)}
                  />
                </label>

                <span className="operator" aria-hidden="true">+</span>

                <label className="number-field">
                  <span>Second number</span>
                  <input
                    type="number"
                    inputMode="decimal"
                    value={secondNumber}
                    onChange={(event) => setSecondNumber(event.target.value)}
                    placeholder="0"
                    aria-invalid={Boolean(error)}
                  />
                </label>
              </div>

              {error && (
                <p className="form-message error-message" role="alert">
                  <span aria-hidden="true">!</span>
                  {error}
                </p>
              )}

              <div className="form-actions">
                <button className="primary-button" type="submit">
                  Add numbers
                  <span aria-hidden="true">↗</span>
                </button>
                <button className="reset-button" type="button" onClick={handleReset}>
                  Reset
                </button>
              </div>
            </form>

            <div className={`result-panel ${result === null ? "result-empty" : "result-ready"}`} aria-live="polite">
              <div>
                <p className="result-label">Your answer</p>
                {result === null ? (
                  <p className="result-placeholder">The result will appear here</p>
                ) : (
                  <p className="result-value">{result}</p>
                )}
              </div>
              <span className="result-symbol" aria-hidden="true">=</span>
            </div>
          </div>
        </section>

        <footer className="site-footer">
          <span>Made for the small things that add up.</span>
          <span className="footer-line" aria-hidden="true" />
          <span>© 2026</span>
        </footer>
      </div>
    </main>
  );
}
