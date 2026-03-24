"use client";

import React, { useState, useEffect } from 'react';
import styles from './Game9AlchemistCrucible.module.css';

interface Game9Props {
    activeSet: number;
    onComplete: () => void;
}

type Item = 'Silicate' | 'Carbon Rod' | 'Raw Ferrous' | 'Crystalline' | 'Usable Crystalline' | 'Purified Ferrous' | 'Silicate Tool' | 'Ferrous Tool' | 'Crystalline Tool' | 'Receptacle' | 'Lava Receptacle' | 'Obsidian' | null;

interface Recipe {
    pattern: (Item | null)[];
    tempReq: number;
    result: Item;
}

// 3x3 Grid mappings
// 0 1 2
// 3 4 5
// 6 7 8

const RECIPES: Recipe[] = [
    {
        // Silicate Tool (V-shape)
        pattern: [
            'Silicate', null, 'Silicate',
            null, 'Silicate', null,
            null, 'Carbon Rod', null // Approximation of V + rod
        ],
        tempReq: 20,
        result: 'Silicate Tool'
    },
    {
        // Purified Ferrous (Smelt internal slot 4)
        pattern: [
            null, null, null,
            null, 'Raw Ferrous', null,
            null, null, null
        ],
        tempReq: 1200,
        result: 'Purified Ferrous'
    },
    {
        // Thermal Receptacle (Diagonal)
        pattern: [
            'Purified Ferrous', null, null,
            null, 'Purified Ferrous', null,
            null, null, 'Purified Ferrous'
        ],
        tempReq: 20,
        result: 'Receptacle'
    },
    {
        // Ferrous Tool (upside down T)
        pattern: [
            null, 'Carbon Rod', null,
            null, 'Carbon Rod', null,
            'Purified Ferrous', 'Purified Ferrous', 'Purified Ferrous'
        ],
        tempReq: 20,
        result: 'Ferrous Tool'
    },
    {
        // Crystalline Tool (L-shape)
        pattern: [
            'Usable Crystalline', null, null,
            'Usable Crystalline', null, null,
            'Usable Crystalline', 'Carbon Rod', 'Carbon Rod'
        ],
        tempReq: 20,
        result: 'Crystalline Tool'
    }
];

export default function Game9AlchemistCrucible({ activeSet, onComplete }: Game9Props) {
    const [inventory, setInventory] = useState<{item: Item, count: number}[]>([
        { item: 'Silicate', count: 10 },
        { item: 'Carbon Rod', count: 10 },
        { item: 'Raw Ferrous', count: 5 },
        { item: 'Crystalline', count: 5 } // needs breaking
    ]);
    
    const [envLava, setEnvLava] = useState<'Magma' | 'Empty'>('Magma');
    const [envWater, setEnvWater] = useState<'Cryo-Fluid' | 'Empty'>('Cryo-Fluid');
    const [envObsidian, setEnvObsidian] = useState<'Empty' | 'Obsidian'>('Empty');

    const [crucible, setCrucible] = useState<(Item | null)[]>(Array(9).fill(null));
    const [temperature, setTemperature] = useState<number>(20);
    const [selectedInv, setSelectedInv] = useState<Item | null>(null);

    const [isSuccess, setIsSuccess] = useState(false);
    const [message, setMessage] = useState("AWAITING SYNTHESIS...");

    const checkRecipe = () => {
        const matched = RECIPES.find(r => {
            const patternMatch = r.pattern.every((val, i) => crucible[i] === val);
            const tempMatch = (r.tempReq === 20 && temperature < 50) || (r.tempReq === 1200 && temperature >= 1200);
            return patternMatch && tempMatch;
        });

        if (matched) {
            addToInventory(matched.result, 1);
            setCrucible(Array(9).fill(null));
            setMessage(`SYNTHESIZED: ${matched.result}`);
        } else {
            setMessage("ERR: INVALID BLUEPRINT OR TEMP");
        }
    };

    const addToInventory = (item: Item, amount: number) => {
        if (!item) return;
        setInventory(prev => {
            const existing = prev.find(i => i.item === item);
            if (existing) {
                return prev.map(i => i.item === item ? { ...i, count: i.count + amount } : i);
            }
            return [...prev, { item, count: amount }];
        });
    };

    const takeFromInventory = (item: Item, amount: number) => {
        if (!item) return;
        setInventory(prev => {
            return prev.map(i => i.item === item ? { ...i, count: Math.max(0, i.count - amount) } : i).filter(i => i.count > 0);
        });
    };

    const handleCrucibleClick = (idx: number) => {
        if (selectedInv) {
            // place item
            setCrucible(prev => {
                const next = [...prev];
                if (next[idx]) addToInventory(next[idx], 1); // return old
                next[idx] = selectedInv;
                return next;
            });
            takeFromInventory(selectedInv, 1);
            setSelectedInv(null);
        } else if (crucible[idx]) {
            // pickup item
            addToInventory(crucible[idx], 1);
            setCrucible(prev => {
                const next = [...prev];
                next[idx] = null;
                return next;
            });
        }
    };

    const handleInvClick = (item: Item) => {
        if (selectedInv === item) {
            setSelectedInv(null);
        } else {
            // Special interactions
            if (item === 'Crystalline' && selectedInv === 'Ferrous Tool') {
                takeFromInventory('Crystalline', 1);
                addToInventory('Usable Crystalline', 1);
                setMessage("FRACTURED CRYSTALLINE SUCCESSFULLY");
                setSelectedInv(null);
                return;
            }
            setSelectedInv(item);
        }
    };

    const handleEnvClick = (slot: 'Lava' | 'Water' | 'ObsidianArea') => {
        if (slot === 'Lava' && envLava === 'Magma' && selectedInv === 'Receptacle') {
            takeFromInventory('Receptacle', 1);
            addToInventory('Lava Receptacle', 1);
            setEnvLava('Empty');
            setMessage("MAGMA CONTAINED");
            setSelectedInv(null);
        }
        else if (slot === 'Water' && envWater === 'Cryo-Fluid' && selectedInv === 'Lava Receptacle') {
            takeFromInventory('Lava Receptacle', 1);
            addToInventory('Receptacle', 1); // return empty bucket
            setEnvObsidian('Obsidian');
            setMessage("MAGMA RAPIDLY COOLED -> DENSE OBSIDIAN");
            setSelectedInv(null);
        }
        else if (slot === 'ObsidianArea' && envObsidian === 'Obsidian' && selectedInv === 'Crystalline Tool') {
            setIsSuccess(true);
            setMessage("OBSIDIAN FRACTURED... PORTAL ACCESSED");
            setSelectedInv(null);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.headerRow}>
                <h2 className={styles.title}>The Alchemist's Crucible</h2>
                <div className={styles.badge}>SYNTHESIS LAB {activeSet}</div>
            </div>

            <p className={styles.subtitle}>Use the Blueprint to forge tools. Extract Magma, cool it with Cryo-fluid, and break the Obsidian.</p>

            <div className={styles.gameArea}>
                
                <div className={styles.leftPanel}>
                    <div>
                        <div className={styles.sectionTitle}>ENVIRONMENT</div>
                        <div className={styles.envGrid}>
                            <div className={styles.envSlot} onClick={() => handleEnvClick('Lava')} style={{ background: envLava === 'Magma' ? '#7f1d1d' : '#888' }}>
                                {envLava}
                            </div>
                            <div className={styles.envSlot} onClick={() => handleEnvClick('ObsidianArea')} style={{ background: envObsidian === 'Obsidian' ? '#2e1065' : '#111' }}>
                                {envObsidian === 'Obsidian' ? 'Obsidian' : 'Empty'}
                            </div>
                            <div className={styles.envSlot} onClick={() => handleEnvClick('Water')} style={{ background: envWater === 'Cryo-Fluid' ? '#1e3a8a' : '#888' }}>
                                {envWater}
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className={styles.sectionTitle}>INVENTORY BAG</div>
                        <p style={{ fontSize: '0.8rem', opacity: 0.7, marginBottom: '0.5rem' }}>Click to select tool/item</p>
                        <div className={styles.inventoryGrid}>
                            {inventory.map((inv, i) => (
                                <div 
                                    key={i} 
                                    className={`${styles.invItem} ${selectedInv === inv.item ? styles.selected : ''}`}
                                    onClick={() => handleInvClick(inv.item)}
                                >
                                    {inv.item} x{inv.count}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className={styles.rightPanel}>
                    <div className={styles.sectionTitle}>CRUCIBLE GRID</div>
                    
                    <div className={styles.crucibleGrid}>
                        {crucible.map((item, idx) => (
                            <div 
                                key={idx} 
                                className={`${styles.crucibleSlot} ${item ? styles.filled : ''}`}
                                onClick={() => handleCrucibleClick(idx)}
                            >
                                {item ? (item.includes('Tool') ? '🔧' : '📦') : ''}
                                <br />
                                {item && <span style={{fontSize:'0.6rem'}}>{item.substring(0,6)}</span>}
                            </div>
                        ))}
                    </div>

                    <div className={styles.controlsPanel}>
                        <div className={styles.temperatureControl}>
                            <span>TEMP: {temperature}°C</span>
                            <input 
                                type="range" 
                                min="20" 
                                max="2000" 
                                step="10" 
                                value={temperature} 
                                onChange={e => setTemperature(parseInt(e.target.value))}
                                className={styles.tempSlider}
                            />
                        </div>

                        <button className={styles.craftBtn} onClick={checkRecipe}>
                            FORGE / SYNTHESIZE
                        </button>
                    </div>

                </div>

            </div>

            <div className={styles.statusSection}>
                <div className={`${styles.statusMessage} ${isSuccess ? styles.successMsg : ''}`}>
                    {message}
                </div>
            </div>

            {isSuccess && (
                <button className={styles.completeBtn} onClick={onComplete}>
                    Proceed to Sector 10
                </button>
            )}
        </div>
    );
}
