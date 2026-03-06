"use client";

import React, { useState, useEffect, useRef, FormEvent } from 'react';
import styles from './Game3DatabaseSchema.module.css';

interface Game3DatabaseSchemaProps {
    activeSet: number;
    onComplete: () => void;
}

interface TerminalLine {
    id: number;
    text: string;
    type: 'input' | 'output' | 'error' | 'success' | 'system';
}

const SET_NARRATIVES: Record<number, { prompt: string, expectedQuery: string, successData: string[] }> = {
    1: {
        prompt: "Sector 7G breach by Employee ID 4091. Need full name for incident report.",
        expectedQuery: "select first_name, last_name from personnel where emp_id = 4091;",
        successData: ["1 ROW(S) RETURNED:", "FIRST_NAME: HOMER", "LAST_NAME: SIMPSON"]
    },
    2: {
        prompt: "Maintenance drone routing error on Floor 4. Need maintenance protocol ID.",
        expectedQuery: "select protocol_id from maintenance_logs where floor = 4;",
        successData: ["1 ROW(S) RETURNED:", "PROTOCOL_ID: MX-880-BETA"]
    },
    3: {
        prompt: "Network timeout attempting to ping Substation C.",
        expectedQuery: "select ip_address from network_nodes where node_name = 'substation c';",
        successData: ["1 ROW(S) RETURNED:", "IP_ADDRESS: 192.168.104.22"]
    }
};

export default function Game3DatabaseSchema({ activeSet, onComplete }: Game3DatabaseSchemaProps) {
    const narrative = SET_NARRATIVES[activeSet] || SET_NARRATIVES[1];

    const [lines, setLines] = useState<TerminalLine[]>([
        { id: 1, text: "PARALLAX MAINFRAME OS v3.11", type: "system" },
        { id: 2, text: "LOGIN FAILED. DATABASE CORRUPTION DETECTED.", type: "error" },
        { id: 3, text: "EMERGENCY OVERRIDE CONSOLE ACTIVE.", type: "system" },
        { id: 4, text: `INCIDENT REPORT: ${narrative.prompt}`, type: "system" },
    ]);
    const [currentInput, setCurrentInput] = useState('');
    const [isComplete, setIsComplete] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const lineIdRef = useRef(5);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [lines]);

    // Keep focus on input
    useEffect(() => {
        const handleGlobalClick = () => {
            if (!isComplete && window.getSelection()?.toString() === '') {
                inputRef.current?.focus();
            }
        };
        document.addEventListener('click', handleGlobalClick);
        return () => document.removeEventListener('click', handleGlobalClick);
    }, [isComplete]);

    const printLine = (text: string, type: TerminalLine['type'] = 'output') => {
        setLines(prev => [...prev, { id: lineIdRef.current++, text, type }]);
    };

    const handleQuery = (query: string) => {
        const q = query.trim();
        if (!q) return;

        printLine(`> ${q}`, 'input');

        // Normalize spaces and quotes for matching
        const normalizedInput = q.toLowerCase().replace(/\s+/g, ' ').replace(/'/g, '"').trim();
        const expected = narrative.expectedQuery.toLowerCase().replace(/\s+/g, ' ').replace(/'/g, '"').trim();

        // Exact match checking
        if (normalizedInput === expected) {
            printLine("Executing query...", "system");
            setTimeout(() => {
                narrative.successData.forEach(line => printLine(line, "output"));
                printLine("DATA RETRIEVED. ACCESS GRANTED", "success");
                setIsComplete(true);
            }, 800);
            return;
        }

        // Basic generic feedback
        if (!normalizedInput.includes("select ") || !normalizedInput.includes("from ")) {
            printLine("ERROR 1064: You have an error in your SQL syntax.", "error");
            return;
        }

        if (!normalizedInput.endsWith(";")) {
            printLine("ERROR: Query must end with a semicolon (;).", "error");
            return;
        }

        printLine("ERROR 0000: QUERY EXECUTED BUT RETURNED NO MATCHING INCIDENT DATA.", "error");
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (isComplete) return;
        handleQuery(currentInput);
        setCurrentInput('');
    };

    return (
        <div className={styles.container}>
            <div className={styles.crtOverlay} />
            <div className={styles.scanlines} />

            <div className={`${styles.terminalContent} ${isComplete ? styles.successGlow : ''}`}>
                <div className={styles.outputArea}>
                    {lines.map(line => (
                        <div key={line.id} className={`${styles.line} ${styles[line.type]}`}>
                            {line.type === 'success' && (
                                <pre className={styles.asciiArt}>
                                    {`
   ___   ____________  ______________
  /   | / ____/ ____/ / ____/ ___/ ___/
 / /| |/ /   / /     / __/  \\__ \\\\__ \\
/ ___ / /___/ /___  / /___ ___/ /__/ /
/_/  |_\\____/\\____/ /_____//____/____/
`}
                                </pre>
                            )}
                            {line.text}
                        </div>
                    ))}
                    <div ref={bottomRef} />
                </div>

                {!isComplete ? (
                    <form className={styles.inputArea} onSubmit={handleSubmit}>
                        <span className={styles.prompt}>{'>'}</span>
                        <input
                            ref={inputRef}
                            type="text"
                            value={currentInput}
                            onChange={(e) => setCurrentInput(e.target.value)}
                            className={styles.textInput}
                            autoFocus
                            spellCheck={false}
                            autoComplete="off"
                        />
                        <div className={styles.cursor} />
                    </form>
                ) : (
                    <div className={styles.completeActions}>
                        <button className={styles.proceedBtn} onClick={onComplete}>
                            [ ENTER SECTOR 4 ]
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
