"use client";

import React, { useState, useEffect } from 'react';
import styles from './Game10SnoringSabotage.module.css';

interface GameProps {
    activeSet: number;
    onComplete: () => void;
}

interface PulleyConfig {
    m2Name: string;
    m2WeightStr: string;
    ma: number; // Mechanical Advantage
    rustyPulleys: number;
    ropeType: 'standard' | 'frayed';
    maxTension: number | null; // null if unbreakable
    targetM1: number; // The target weight for bucket to balance
    requiresLever: boolean; // if true, balancing it snaps the rope, lever must be pulled
}

const SET_CONFIGS: Record<number, PulleyConfig> = {
    1: {
        m2Name: 'Standard ACME Anvil',
        m2WeightStr: '100kg',
        ma: 2,
        rustyPulleys: 0,
        ropeType: 'standard',
        maxTension: 200, // plenty
        targetM1: 50,
        requiresLever: false
    },
    2: {
        m2Name: 'Heavy Water (50L)',
        m2WeightStr: '55kg',
        ma: 4,
        rustyPulleys: 1, // adds 1.25kg to require tension per rules
        ropeType: 'standard',
        maxTension: 100,
        targetM1: 15,
        requiresLever: false
    },
    3: {
        m2Name: 'Concrete Boulder',
        m2WeightStr: '300kg',
        ma: 2,
        rustyPulleys: 0,
        ropeType: 'frayed',
        maxTension: 100,
        targetM1: 0, // Should not put weight, or it snaps!
        requiresLever: true
    }
};

export default function Game10SnoringSabotage({ activeSet, onComplete }: GameProps) {
    const config = SET_CONFIGS[activeSet] || SET_CONFIGS[1];

    const [bucketWeight, setBucketWeight] = useState(0);
    const [leverPulled, setLeverPulled] = useState(false);
    
    // Status
    const [isSuccess, setIsSuccess] = useState(false);
    const [hasSnapped, setHasSnapped] = useState(false);

    useEffect(() => {
        if (hasSnapped) return;

        if (config.requiresLever) {
            if (leverPulled) {
                setIsSuccess(true);
            } else if (bucketWeight > 0 && bucketWeight >= config.maxTension! / config.ma) {
                // Technically it snaps if tension exceeds 100 before we even balance
                setHasSnapped(true);
            }
        } else {
            if (bucketWeight === config.targetM1 && !leverPulled) {
                setIsSuccess(true);
            } else if (bucketWeight > config.targetM1 + 20) {
                 // Way too heavy, but won't snap unless config.maxTension is low
            } else {
                setIsSuccess(false);
            }
        }
    }, [bucketWeight, leverPulled, config, hasSnapped]);

    const addWeight = (w: number) => {
        if (isSuccess || hasSnapped) return;
        setBucketWeight(prev => prev + w);
    };

    const emptyBucket = () => {
        if (isSuccess || hasSnapped) return;
        setBucketWeight(0);
    };

    const SVG_WIDTH = 400;
    const SVG_HEIGHT = 350;

    return (
        <div className={styles.container}>
            <div className={styles.headerRow}>
                <h2 className={styles.title}>The Snoring Sabotage</h2>
                <div className={styles.badge}>RIGGING STATION {activeSet}</div>
            </div>

            <p className={styles.subtitle}>
                Consult the Rigger's Almanac. Calculate the required bucket payload (m1) to perfectly balance the sleeping target's doom (m2). Beware of rusty pulleys and frayed ropes.
            </p>

            <div className={styles.gameArea}>
                <div className={styles.pulleyContainer}>
                    <svg className={styles.svgPulley} viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}>
                        {/* Ceiling Beam */}
                        <rect x="50" y="10" width="300" height="20" className={styles.beam} />

                        {config.ma === 2 && (
                            <g>
                                {/* Static Ceiling Pulley */}
                                <circle cx="200" cy="50" r="15" className={styles.pulleyWheel} />
                                <line x1="200" y1="30" x2="200" y2="50" stroke="#333" strokeWidth="4" />
                                
                                {/* Dynamic m2 Pulley */}
                                <circle cx="150" cy="150" r="15" className={styles.pulleyWheel} />
                                
                                {/* Ropes */}
                                <path 
                                    className={config.ropeType === 'frayed' ? styles.ropeFrayed : styles.rope} 
                                    d={`M 135 30 L 135 150 A 15 15 0 0 0 165 150 L 165 50 A 15 15 0 0 1 195 50 L 195 ${bucketWeight < 10 ? 150 : 200}`} 
                                />

                                {/* m2 Block */}
                                <rect x="120" y="170" width="60" height="60" fill="#sienna" stroke="#4a2e15" strokeWidth="2" />
                                <text x="150" y="205" className={styles.weightInfo}>{config.m2WeightStr}</text>
                                <line x1="150" y1="165" x2="150" y2="170" stroke="#555" strokeWidth="4" />
                            </g>
                        )}

                        {config.ma === 4 && (
                            <g>
                                {/* We fake an MA=4 with 4 vertical lines supporting m2 */}
                                <circle cx="170" cy="50" r="12" className={styles.pulleyWheel} />
                                <circle cx="210" cy="50" r="12" className={styles.pulleyWheel} />
                                
                                <circle cx="150" cy="150" r="12" className={styles.pulleyWheel} />
                                <circle cx="190" cy="150" r="12" className={config.rustyPulleys ? styles.pulleyWheelRusty : styles.pulleyWheel} />

                                {/* Complex Roping */}
                                <path 
                                    className={styles.rope}
                                    d={`M 138 30 L 138 150 A 12 12 0 0 0 162 150 L 162 50 A 12 12 0 0 1 186 50 L 186 150 A 12 12 0 0 0 210 150 L 210 50 A 12 12 0 0 1 234 50 L 234 ${bucketWeight < 10 ? 150 : 200}`}
                                />

                                {/* m2 Block */}
                                <rect x="130" y="170" width="80" height="60" fill="steelblue" stroke="#1d4ed8" strokeWidth="2" />
                                <text x="170" y="205" className={styles.weightInfo}>{config.m2WeightStr}</text>
                            </g>
                        )}

                        {/* m1 Bucket */}
                        <g transform={`translate(${config.ma === 2 ? 195 : 234}, ${bucketWeight < 10 ? 150 : 200})`}>
                            {hasSnapped && <text x="0" y="-10" fill="red" fontSize="24">💥 SNAP!</text>}
                            {!hasSnapped && (
                                <>
                                    <path d="M -15 0 L 15 0 L 10 30 L -10 30 Z" fill="#64748b" stroke="#334155" strokeWidth="2" />
                                    <path d="M -15 0 A 15 10 0 0 1 15 0" fill="none" stroke="#94a3b8" strokeWidth="2" />
                                    <text x="0" y="20" className={styles.weightInfo} fill="#0f172a">{bucketWeight}kg</text>
                                </>
                            )}
                        </g>

                        {/* Sleeping guy */}
                        <rect x="120" y="300" width="100" height="30" rx="10" fill="#0f766e" />
                        <circle cx="140" cy="300" r="12" fill="#fca5a5" />
                        <text x="140" y="280" fill="#fff" fontSize="16" opacity="0.5">Zzz...</text>
                    </svg>
                </div>

                <div className={styles.controlsPanel}>
                    <div>
                        <h3>BUCKET (m1) PAYLOAD: {bucketWeight}kg</h3>
                        <p>Total tension applied to the rope rig.</p>
                    </div>

                    <div className={styles.weightsGrid}>
                        <button className={styles.weightBtn} onClick={() => addWeight(1)}>+1kg</button>
                        <button className={styles.weightBtn} onClick={() => addWeight(2)}>+2kg</button>
                        <button className={styles.weightBtn} onClick={() => addWeight(5)}>+5kg</button>
                        <button className={styles.weightBtn} onClick={() => addWeight(10)}>+10kg</button>
                        <button className={styles.weightBtn} onClick={() => addWeight(20)}>+20kg</button>
                        <button className={styles.weightBtn} onClick={() => addWeight(50)}>+50kg</button>
                    </div>
                    
                    <button className={styles.weightBtn} style={{ background: '#533', borderColor: '#744' }} onClick={emptyBucket}>
                        Empty Bucket
                    </button>

                    <div className={styles.leverContainer}>
                        <p style={{ margin: '0 0 0.5rem 0', color: '#fca5a5' }}>EMERGENCY LOCK</p>
                        <button 
                            className={`${styles.leverBtn} ${leverPulled ? styles.locked : ''}`}
                            onClick={() => {
                                if (hasSnapped) return;
                                setLeverPulled(!leverPulled);
                            }}
                        >
                            {leverPulled ? 'SYSTEM LOCKED' : 'PULL TO LOCK'}
                        </button>
                    </div>
                </div>
            </div>

            <div className={styles.statusSection}>
                <div className={`${styles.statusMessage} ${isSuccess ? styles.successMsg : hasSnapped ? styles.errorMsg : ''}`}>
                    {hasSnapped ? "FATAL ERROR: ROPE SNAPPED!" : 
                     isSuccess ? "RIGGING SECURE... BALANCE ACHIEVED" : "SYSTEM UNBALANCED"}
                </div>
            </div>

            {hasSnapped && (
                <button className={styles.completeBtn} style={{ background: '#ef4444' }} onClick={() => {
                    setHasSnapped(false);
                    setBucketWeight(0);
                }}>
                    RETRY RIGGING
                </button>
            )}

            {isSuccess && (
                <button className={styles.completeBtn} onClick={onComplete}>
                    COMPLETE FINAL SECTOR
                </button>
            )}
        </div>
    );
}
