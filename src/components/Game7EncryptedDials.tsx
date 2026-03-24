"use client";

import React, { useState, useEffect, useMemo } from 'react';
import styles from './Game7EncryptedDials.module.css';

interface GameProps {
    activeSet: number;
    onComplete: () => void;
}

const SYMBOLS = ['α', 'β', 'γ', 'Δ', 'Ω', 'Φ', 'Ψ'];

interface SetConfig {
    amplitude: number;
    wavelength: number;
    temp: number;
    solution: [string, string, string];
}

const SET_CONFIGS: Record<number, SetConfig> = {
    1: { amplitude: 4, wavelength: 8, temp: 75, solution: ['Δ', 'α', 'Ω'] }, // Alpha
    2: { amplitude: 2, wavelength: 4, temp: 45, solution: ['β', 'γ', 'Φ'] }, // Beta
    3: { amplitude: 5, wavelength: 10, temp: 60, solution: ['Ω', 'Ψ', 'α'] }, // Gamma
};

export default function Game7EncryptedDials({ activeSet, onComplete }: GameProps) {
    const config = SET_CONFIGS[activeSet] || SET_CONFIGS[1];

    const [dials, setDials] = useState<[number, number, number]>([0, 0, 0]); // Indices of SYMBOLS
    const [isSuccess, setIsSuccess] = useState(false);

    const checkSuccess = () => {
        const currentVals = [SYMBOLS[dials[0]], SYMBOLS[dials[1]], SYMBOLS[dials[2]]];
        const match = currentVals.every((val, i) => val === config.solution[i]);
        setIsSuccess(match);
    };

    useEffect(() => {
        checkSuccess();
    }, [dials]);

    const rotateDial = (dialIndex: number) => {
        setDials(prev => {
            const next = [...prev] as [number, number, number];
            next[dialIndex] = (next[dialIndex] + 1) % SYMBOLS.length;
            return next;
        });
    };

    const radarWavePath = useMemo(() => {
        const points = [];
        const width = 250;
        const midY = 125;
        // Amp 4 -> 40px visual amplitude, wavelength 8 -> 80px visual.
        for (let x = 0; x <= width; x += 5) {
            const y = Math.sin(x * (Math.PI * 2 / (config.wavelength * 10))) * (config.amplitude * 10);
            points.push(`${x},${midY - y}`);
        }
        return `M ${points.join(' L ')}`;
    }, [config]);

    return (
        <div className={styles.container}>
            <div className={styles.headerRow}>
                <h2 className={styles.title}>Encrypted Dials</h2>
                <div className={styles.badge}>RADAR JAMMER {activeSet}</div>
            </div>

            <p className={styles.subtitle}>Calibrate the jammer to match the Target Waveform. Reference the calibration chart for correct symbol alignment.</p>

            <div className={styles.radarScreen}>
                <svg className={styles.targetWaveGrid} viewBox="0 0 250 250">
                    <path d="M 0 125 L 250 125" />
                    <path d="M 125 0 L 125 250" />
                    {/* Grid lines */}
                    {[25, 50, 75, 100, 150, 175, 200, 225].map(y => (
                        <path key={`h-${y}`} d={`M 0 ${y} L 250 ${y}`} strokeDasharray="2, 6" />
                    ))}
                    {[25, 50, 75, 100, 150, 175, 200, 225].map(x => (
                        <path key={`v-${x}`} d={`M ${x} 0 L ${x} 250`} strokeDasharray="2, 6" />
                    ))}
                    
                    <path className={styles.radarWave} d={radarWavePath} />
                </svg>
            </div>

            <div className={styles.telemetryPanel}>
                <div>INTERNAL TEMP: {config.temp}°C</div>
                <div>AMP: {config.amplitude}</div>
                <div>FREQ: {(100 / config.wavelength).toFixed(1)}Hz</div>
            </div>

            <div className={styles.dialsContainer}>
                {[0, 1, 2].map((dialIdx) => {
                    const symbolIdx = dials[dialIdx];
                    const rotation = (symbolIdx * (360 / SYMBOLS.length));
                    
                    return (
                        <div key={dialIdx} className={styles.dialWrapper}>
                            <div className={styles.dialLabel}>DIAL {dialIdx + 1}</div>
                            <div 
                                className={styles.dial} 
                                onClick={() => rotateDial(dialIdx)}
                                style={{ transform: `rotate(${rotation}deg)` } as React.CSSProperties}
                            >
                                <div className={styles.dialMarker} />
                                <div className={styles.dialValue} style={{ '--rotation': `${rotation}deg` } as any}>
                                    {SYMBOLS[symbolIdx]}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className={styles.statusSection}>
                <div className={`${styles.statusMessage} ${isSuccess ? styles.successMsg : ''}`}>
                    {isSuccess ? "CALIBRATION LOCKED... JAMMING ACTIVE" : "CALIBRATION MISMATCH... READJUSTING"}
                </div>
            </div>

            {isSuccess && (
                <button className={styles.completeBtn} onClick={onComplete}>
                    Proceed to Sector 8
                </button>
            )}
        </div>
    );
}
