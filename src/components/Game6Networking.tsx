"use client";

import React, { useState, useRef, useEffect } from "react";
import styles from "./Game6Networking.module.css";

type Level = {
  id: number;
  intro: string;
  protocol: string;
  blocked: string[];
  correctRoute: string[];
  map: string[];
};

const levels: Level[] = [

  {
    id: 1,
    intro: "SET 1",
    protocol: "TCP",
    blocked: ["R5"],
    correctRoute: ["CLIENT","R1","R3","R7","R8","SERVER"],
    map: [
      "          R2",
      "         /  \\",
      "CLIENT -R1   R3",
      "        \\    / \\",
      "         \\  /   R7",
      "          R4     |",
      "         /  \\    |",
      "       R5   R6   |",
      "        \\   /    |",
      "         \\ /     |",
      "          R8 ----",
      "           |",
      "        SERVER"
    ]
  },

  {
    id: 2,
    intro: "SET 2",
    protocol: "TCP",
    blocked: ["R6"],
    correctRoute: ["CLIENT","R1","R4","R7","R8","SERVER"],
    map: [
      "          R2",
      "         /  \\",
      "CLIENT -R1   R3",
      "        \\    / \\",
      "         R4  R5  R7",
      "          \\  |   |",
      "           \\ |   |",
      "            R6   |",
      "             \\   |",
      "              \\  |",
      "               R8",
      "                |",
      "             SERVER"
    ]
  },

  {
    id: 3,
    intro: "SET 3",
    protocol: "TCP",
    blocked: ["R4"],
    correctRoute: ["CLIENT","R1","R2","R5","R7","R8","SERVER"],
    map: [
      "          R3",
      "         /  \\",
      "CLIENT -R1   R2",
      "        \\    / \\",
      "         R4  R5  R6",
      "          |   \\  |",
      "          |    \\ |",
      "          |     R7",
      "          |     |",
      "          \\-----R8",
      "                |",
      "             SERVER"
    ]
  }

];

const routerProtocol: Record<string,string> = {
  R1:"TCP", R2:"UDP", R3:"TCP", R4:"TCP",
  R5:"TCP", R6:"UDP", R7:"TCP", R8:"TCP"
};

interface Props {
  activeSet: 1 | 2 | 3;
  onComplete: () => void;
}

export default function Game6Networking({ activeSet, onComplete }: Props) {

  const initialIndex = activeSet - 1;

  const [levelIndex, setLevelIndex] = useState(initialIndex);
  const levelIndexRef = useRef(initialIndex);

  const [input, setInput] = useState("");

  const [lines, setLines] = useState<string[]>([
    levels[initialIndex].intro
  ]);

  useEffect(() => {
    levelIndexRef.current = levelIndex;
  }, [levelIndex]);

  const print = (text: string) => {
    setLines(prev => [...prev, text]);
  };

  const handleCommand = (cmd: string) => {
    print(`> ${cmd}`);

    const currentLevel = levels[levelIndexRef.current];

    if (cmd === "help") {
      print("Available commands:");
      print("network-map");
      print("router-status");
      print("protocol-support");
      print("route <path>");
    }

    else if (cmd === "network-map") {
      currentLevel.map.forEach(line => print(line));
    }

    else if (cmd === "router-status") {
      print("ROUTER   STATUS");
      Object.keys(routerProtocol).forEach(r => {
        print(`${r}     ${currentLevel.blocked.includes(r) ? "BLOCKED" : "ACTIVE"}`);
      });
    }

    else if (cmd === "protocol-support") {
      print("ROUTER   PROTOCOL");
      Object.entries(routerProtocol).forEach(([r,p]) => {
        print(`${r}     ${p}`);
      });
      print(`Packet Protocol: ${currentLevel.protocol}`);
    }

    else if (cmd.startsWith("route")) {
      const path = cmd.replace("route ","").split("-");

      if (JSON.stringify(path) === JSON.stringify(currentLevel.correctRoute)) {

        print("Routing packet...");
        print(`PATH: ${path.join(" → ")}`);
        print("All constraints satisfied");
        print("PACKET DELIVERED");

        if (levelIndexRef.current < levels.length - 1) {

          print(`--- SET ${currentLevel.id} COMPLETE ---`);

          const nextLevelIndex = levelIndexRef.current + 1;

          print(levels[nextLevelIndex].intro);

          setLevelIndex(nextLevelIndex);

        } else {
          print("ALL SETS COMPLETED");
          setTimeout(() => onComplete(), 2000);
        }

      } else {
        print("Invalid route");
      }
    }

    else {
      print("Unknown command");
    }

    setInput("");
  };

  const renderHeader = () => (
    <div className={styles.headerWrapper}>

      <div className={styles.line}>PARALLAX NETWORK CORE v2.1</div>
      <div className={styles.line}>CRITICAL: PACKET ROUTING FAILURE</div>

      <div className={styles.headerGrid}>

        <div>
          <div className={styles.line}>Origin: CLIENT</div>
          <div className={styles.line}>Destination: SERVER</div>
          <div className={styles.line}>Reconstruct valid route</div>
        </div>

        <div>
          <div className={styles.line}>network-map</div>
          <div className={styles.line}>router-status</div>
          <div className={styles.line}>protocol-support</div>
        </div>

      </div>
    </div>
  );

  return (
    <div className={styles.container}>

      <div className={styles.terminal}>

        {renderHeader()}

        {lines.map((line, i) => (
          <div key={i} className={styles.line}>
            {line}
          </div>
        ))}

        <div className={styles.inputLine}>
          <span>&gt;</span>
          <input
            value={input}
            onChange={(e)=>setInput(e.target.value)}
            onKeyDown={(e)=> e.key==="Enter" && handleCommand(input)}
            autoFocus
          />
        </div>

      </div>
    </div>
  );
}