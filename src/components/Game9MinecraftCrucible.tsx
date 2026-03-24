"use client";

import React, { useState, useEffect } from 'react';
import styles from './Game9MinecraftCrucible.module.css';

interface GameProps {
    activeSet: number;
    onComplete: () => void;
}

type Item = 'Cobblestone' | 'Stick' | 'Iron Ore' | 'Iron Ingot' | 'Diamond Ore' | 'Diamond' | 'Stone Pickaxe' | 'Iron Pickaxe' | 'Diamond Pickaxe' | 'Bucket' | 'Lava Bucket' | 'Water Bucket' | null;

interface Recipe {
    pattern: (Item | null)[];
    tempReq: number;
    result: Item;
}

// 3x3 Grid mappings (A1, B1, C1 / A2, B2, C2 / A3, B3, C3)
// 0 1 2
// 3 4 5
// 6 7 8

const RECIPES: Recipe[] = [
    {
        // Stone Pickaxe (V-shape cobble, sticks on sides)
        pattern: [
            'Cobblestone', null, 'Cobblestone',
            'Stick', 'Cobblestone', 'Stick',
            null, null, null
        ],
        tempReq: 20,
        result: 'Stone Pickaxe'
    },
    {
        // Iron Ingot (Smelt internal slot 4 / B2)
        pattern: [
            null, null, null,
            null, 'Iron Ore', null,
            null, null, null
        ],
        tempReq: 1500,
        result: 'Iron Ingot'
    },
    {
        // Bucket (Diagonal)
        pattern: [
            'Iron Ingot', null, null,
            null, 'Iron Ingot', null,
            null, null, 'Iron Ingot'
        ],
        tempReq: 20,
        result: 'Bucket'
    },
    {
        // Iron Pickaxe (Bottom row horizontal, center column vertical)
        // Wait, the manual says:
        // Iron Pickaxe: Iron Ingot: A3, B3, C3 (Bottom Row); Stick: B2, B1 (Center Column)
        // Rows 1-3 are A, B, C? No, Cols A, B, C; Rows 1, 2, 3.
        // A1=0, B1=1, C1=2
        // A2=3, B2=4, C2=5
        // A3=6, B3=7, C3=8
        // Bottom Row (A3, B3, C3) = [6, 7, 8]
        // Center Column (B1, B2) = [1, 4]
        pattern: [
            null, 'Stick', null,
            null, 'Stick', null,
            'Iron Ingot', 'Iron Ingot', 'Iron Ingot'
        ],
        tempReq: 20,
        result: 'Iron Pickaxe'
    },
    {
        // Diamond Pickaxe: Diamond: A1, A2, A3 (Left Column); Stick: B3, C3 (Bottom Right)
        // Left Column (A1, A2, A3) = [0, 3, 6]
        // Bottom Right (B3, C3) = [7, 8]
        pattern: [
            'Diamond', null, null,
            'Diamond', null, null,
            'Diamond', 'Stick', 'Stick'
        ],
        tempReq: 20,
        result: 'Diamond Pickaxe'
    }
];

export default function Game9MinecraftCrucible({ activeSet, onComplete }: GameProps) {
    const [inventory, setInventory] = useState<{item: NonNullable<Item>, count: number}[]>([
        { item: 'Cobblestone', count: 5 },
        { item: 'Stick', count: 10 },
        { item: 'Iron Ore', count: 10 },
        { item: 'Diamond Ore', count: 3 } 
    ]);
    
    const [envLava, setEnvLava] = useState<'Lava Source' | 'Empty'>('Lava Source');
    const [envWater, setEnvWater] = useState<'Water Source' | 'Empty'>('Water Source');
    const [envObsidian, setEnvObsidian] = useState<'Empty' | 'Obsidian' | 'Cobblestone'>('Empty');

    const [crucible, setCrucible] = useState<Item[]>(Array(9).fill(null));
    const [temperature, setTemperature] = useState<number>(20);
    const [selectedInv, setSelectedInv] = useState<Item | null>(null);

    const [isSuccess, setIsSuccess] = useState(false);
    const [message, setMessage] = useState("AWAITING CRAFTING INPUT...");
    const [isCrafting, setIsCrafting] = useState(false);

    const checkRecipe = () => {
        setIsCrafting(true);
        setMessage("FORGING...");
        
        setTimeout(() => {
            const matched = RECIPES.find(r => {
                const patternMatch = r.pattern.every((val, i) => crucible[i] === val);
                // Allow a small margin of error for the 1500C smelting
                const tempMatch = (r.tempReq === 20 && temperature < 100) || (r.tempReq === 1500 && temperature >= 1450 && temperature <= 1550);
                return patternMatch && tempMatch;
            });

            if (matched) {
                addToInventory(matched.result as NonNullable<Item>, 1);
                setCrucible(Array(9).fill(null));
                setMessage(`CRAFTED: ${matched.result}`);
            } else {
                setMessage("ERR: INVALID PATTERN OR TEMPERATURE");
            }
            setIsCrafting(false);
        }, 800);
    };

    const addToInventory = (item: NonNullable<Item>, amount: number) => {
        setInventory(prev => {
            const existing = prev.find(i => i.item === item);
            if (existing) {
                return prev.map(i => i.item === item ? { ...i, count: i.count + amount } : i);
            }
            return [...prev, { item, count: amount }];
        });
    };

    const takeFromInventory = (item: NonNullable<Item>, amount: number) => {
        setInventory(prev => {
            return prev.map(i => i.item === item ? { ...i, count: Math.max(0, i.count - amount) } : i).filter(i => i.count > 0);
        });
    };

    const handleCrucibleClick = (idx: number) => {
        if (selectedInv) {
            setCrucible(prev => {
                const next = [...prev];
                if (next[idx]) addToInventory(next[idx] as NonNullable<Item>, 1); 
                next[idx] = selectedInv;
                return next;
            });
            takeFromInventory(selectedInv as NonNullable<Item>, 1);
            setSelectedInv(null);
        } else if (crucible[idx]) {
            addToInventory(crucible[idx] as NonNullable<Item>, 1);
            setCrucible(prev => {
                const next = [...prev];
                next[idx] = null;
                return next;
            });
        }
    };

    const handleInvClick = (item: NonNullable<Item>) => {
        if (selectedInv === item) {
            setSelectedInv(null);
        } else {
            // Secret Interaction: Breaking Diamond Ore with Iron Pickaxe
            if (item === 'Diamond Ore' && selectedInv === 'Iron Pickaxe') {
                takeFromInventory('Diamond Ore', 1);
                addToInventory('Diamond', 1);
                setMessage("DIAMOND ORE SHATTERED!");
                setSelectedInv(null);
                return;
            }
            setSelectedInv(item);
        }
    };

    const handleEnvClick = (slot: 'Lava' | 'Water' | 'ObsidianArea') => {
        // Gathering Lava
        if (slot === 'Lava' && envLava === 'Lava Source' && selectedInv === 'Bucket') {
            takeFromInventory('Bucket', 1);
            addToInventory('Lava Bucket', 1);
            setEnvLava('Empty');
            setMessage("LAVA COLLECTED");
            setSelectedInv(null);
        }
        // Gathering Water (If they try it)
        else if (slot === 'Water' && envWater === 'Water Source' && selectedInv === 'Bucket') {
            takeFromInventory('Bucket', 1);
            addToInventory('Water Bucket', 1);
            setEnvWater('Empty');
            setMessage("WATER COLLECTED");
            setSelectedInv(null);
        }
        // TRAP: Pouring Water on Lava -> Cobblestone
        else if (slot === 'Lava' && envLava === 'Lava Source' && selectedInv === 'Water Bucket') {
            takeFromInventory('Water Bucket', 1);
            addToInventory('Bucket', 1);
            setEnvLava('Empty');
            setEnvObsidian('Cobblestone');
            setMessage("ERR: PHYSICS INVERTED. LAVA COOLED INTO USELESS COBBLESTONE.");
            setSelectedInv(null);
        }
        // SOLUTION: Pouring Lava into Water -> Obsidian
        else if (slot === 'Water' && envWater === 'Water Source' && selectedInv === 'Lava Bucket') {
            takeFromInventory('Lava Bucket', 1);
            addToInventory('Bucket', 1);
            setEnvWater('Empty');
            setEnvObsidian('Obsidian');
            setMessage("SUCCESS: MAGMA SHOCK-COOLED INTO OBSIDIAN");
            setSelectedInv(null);
        }
        // Winning the level
        else if (slot === 'ObsidianArea' || slot === 'Water' || slot === 'Lava') {
            if (envObsidian === 'Obsidian' && selectedInv === 'Diamond Pickaxe') {
                setIsSuccess(true);
                setMessage("OBSIDIAN FRACTURED... LEVEL CLEARED.");
                setSelectedInv(null);
            }
        }
    };

    // Calculate dynamic color for crucible based on temp
    const crucibleBgColor = temperature < 100 ? '#18181b' : 
                            temperature < 1000 ? '#450a0a' : 
                            temperature >= 1450 && temperature <= 1550 ? '#ea580c' : '#7f1d1d';

    return (
        <div className={styles.container}>
            <div className={styles.headerRow}>
                <h2 className={styles.title}>Anomalous Crafting Protocol</h2>
                <div className={styles.badge}>CRUCIBLE {activeSet}</div>
            </div>

            <div className={styles.gameArea}>
                
                {/* LEFT PANEL - ENVIRONMENT & BAG */}
                <div className={styles.leftPanel}>
                    <div>
                        <div className={styles.sectionTitle}>ENVIRONMENT</div>
                        <div className={styles.envGrid}>
                            <div className={`${styles.envSlot} ${styles['env-' + envLava.replace(' ', '')]}`} onClick={() => handleEnvClick('Lava')}>
                                {envLava === 'Empty' && envObsidian === 'Cobblestone' ? 'Cobblestone' : envLava}
                            </div>
                            <div className={`${styles.envSlot} ${styles['env-' + envWater.replace(' ', '')]}`} onClick={() => handleEnvClick('Water')}>
                                {envWater === 'Empty' && envObsidian === 'Obsidian' ? 'Obsidian' : envWater}
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className={styles.sectionTitle}>INVENTORY BAG</div>
                        <p style={{ fontSize: '0.8rem', opacity: 0.7, marginBottom: '0.5rem' }}>Select item, then click target.</p>
                        <div className={styles.inventoryGrid}>
                            {inventory.map((inv, i) => (
                                <div 
                                    key={i} 
                                    className={`${styles.invItem} ${selectedInv === inv.item ? styles.selected : ''}`}
                                    onClick={() => handleInvClick(inv.item)}
                                >
                                    {/* Replace this div with an actual <img> tag later */}
                                    <div className={styles.itemSpritePlaceholder}></div>
                                    <span>{inv.item} <span style={{color: '#eab308'}}>x{inv.count}</span></span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* RIGHT PANEL - CRAFTING GRID */}
                <div className={styles.rightPanel}>
                    <div className={styles.sectionTitle}>CRAFTING CRUCIBLE</div>
                    
                    <div className={styles.crucibleContainer} style={{ backgroundColor: crucibleBgColor }}>
                        {/* Column Labels */}
                        <div className={styles.gridLabelsTop}>
                            <span>A</span><span>B</span><span>C</span>
                        </div>
                        
                        <div style={{display: 'flex'}}>
                            {/* Row Labels */}
                            <div className={styles.gridLabelsSide}>
                                <span>1</span><span>2</span><span>3</span>
                            </div>
                            
                            <div className={styles.crucibleGrid}>
                                {crucible.map((item, idx) => (
                                    <div 
                                        key={idx} 
                                        className={`${styles.crucibleSlot} ${item ? styles.filled : ''}`}
                                        onClick={() => handleCrucibleClick(idx)}
                                    >
                                        {/* You can inject background images via CSS based on the item string */}
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className={styles.controlsPanel}>
                        <div className={styles.temperatureControl}>
                            <span style={{fontWeight: 'bold', color: temperature >= 1450 && temperature <= 1550 ? '#fde047' : '#fff'}}>
                                FURNACE TEMP: {temperature}°C
                            </span>
                            <input 
                                type="range" 
                                min="20" max="2000" step="10" 
                                value={temperature} 
                                onChange={e => setTemperature(parseInt(e.target.value))}
                                className={styles.tempSlider}
                            />
                        </div>

                        <button 
                            className={`${styles.craftBtn} ${isCrafting ? styles.craftingActive : ''}`} 
                            onClick={checkRecipe}
                            disabled={isCrafting}
                        >
                            {isCrafting ? 'FORGING...' : 'CRAFT / SMELT'}
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
                    PROCEED TO NEXT SECTOR
                </button>
            )}
        </div>
    );
}
