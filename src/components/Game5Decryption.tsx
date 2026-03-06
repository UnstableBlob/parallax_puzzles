"use client";

import React, { useState, useEffect, useCallback } from 'react';
import styles from './Game5Decryption.module.css';

interface Game5DecryptionProps {
    activeSet: number;
    onComplete: () => void;
}

const SET_PASSWORDS: Record<number, string> = {
    1: 'OMEGA',
    2: 'ECLIPSE',
    3: 'PARALLAX'
};

const SYMBOL_MAP: Record<string, string> = {
    'A': 'Ω',
    'B': '⍜',
    'C': '❂',
    'D': '⎔',
    'E': '∆',
    'F': '⍿',
    'G': '☿',
    'H': '⋈',
    'I': '⟁',
    'J': '⍶',
    'K': '⍲',
    'L': '⛤',
    'M': '⎈',
    'N': '▱',
    'O': 'Ψ',
    'P': '⍟',
    'Q': '⍡',
    'R': 'ᚱ',
    'S': '✦',
    'T': '⨂',
    'U': '⍝',
    'V': '⍫',
    'W': '⍭',
    'X': '⍮',
    'Y': '⍯',
    'Z': '⍰'
};

const KEYBOARD_KEYS = Object.entries(SYMBOL_MAP).map(([letter, symbol]) => ({ letter, symbol }));

export default function Game5Decryption({ activeSet, onComplete }: Game5DecryptionProps) {
    const targetPassphrase = SET_PASSWORDS[activeSet] || SET_PASSWORDS[1];
    const bufferSize = targetPassphrase.length;

    const [buffer, setBuffer] = useState<string[]>([]);
    const [status, setStatus] = useState<'idle' | 'failed' | 'success'>('idle');
    const [keysLayout, setKeysLayout] = useState<{ letter: string, symbol: string }[]>([]);

    useEffect(() => {
        // Initialize an array with exactly what we need, then pad with rest
        const neededKeys = targetPassphrase.split('').map(l => ({ letter: l, symbol: SYMBOL_MAP[l] }));

        // Let's just shuffle the entire keyboard to make finding the right ones a bit tricky
        const shuffled = [...KEYBOARD_KEYS].sort(() => Math.random() - 0.5);
        setKeysLayout(shuffled.slice(0, 24)); // 24 keys looks good on a grid
    }, [targetPassphrase]);

    const handleKeyPress = useCallback((symbol: string) => {
        if (status !== 'idle') return;

        setBuffer(prev => {
            if (prev.length < bufferSize) {
                return [...prev, symbol];
            }
            return prev;
        });
    }, [status, bufferSize]);

    const handleBackspace = () => {
        if (status !== 'idle') return;
        setBuffer(prev => prev.slice(0, -1));
    };

    const handleSubmit = () => {
        if (status !== 'idle') return;
        if (buffer.length === 0) return;

        // Translate buffer symbols back to letters
        const enteredLetters = buffer.map(sym => {
            const entry = KEYBOARD_KEYS.find(k => k.symbol === sym);
            return entry ? entry.letter : '';
        }).join('');

        if (enteredLetters === targetPassphrase) {
            setStatus('success');
            setTimeout(() => {
                onComplete();
            }, 3000);
        } else {
            setStatus('failed');
            setTimeout(() => {
                setBuffer([]);
                setStatus('idle');
            }, 1000);
        }
    };

    // Keyboard support (developer / operator cheat if they guess the alphabet map)
    useEffect(() => {
        const handleGlobalKeyDown = (e: KeyboardEvent) => {
            if (status !== 'idle') return;

            if (e.key === 'Backspace') {
                handleBackspace();
                return;
            }

            if (e.key === 'Enter') {
                handleSubmit();
                return;
            }

            const char = e.key.toUpperCase();
            if (SYMBOL_MAP[char]) {
                handleKeyPress(SYMBOL_MAP[char]);
            }
        };

        window.addEventListener('keydown', handleGlobalKeyDown);
        return () => window.removeEventListener('keydown', handleGlobalKeyDown);
    }, [status, buffer, handleBackspace, handleSubmit, handleKeyPress]);

    return (
        <div className={styles.container}>
            {status === 'success' && <div className={styles.particlesOverlay} />}

            <div className={`${styles.glassPanel} ${status === 'failed' ? styles.panelFailed : ''} ${status === 'success' ? styles.panelSuccess : ''}`}>
                <div className={styles.header}>
                    <h2 className={styles.title}>CLASSIFIED UPLINK</h2>
                    <p className={styles.subtitle}>AUTHORIZATION REQUIRED: {targetPassphrase}</p>
                </div>

                <div className={styles.bufferContainer}>
                    {Array.from({ length: bufferSize }).map((_, i) => (
                        <div key={i} className={`${styles.bufferSlot} ${buffer[i] ? styles.slotFilled : ''} ${status === 'failed' ? styles.slotError : ''} ${status === 'success' ? styles.slotSuccess : ''}`}>
                            {buffer[i] || ''}
                        </div>
                    ))}
                </div>

                {status === 'failed' && (
                    <div className={styles.errorMessage}>DECRYPTION FAILED</div>
                )}
                {status === 'success' && (
                    <div className={styles.successMessage}>ACCESS GRANTED</div>
                )}

                <div className={styles.keyboard}>
                    {keysLayout.map(({ letter, symbol }) => (
                        <button
                            key={letter}
                            className={styles.keyBtn}
                            onClick={() => handleKeyPress(symbol)}
                            disabled={status !== 'idle'}
                        >
                            {symbol}
                        </button>
                    ))}
                </div>

                <div className={styles.actions}>
                    <button
                        className={styles.actionBtn}
                        onClick={handleBackspace}
                        disabled={status !== 'idle'}
                    >
                        BACKSPACE
                    </button>
                    <button
                        className={`${styles.actionBtn} ${styles.submitBtn}`}
                        onClick={handleSubmit}
                        disabled={status !== 'idle'}
                    >
                        SUBMIT
                    </button>
                </div>
            </div>
        </div>
    );
}
