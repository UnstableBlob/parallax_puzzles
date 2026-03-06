"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import styles from './Game4Firewall.module.css';

interface Game4FirewallProps {
    activeSet: number;
    onComplete: () => void;
}

interface MazeDef {
    start: [number, number];
    target: [number, number];
    validPaths: string[];
}

const MAZES: Record<number, MazeDef> = {
    1: {
        start: [0, 0],
        target: [6, 6],
        validPaths: ["0,0", "0,1", "0,2", "1,2", "2,2", "2,3", "2,4", "3,4", "4,4", "5,4", "6,4", "6,5", "6,6"]
    },
    2: {
        start: [6, 0],
        target: [0, 6],
        validPaths: ["6,0", "5,0", "4,0", "4,1", "4,2", "5,2", "6,2", "6,3", "6,4", "5,4", "4,4", "3,4", "2,4", "2,5", "2,6", "1,6", "0,6"]
    },
    3: {
        start: [3, 0],
        target: [3, 6],
        validPaths: ["3,0", "3,1", "2,1", "1,1", "1,2", "1,3", "2,3", "3,3", "4,3", "5,3", "5,4", "5,5", "4,5", "3,5", "3,6"]
    }
};

const START_TIME = 120; // 2 minutes
const THROTTLE_MS = 150;

export default function Game4Firewall({ activeSet, onComplete }: Game4FirewallProps) {
    const maze = MAZES[activeSet] || MAZES[1];

    const [pos, setPos] = useState({ x: maze.start[0], y: maze.start[1] });
    const [timeLeft, setTimeLeft] = useState(START_TIME);
    const [status, setStatus] = useState<'idle' | 'playing' | 'hit' | 'failed' | 'success'>('idle');

    // Status ref to access in keyboard listeners without stale closures
    const statusRef = useRef(status);
    const posRef = useRef(pos);
    const lastMoveTimeRef = useRef(0);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => { statusRef.current = status; }, [status]);
    useEffect(() => { posRef.current = pos; }, [pos]);

    // Reset pos on activeSet change or replay
    useEffect(() => {
        setPos({ x: maze.start[0], y: maze.start[1] });
    }, [maze]);

    const startGame = () => {
        setPos({ x: maze.start[0], y: maze.start[1] });
        setTimeLeft(START_TIME);
        setStatus('playing');
    };

    const triggerCollision = useCallback(() => {
        setStatus('hit');
        setTimeLeft(prev => Math.max(0, prev - 15)); // Strict penalty
        setTimeout(() => {
            if (statusRef.current === 'hit') {
                setPos({ x: maze.start[0], y: maze.start[1] }); // Hard Reset
                setStatus('playing');
            }
        }, 800);
    }, [maze]);

    const handleMove = useCallback((dx: number, dy: number) => {
        if (statusRef.current !== 'playing') return;

        const now = Date.now();
        if (now - lastMoveTimeRef.current < THROTTLE_MS) return;
        lastMoveTimeRef.current = now;

        const { x, y } = posRef.current;
        const newX = x + dx;
        const newY = y + dy;

        const newPosStr = `${newX},${newY}`;

        if (!maze.validPaths.includes(newPosStr)) {
            triggerCollision();
            return;
        }

        setPos({ x: newX, y: newY });

        if (newX === maze.target[0] && newY === maze.target[1]) {
            setStatus('success');
            if (timerRef.current) clearInterval(timerRef.current);
        }
    }, [triggerCollision, maze]);

    // Keyboard listener
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (statusRef.current !== 'playing') return;
            switch (e.key) {
                case 'ArrowUp': e.preventDefault(); handleMove(0, 1); break;
                case 'ArrowDown': e.preventDefault(); handleMove(0, -1); break;
                case 'ArrowLeft': e.preventDefault(); handleMove(-1, 0); break;
                case 'ArrowRight': e.preventDefault(); handleMove(1, 0); break;
                case 'w': case 'W': e.preventDefault(); handleMove(0, 1); break;
                case 's': case 'S': e.preventDefault(); handleMove(0, -1); break;
                case 'a': case 'A': e.preventDefault(); handleMove(-1, 0); break;
                case 'd': case 'D': e.preventDefault(); handleMove(1, 0); break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleMove]);

    // Timer
    useEffect(() => {
        if (status === 'playing') {
            timerRef.current = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        setStatus('failed');
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else if (timerRef.current) {
            clearInterval(timerRef.current);
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [status]);


    const formatTime = (time: number) => {
        const m = Math.floor(time / 60).toString().padStart(2, '0');
        const s = (time % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    if (status === 'idle') {
        return (
            <div className={styles.container}>
                <div className={styles.hudWrapper}>
                    <h2 className={styles.title}>THE FIREWALL</h2>
                    <p className={styles.brief}>
                        Navigate the grid completely blind. Any deviation from the safe path will sever the connection.<br />
                        No proximity sensors available.<br />
                        Grid constraints: Maze Module {activeSet}. Target Coordinates: {maze.target[0]}, {maze.target[1]}. Time Limit: 2:00.
                    </p>
                    <button className={styles.initBtn} onClick={startGame}>BREACH FIREWALL</button>
                </div>
            </div>
        );
    }

    if (status === 'failed') {
        return (
            <div className={styles.container}>
                <div className={styles.hudWrapper}>
                    <h2 className={styles.failedTitle}>CONNECTION TERMINATED</h2>
                    <p className={styles.brief}>You have been traced. Trace route completed.</p>
                    <button className={styles.initBtn} onClick={startGame}>RETRY BREACH</button>
                </div>
            </div>
        );
    }

    if (status === 'success') {
        return (
            <div className={styles.container}>
                <div className={styles.hudWrapper}>
                    <h2 className={styles.successTitle}>FIREWALL BYPASSED</h2>
                    <p className={styles.brief}>Target reached. Mainframe access secured.</p>
                    <button className={styles.proceedBtn} onClick={onComplete}>[ PROCEED TO SECTOR 5 ]</button>
                </div>
            </div>
        );
    }

    return (
        <div className={`${styles.container} ${status === 'hit' ? styles.shakeRed : ''}`}>

            <div className={styles.topHud}>
                <div className={styles.hudText}>UPLINK ESTABLISHED | MAZE {activeSet}</div>
                <div className={`${styles.timer} ${timeLeft <= 30 ? styles.timerAlert : ''}`}>
                    TIME: {formatTime(timeLeft)}
                </div>
            </div>

            <div className={styles.radarLayout}>
                {status === 'hit' ? (
                    <div className={styles.criticalErrorBox}>
                        <h1>FATAL COLLISION</h1>
                        <p>RESETTING CONNECTION...</p>
                    </div>
                ) : (
                    <div className={styles.sensorGrid}>
                        <div className={styles.centerPos}>
                            <div className={styles.posLabel}>POS</div>
                            <div className={styles.posValue}>X:{pos.x} Y:{pos.y}</div>
                        </div>
                    </div>
                )}

                {/* Visual D-Pad for mouse users */}
                <div className={styles.dpad}>
                    <div className={styles.emptyKey} />
                    <button className={styles.keyBtn} onClick={() => handleMove(0, 1)}>▲</button>
                    <div className={styles.emptyKey} />

                    <button className={styles.keyBtn} onClick={() => handleMove(-1, 0)}>◀</button>
                    <div className={styles.keyBtnCenter}></div>
                    <button className={styles.keyBtn} onClick={() => handleMove(1, 0)}>▶</button>

                    <div className={styles.emptyKey} />
                    <button className={styles.keyBtn} onClick={() => handleMove(0, -1)}>▼</button>
                    <div className={styles.emptyKey} />
                </div>
            </div>

            <div className={styles.bottomHud}>
                <div className={styles.hudText}>SENSOR ARRAY OFFLINE</div>
                <div className={styles.hudText}>GRID: 7x7</div>
            </div>

        </div>
    );
}
