"use client";

import { useState } from "react";
import styles from "./page.module.css";
import Game1PowerGrid from "../components/Game1PowerGrid";
import Game2Handshake from "../components/Game2Handshake";
import Game3DatabaseSchema from "../components/Game3DatabaseSchema";
import Game4Firewall from "../components/Game4Firewall";
import Game5OS from "../components/Game5OS";
import Game6Networking from "../components/Game6Networking";
import Game7DCG from "../components/Game7DCG";
import Game8MRMAS from "../components/Game8MRMAS";

// All games are part of the main sequence
const TOTAL_GAMES = 8;
const ALL_GAMES = 8;

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

    // Dev only: jump directly to any game
    const devJumpTo = (gameNum: number) => {
        setIsCompleted(false);
        setCurrentGame(gameNum);
        if (!activeSet) setActiveSet(1);
    };

    return (
        <main className={styles.mainContainer}>
            <div className={styles.gameWrapper}>

                {/* DEV ONLY: Game jump bar */}
                {process.env.NODE_ENV === 'development' && (
                    <div className={styles.devJumpBar}>
                        <span className={styles.devJumpLabel}>DEV JUMP:</span>
                        {Array.from({ length: ALL_GAMES }, (_, i) => i + 1).map(n => (
                            <button
                                key={n}
                                className={`${styles.devJumpBtn} ${currentGame === n && activeSet ? styles.devJumpBtnActive : ''}`}
                                onClick={() => devJumpTo(n)}
                                title={`Jump to Game ${n}${n > TOTAL_GAMES ? ' (WIP)' : ''}`}
                            >
                                G{n}{n > TOTAL_GAMES ? ' 🚧' : ''}
                            </button>
                        ))}
                    </div>
                )}

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
                                <Game5OS activeSet={activeSet} onComplete={nextGame} />
                            )}
                            {currentGame === 6 && (
                                <Game6Networking activeSet={activeSet} onComplete={nextGame} />
                            )}
                            {currentGame === 7 && (
                                <Game7DCG activeSet={activeSet} onComplete={nextGame} />
                            )}
                            {currentGame === 8 && (
                                <Game8MRMAS activeSet={activeSet} onComplete={nextGame} />
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

                <footer className={styles.footer}>
                    <p>&copy; 2024 Paraallax Games</p>
                </footer>
            </div>
        </main>
    );
}
