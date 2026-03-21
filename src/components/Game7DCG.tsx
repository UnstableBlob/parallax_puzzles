"use client";

import React, { useState, KeyboardEvent, useMemo } from "react";
import styles from "./Game7DCG.module.css";

interface SetDef {
  answer: string;
  grid: string[][];
  sequence: string[];
  shift: number;
  mode: "ALPHA" | "BETA" | "GAMMA";
}

const SETS: Record<number, SetDef> = {
  1: {
    answer: "XZDUO",
    grid: [
      ["A1", "C3", "F2"],
      ["D2", "B1", "E3"],
      ["C2", "F1", "A3"],
    ],
    sequence: ["F2", "A1", "D2", "C3", "E3"],
    shift: 2,
    mode: "ALPHA",
  },
  2: {
    answer: "BNXKS",
    grid: [
      ["G1", "D3", "K2"],
      ["H2", "E1", "J3"],
      ["F3", "I2", "L1"],
    ],
    sequence: ["K2", "G1", "H2", "D3", "J3"],
    shift: 4,
    mode: "BETA",
  },
  3: {
    answer: "UJVNP",
    grid: [
      ["P1", "R2", "T3"],
      ["O2", "S1", "U3"],
      ["N3", "Q2", "V1"],
    ],
    sequence: ["T3", "S1", "O2", "V1", "Q2"],
    shift: 6,
    mode: "GAMMA",
  },
};

interface Props {
  activeSet: number;
  onComplete?: () => void;
}

export default function Game7DCG({ activeSet, onComplete }: Props) {
  const currentSet = useMemo(() => SETS[activeSet] || SETS[1], [activeSet]);

  const [answer, setAnswer] = useState("");
  const [status, setStatus] = useState<"idle" | "correct" | "wrong">("idle");
  const [shake, setShake] = useState(false);

  const handleSubmit = () => {
    const trimmed = answer.trim().toUpperCase();
    if (!trimmed) return;

    if (trimmed === currentSet.answer) {
      setStatus("correct");
      if (onComplete) {
        setTimeout(() => onComplete(), 2000);
      }
    } else {
      setStatus("wrong");
      setShake(true);
      setTimeout(() => setShake(false), 600);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <span className={styles.badge}>PARAALLAX</span>
          <h1 className={styles.title}>Dynamic Cipher Grid</h1>
          <p className={styles.subtitle}>
            Decrypt the sequence. Submit the final decoded word.
          </p>
        </header>

        <div className={styles.chipsRow}>
          <span className={styles.chip}>
            Sequence Length: {currentSet.sequence.length}
          </span>
          <span className={styles.chip}>SHIFT: {currentSet.shift}</span>
          <span className={styles.chip}>MODE: {currentSet.mode}</span>
          <span className={`${styles.chip} ${styles.chipActive}`}>
            <span className={styles.dot} />
            Terminal Active
          </span>
        </div>

        <div className={styles.panel}>
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionLabel}>GRID</span>
              <div className={styles.divider} />
            </div>

            <div className={styles.grid}>
              {currentSet.grid.map((row, ri) => (
                <div key={ri} className={styles.gridRow}>
                  {row.map((cell, ci) => (
                    <span key={ci} className={styles.gridCell}>
                      {cell}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </section>

          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionLabel}>SEQUENCE</span>
              <div className={styles.divider} />
            </div>

            <p className={styles.sequenceText}>
              {currentSet.sequence.join(" → ")}
            </p>
          </section>

          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionLabel}>KEY</span>
              <div className={styles.divider} />
            </div>

            <div className={styles.keyBlock}>
              <span>SHIFT = {currentSet.shift}</span>
              <span>MODE = {currentSet.mode}</span>
            </div>
          </section>
        </div>

        <div
          className={`${styles.panel} ${styles.submitPanel} ${
            shake ? styles.shake : ""
          }`}
        >
          <h2 className={styles.submitTitle}>Final Cipher Submission</h2>
          <div className={styles.submitDivider} />

          <label htmlFor="cipher-input" className={styles.inputLabel}>
            Enter Final Decoded Word
          </label>

          <div className={styles.inputRow}>
            <input
              id="cipher-input"
              className={styles.textInput}
              type="text"
              value={answer}
              onChange={(e) => {
                setAnswer(e.target.value);
                if (status !== "idle") setStatus("idle");
              }}
              onKeyDown={handleKeyDown}
              placeholder="XXXXX"
              autoComplete="off"
              spellCheck={false}
              disabled={status === "correct"}
            />

            <button
              className={styles.submitBtn}
              onClick={handleSubmit}
              disabled={!answer.trim() || status === "correct"}
            >
              SUBMIT
            </button>
          </div>

          <p className={styles.inputNote}>
            Only the final decoded word should be submitted.
          </p>

          {status === "correct" && (
            <div className={`${styles.feedback} ${styles.feedbackSuccess}`}>
              <span className={styles.feedbackIcon}>✅</span>
              <div>
                <div className={styles.feedbackTitle}>Access Granted</div>
                <div className={styles.feedbackSub}>System Unlocked</div>
              </div>
            </div>
          )}

          {status === "wrong" && (
            <div className={`${styles.feedback} ${styles.feedbackError}`}>
              <span className={styles.feedbackIcon}>❌</span>
              <div>
                <div className={styles.feedbackTitle}>Access Denied</div>
                <div className={styles.feedbackSub}>Incorrect Cipher Output</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}