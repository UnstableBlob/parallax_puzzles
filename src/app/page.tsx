"use client";

import { useState } from "react";
import styles from "./page.module.css";
import Game1PowerGrid from "../components/Game1PowerGrid";
import Game2Handshake from "../components/Game2Handshake";
import Game3DatabaseSchema from "../components/Game3DatabaseSchema";
import Game4Firewall from "../components/Game4Firewall";
import Game5Decryption from "../components/Game5Decryption";
import Game6HarmonicSynthesizer from "../components/Game6HarmonicSynthesizer";
import Game7EncryptedDials from "../components/Game7EncryptedDials";
import Game8DroneCalibration from "../components/Game8DroneCalibration";
import Game9MinecraftCrucible from "../components/Game9MinecraftCrucible";
import Game10SnoringSabotage from "../components/Game10SnoringSabotage";

const TOTAL_GAMES = 10;
const GAME_TITLES = [
    "Power Grid",
    "Handshake",
    "Database Schema",
    "Firewall",
    "Decryption",
    "Harmonic Synth",
    "Encrypted Dials",
    "Drone Calibration",
    "Crafting Protocol",
    "Snoring Sabotage"
];

export default function Home() {
    const [activeSet, setActiveSet] = useState<1 | 2 | 3 | null>(null);
    const [currentGame, setCurrentGame] = useState(1);
    const [isCompleted, setIsCompleted] = useState(false);

    const nextGame = () => {
        if (currentGame < TOTAL_GAMES) {
            setCurrentGame(prev => prev + 1);
        } else {
            setIsCompleted(true);
        }
    };

    const resetProgress = () => {
        setCurrentGame(1);
        setActiveSet(null);
        setIsCompleted(false);
    };

    return (
        <main className={styles.mainContainer}>
            <div className={styles.gameWrapper}>
                <header className={styles.header}>
                    <h1 className={styles.title}>Paraallax Quest</h1>
                    {activeSet && (
                        <div className={styles.progressSection}>
                            <div className={styles.gameCounter}>Sector {currentGame} of {TOTAL_GAMES} [Set {activeSet}]</div>
                            <div className="progress-container">
                                <div
                                    className="progress-bar"
                                    style={{ width: `${(currentGame / TOTAL_GAMES) * 100}%` }}
                                ></div>
                            </div>
                            {process.env.NODE_ENV === 'development' && !isCompleted && (
                                <button
                                    onClick={nextGame}
                                    className={styles.devSkip}
                                    title="Skip to next game (Dev only)"
                                >
                                    <span>⏭️</span> Dev: Skip Level
                                </button>
                            )}
                        </div>
                    )}
                </header>

                <div className={`glass-card ${styles.gameContent}`}>
                    {!activeSet ? (
                        <div className={styles.setSelectionState}>
                            <h2>SELECT SCENARIO PROTOCOL</h2>
                            <p>Operator, please configure the simulation run parameters.</p>
                            <div className={styles.setButtons}>
                                <button onClick={() => setActiveSet(1)} className={styles.btnPrimary}>PROTOCOL ALPHA (Set 1)</button>
                                <button onClick={() => setActiveSet(2)} className={styles.btnPrimary}>PROTOCOL BETA (Set 2)</button>
                                <button onClick={() => setActiveSet(3)} className={styles.btnPrimary}>PROTOCOL GAMMA (Set 3)</button>
                            </div>
                        </div>
                    ) : !isCompleted ? (
                        <div className={styles.gameArea}>
                            {currentGame === 1 && (
                                <Game1PowerGrid activeSet={activeSet} onComplete={nextGame} />
                            )}
                            {currentGame === 2 && (
                                <Game2Handshake activeSet={activeSet} onComplete={nextGame} />
                            )}
                            {currentGame === 3 && (
                                <Game3DatabaseSchema activeSet={activeSet} onComplete={nextGame} />
                            )}
                            {currentGame === 4 && (
                                <Game4Firewall activeSet={activeSet} onComplete={nextGame} />
                            )}
                            {currentGame === 5 && (
                                <Game5Decryption activeSet={activeSet} onComplete={nextGame} />
                            )}
                            {currentGame === 6 && (
                                <Game6HarmonicSynthesizer activeSet={activeSet} onComplete={nextGame} />
                            )}
                            {currentGame === 7 && (
                                <Game7EncryptedDials activeSet={activeSet} onComplete={nextGame} />
                            )}
                            {currentGame === 8 && (
                                <Game8DroneCalibration activeSet={activeSet} onComplete={nextGame} />
                            )}
                            {currentGame === 9 && (
                                <Game9MinecraftCrucible activeSet={activeSet} onComplete={nextGame} />
                            )}
                            {currentGame === 10 && (
                                <Game10SnoringSabotage activeSet={activeSet} onComplete={nextGame} />
                            )}
                        </div>
                    ) : (
                        <div className={styles.completedState}>
                            <h1>QUEST COMPLETE</h1>
                            <p>All sectors successfully breached. Mainframe access granted.</p>
                            <p>Thank you for testing the Paraallax Challenge.</p>
                            <button onClick={resetProgress} className={styles.btnPrimary}>
                                INITIALIZE NEW RUN
                            </button>
                        </div>
                    )}
                </div>

                {process.env.NODE_ENV === 'development' && (
                    <div className={styles.debugMenu}>
                        <h3>🛠️ DEBUG: DIRECT ACCESS</h3>
                        <div className={styles.debugGrid}>
                            {[1, 2, 3].map(setNum => (
                                <button
                                    key={`set-${setNum}`}
                                    onClick={() => setActiveSet(setNum as 1 | 2 | 3)}
                                    className={`${styles.debugBtn} ${activeSet === setNum ? styles.debugBtnActive : ""}`}
                                    style={{ textAlign: "center", textTransform: "uppercase", fontWeight: "bold" }}
                                >
                                    Set {setNum} {setNum === 1 ? "(A)" : setNum === 2 ? "(B)" : "(G)"}
                                </button>
                            ))}
                        </div>
                        <div style={{ height: "1px", background: "rgba(255, 255, 255, 0.1)", margin: "1rem 0" }}></div>
                        <div className={styles.debugGrid}>
                            {GAME_TITLES.map((title, idx) => {
                                const gameNum = idx + 1;
                                return (
                                    <button
                                        key={gameNum}
                                        onClick={() => {
                                            if (!activeSet) setActiveSet(1);
                                            setCurrentGame(gameNum);
                                            setIsCompleted(false);
                                        }}
                                        className={`${styles.debugBtn} ${currentGame === gameNum && activeSet ? styles.debugBtnActive : ""}`}
                                    >
                                        L{gameNum}: {title}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                <footer className={styles.footer}>
                    <p>&copy; 2024 Paraallax Games</p>
                </footer>
            </div>
        </main>
    );
}
