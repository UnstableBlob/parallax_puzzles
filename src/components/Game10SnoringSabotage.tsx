"use client";

import React, { useState, useEffect } from 'react';
import styles from './Game10SnoringSabotage.module.css';

interface GameProps {
    activeSet: number;
    onComplete: () => void;
}

interface PulleyConfig {
    containerStr: string;
    materialStr: string;
    ma: number; // Mechanical Advantage (2, 3, or 4)
    rustyCount: number;
    ropeDesc: string;
    ropeColor: string;
    maxTension: number; 
    targetM1: number; 
    requiresLever: boolean; 
}

// THE LOGIC (Equally difficult sets):
// Set 1: Crate(10) * Lead(12) = 120kg. MA=3 -> 40kg. Rusty=1(+5) -> Target: 45kg. Green Braided max is 150. (45 < 150) -> Safe.
// Set 2: Safe(5) * Gold(20) = 100kg. MA=2 -> 50kg. Rusty=2(+10) -> Target: 60kg. Red Frayed max is 40. (60 > 40) -> TRAP! Pull Lever.
// Set 3: Barrel(20) * Scrap(8) = 160kg. MA=4 -> 40kg. Rusty=3(+15) -> Target: 55kg. Blue Thick max is 200. (55 < 200) -> Safe.

const SET_CONFIGS: Record<number, PulleyConfig> = {
    1: {
        containerStr: 'STEEL CRATE',
        materialStr: 'LEAD',
        ma: 3,
        rustyCount: 1,
        ropeDesc: 'Green Braided',
        ropeColor: '#16a34a',
        maxTension: 150,
        targetM1: 45,
        requiresLever: false
    },
    2: {
        containerStr: 'CAST IRON SAFE',
        materialStr: 'GOLD BARS',
        ma: 2,
        rustyCount: 2,
        ropeDesc: 'Red Frayed',
        ropeColor: '#dc2626',
        maxTension: 40,
        targetM1: 0, 
        requiresLever: true
    },
    3: {
        containerStr: 'WOODEN BARREL',
        materialStr: 'SCRAP IRON',
        ma: 4,
        rustyCount: 3,
        ropeDesc: 'Blue Thick',
        ropeColor: '#2563eb',
        maxTension: 200,
        targetM1: 55,
        requiresLever: false
    }
};

export default function Game10SnoringSabotage({ activeSet, onComplete }: GameProps) {
    const config = SET_CONFIGS[activeSet] || SET_CONFIGS[1];

    const [bucketWeight, setBucketWeight] = useState(0);
    const [leverPulled, setLeverPulled] = useState(false);
    
    const [isSuccess, setIsSuccess] = useState(false);
    const [hasSnapped, setHasSnapped] = useState(false);

    useEffect(() => {
        if (hasSnapped) return;

        // Snapping Logic: If bucket weight strictly exceeds max tension, it snaps immediately.
        if (bucketWeight > config.maxTension) {
            setHasSnapped(true);
            return;
        }

        if (config.requiresLever) {
            if (leverPulled) {
                setIsSuccess(true);
            }
        } else {
            if (bucketWeight === config.targetM1 && !leverPulled) {
                setIsSuccess(true);
            } else {
                setIsSuccess(false);
            }
        }
    }, [bucketWeight, leverPulled, config, hasSnapped]);

    const addWeight = (w: number) => {
        if (isSuccess || hasSnapped || leverPulled) return;
        setBucketWeight(prev => prev + w);
    };

    const emptyBucket = () => {
        if (isSuccess || hasSnapped || leverPulled) return;
        setBucketWeight(0);
    };

    const SVG_WIDTH = 400;
    const SVG_HEIGHT = 380;

    // Helper to render different load containers
    const renderLoadContainer = () => {
        const type = config.containerStr.toLowerCase();
        if (type.includes('crate')) {
            return (
                <g>
                    <rect x="0" y="0" width="80" height="70" fill="#4b3621" stroke="#2a1b0d" strokeWidth="3" />
                    <line x1="0" y1="0" x2="80" y2="70" stroke="#2a1b0d" strokeWidth="2" opacity="0.5" />
                    <line x1="80" y1="0" x2="0" y2="70" stroke="#2a1b0d" strokeWidth="2" opacity="0.5" />
                    <rect x="10" y="10" width="60" height="50" fill="none" stroke="#2a1b0d" strokeWidth="2" opacity="0.3" />
                </g>
            );
        } else if (type.includes('safe')) {
            return (
                <g>
                    <rect x="0" y="0" width="80" height="70" rx="4" fill="#334155" stroke="#0f172a" strokeWidth="3" />
                    <circle cx="60" cy="35" r="10" fill="#94a3b8" stroke="#1e293b" />
                    <rect x="58" y="30" width="4" height="10" fill="#1e293b" rx="1" />
                    <rect x="5" y="5" width="70" height="60" fill="none" stroke="#1e293b" strokeWidth="1" opacity="0.5" />
                </g>
            );
        } else { // Barrel
            return (
                <g>
                    <path d="M 10 0 Q 0 35 10 70 L 70 70 Q 80 35 70 0 Z" fill="#78350f" stroke="#451a03" strokeWidth="3" />
                    <line x1="5" y1="15" x2="75" y2="15" stroke="#451a03" strokeWidth="2" opacity="0.6" />
                    <line x1="2" y1="35" x2="78" y2="35" stroke="#451a03" strokeWidth="2" opacity="0.6" />
                    <line x1="5" y1="55" x2="75" y2="55" stroke="#451a03" strokeWidth="2" opacity="0.6" />
                </g>
            );
        }
    };

    // Dynamically draw the vertical ropes based on MA as a continuous line
    const renderRopes = () => {
        const color = config.ropeColor;
        const isFrayed = config.ropeDesc.includes('Frayed');
        const dash = isFrayed ? "8 4" : "none";
        
        // We'll draw one continuous path that weaves through
        // Base points: Top pulleys at 130, 170, 210. Load pulleys at 130, 170.
        // This is a simplification but look better than separate lines.
        
        let path = "";
        if (config.ma === 2) {
            // Anchor at top (130, 50) -> down to load (130, 135) -> wrap under (170, 135) -> up to pulley (170, 50) -> cross to bucket (250)
            path = `M 130 50 L 130 135 A 15 10 0 0 0 160 135 L 160 50 A 15 10 0 0 1 190 50 L 250 50`;
        } else if (config.ma === 3) {
            // Anchor at bucket (250) -> top pulley (210) -> load pulley (190) -> top pulley (170) -> load pulley (150) -> anchor at top (130)
            path = `M 130 50 L 130 135 A 10 8 0 0 0 150 135 L 150 50 A 10 8 0 0 1 170 50 L 170 135 A 10 8 0 0 0 190 135 L 190 50 A 10 8 0 0 1 210 50 L 250 50`;
        } else { // MA 4
            path = `M 120 50 L 120 135 A 8 6 0 0 0 140 135 L 140 50 A 8 6 0 0 1 160 50 L 160 135 A 8 6 0 0 0 180 135 L 180 50 A 8 6 0 0 1 200 50 L 200 135 A 8 6 0 0 0 220 135 L 220 50 A 8 6 0 0 1 240 50 L 250 50`;
        }

        return (
            <path d={path} stroke={color} strokeWidth="3" fill="none" strokeDasharray={dash} strokeLinecap="round" />
        );
    };

    // Dynamically render rusty vs normal pulleys
    const renderPulleys = () => {
        const pulleys = [];
        // Fixed Top Pulleys
        for (let i = 0; i < 3; i++) {
            const isRusty = i < config.rustyCount;
            const px = 130 + (i * 40);
            pulleys.push(
                <g key={`top-pulley-${i}`}>
                    {/* Support Rod to ceiling */}
                    <line x1={px} y1="30" x2={px} y2="50" stroke="#334155" strokeWidth="4" />
                    <g transform={`translate(${px}, 50)`}>
                        <circle cx="0" cy="0" r="15" fill={isRusty ? '#b45309' : '#94a3b8'} stroke="#1e293b" strokeWidth="2" />
                        <circle cx="0" cy="0" r="12" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                        <circle cx="0" cy="0" r="4" fill="#1e293b" />
                        {isRusty && <path d="M-8 -8 L8 8 M-8 8 L8 -8" stroke="#78350f" strokeWidth="2" opacity="0.4"/>}
                    </g>
                </g>
            );
        }
        return pulleys;
    };

    return (
        <div className={styles.container}>
            <div className={styles.headerRow}>
                <h2 className={styles.title}>The Snoring Sabotage</h2>
                <div className={styles.badge}>RIGGING STATION {activeSet}</div>
            </div>

            <p className={styles.subtitle}>
                Consult the Rigger's Almanac. Calculate the exact bucket payload ($m_1$) to balance the load ($m_2$). Beware of rusty pulleys and rope tensile limits.
            </p>

            <div className={styles.gameArea}>
                <div className={styles.pulleyContainer}>
                    <svg className={styles.svgPulley} viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}>
                        {/* Ceiling Beam */}
                        <defs>
                            <linearGradient id="beamGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#475569" />
                                <stop offset="50%" stopColor="#1e293b" />
                                <stop offset="100%" stopColor="#0f172a" />
                            </linearGradient>
                        </defs>
                        <rect x="50" y="5" width="300" height="25" fill="url(#beamGrad)" rx="2" />

                        {/* Top Pulleys */}
                        {renderPulleys()}

                        {/* Dynamic MA Ropes supporting the load */}
                        {renderRopes()}

                        {/* Line leading to bucket */}
                        <path 
                            d={`M 250 50 L 250 ${bucketWeight < 10 ? 150 : 200}`} 
                            stroke={config.ropeColor} 
                            strokeWidth="3" 
                            fill="none" 
                            strokeDasharray={config.ropeDesc.includes('Frayed') ? "8 4" : "none"}
                            strokeLinecap="round"
                        />

                        {/* m2 Block (The Load) */}
                        <g transform="translate(100, 135)">
                            {/* Pulley Block on top of container */}
                            <rect x="15" y="0" width="70" height="15" rx="4" fill="#475569" stroke="#1e293b" strokeWidth="2" />
                            <circle cx="30" cy="7" r="5" fill="#1e293b" />
                            <circle cx="50" cy="7" r="5" fill="#1e293b" />
                            <circle cx="70" cy="7" r="5" fill="#1e293b" />
                            <line x1="35" y1="15" x2="35" y2="25" stroke="#1e293b" strokeWidth="4" />
                            <line x1="65" y1="15" x2="65" y2="25" stroke="#1e293b" strokeWidth="4" />
                            
                            {/* Container itself */}
                            <g transform="translate(5, 15)">
                                {renderLoadContainer()}
                                <text x="40" y="30" fill="rgba(255,255,255,0.8)" fontSize="10" textAnchor="middle" fontWeight="bold">{config.containerStr}</text>
                                <text x="40" y="45" fill="rgba(255,255,255,0.6)" fontSize="9" textAnchor="middle">PROPERTY OF SECTOR 10</text>
                            </g>
                        </g>

                        {/* m1 Bucket */}
                        <g transform={`translate(250, ${bucketWeight < 10 ? 150 : 200})`}>
                            {hasSnapped && <text x="0" y="-15" fill="#ef4444" fontSize="24" textAnchor="middle" fontWeight="bold" filter="drop-shadow(0 0 5px red)">💥 SNAP!</text>}
                            {!hasSnapped && (
                                <>
                                    <path d="M -20 0 L 20 0 L 15 45 L -15 45 Z" fill="#475569" stroke="#1e293b" strokeWidth="2" />
                                    <path d="M -20 0 A 20 10 0 0 1 20 0" fill="#64748b" stroke="#1e293b" strokeWidth="2" />
                                    <text x="0" y="28" fill="#fff" fontSize="14" textAnchor="middle" fontWeight="bold" style={{ textShadow: '0 0 5px rgba(0,0,0,1)' }}>{bucketWeight}kg</text>
                                </>
                            )}
                        </g>

                        {/* Sleeping guy */}
                        <g transform="translate(100, 310)">
                            <rect x="0" y="0" width="100" height="40" rx="10" fill="#134e4a" stroke="#064e3b" strokeWidth="2" />
                            <circle cx="20" cy="5" r="14" fill="#fca5a5" stroke="#f87171" strokeWidth="1" />
                            <rect x="15" y="10" width="70" height="20" rx="5" fill="#0f766e" />
                            {hasSnapped ? (
                                <text x="20" y="-10" fill="#ef4444" fontSize="16" fontWeight="bold" textAnchor="middle">! WAKE !</text>
                            ) : (
                                <g>
                                    <text x="50" y="-10" fill="#fff" fontSize="16" opacity="0.5" textAnchor="middle">Zzz...</text>
                                    <circle cx="25" cy="2" r="1" fill="#000" />
                                    <circle cx="15" cy="2" r="1" fill="#000" />
                                    <path d="M 17 8 Q 20 12 23 8" fill="none" stroke="#000" strokeWidth="1" />
                                </g>
                            )}
                        </g>
                    </svg>
                </div>

                <div className={styles.controlsPanel}>
                    <div className={styles.scanData}>
                        <div className={styles.scanDataTitle}>TARGET SCAN</div>
                        <div>CONTAINER: <span style={{ color: '#fff' }}>{config.containerStr}</span></div>
                        <div>CONTENTS: <span style={{ color: '#fff' }}>{config.materialStr}</span></div>
                        <div>ROPES (MA): <span style={{ color: '#fff' }}>{config.ma} VERT</span></div>
                        <div>PULLEYS: <span style={{ color: '#fbbf24' }}>{config.rustyCount} RUSTY</span></div>
                        <div>ROPE: <span style={{ color: config.ropeColor }}>{config.ropeDesc}</span></div>
                    </div>

                    <div>
                        <h3 style={{ margin: '0 0 5px 0' }}>BUCKET (m1) PAYLOAD</h3>
                        <p style={{ margin: '0 0 15px 0', fontSize: '0.9rem', color: '#94a3b8' }}>Total tension applied to rig.</p>
                    </div>

                    <div className={styles.weightsGrid} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '15px' }}>
                        {[1, 2, 5, 10, 20, 50].map(w => (
                            <button key={w} className={styles.weightBtn} onClick={() => addWeight(w)} style={{ padding: '10px', background: '#334155', border: '1px solid #475569', color: '#fff', cursor: 'pointer', borderRadius: '4px' }}>
                                +{w}kg
                            </button>
                        ))}
                    </div>
                    
                    <button className={styles.weightBtn} style={{ width: '100%', padding: '10px', background: '#450a0a', border: '1px solid #7f1d1d', color: '#fff', cursor: 'pointer', borderRadius: '4px', marginBottom: '20px' }} onClick={emptyBucket}>
                        Empty Bucket
                    </button>

                    <div className={styles.leverContainer} style={{ padding: '15px', background: '#1e293b', border: '2px dashed #475569', textAlign: 'center' }}>
                        <p style={{ margin: '0 0 10px 0', color: '#fca5a5', fontWeight: 'bold' }}>EMERGENCY LOCK</p>
                        <button 
                            className={`${styles.leverBtn} ${leverPulled ? styles.locked : ''}`}
                            onClick={() => {
                                if (hasSnapped) return;
                                setLeverPulled(!leverPulled);
                            }}
                            style={{ 
                                width: '100%', padding: '15px', 
                                background: leverPulled ? '#16a34a' : '#dc2626', 
                                border: 'none', color: '#fff', fontWeight: 'bold', cursor: 'pointer', borderRadius: '4px',
                                textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                            }}
                        >
                            {leverPulled ? 'SYSTEM LOCKED' : 'PULL TO LOCK'}
                        </button>
                    </div>
                </div>
            </div>

            <div className={styles.statusSection} style={{ marginTop: '20px', padding: '15px', background: '#0f172a', textAlign: 'center', fontWeight: 'bold', borderRadius: '4px' }}>
                <div style={{ color: hasSnapped ? '#ef4444' : isSuccess ? '#4ade80' : '#fbbf24' }}>
                    {hasSnapped ? "FATAL ERROR: ROPE SNAPPED! TARGET AWAKE!" : 
                     isSuccess ? "RIGGING SECURE... BALANCE ACHIEVED" : "SYSTEM UNBALANCED... AWAITING WEIGHT"}
                </div>
            </div>

            {hasSnapped && (
                <button style={{ width: '100%', padding: '15px', marginTop: '15px', background: '#ef4444', color: '#fff', fontWeight: 'bold', border: 'none', cursor: 'pointer', borderRadius: '4px' }} onClick={() => {
                    setHasSnapped(false);
                    setBucketWeight(0);
                    setLeverPulled(false);
                }}>
                    RETRY RIGGING
                </button>
            )}

            {isSuccess && (
                <button style={{ width: '100%', padding: '15px', marginTop: '15px', background: '#4ade80', color: '#000', fontWeight: 'bold', border: 'none', cursor: 'pointer', borderRadius: '4px' }} onClick={onComplete}>
                    COMPLETE FINAL SECTOR
                </button>
            )}
        </div>
    );
}
