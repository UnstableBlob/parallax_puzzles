"use client";

import React, { useState, useRef, useEffect, FormEvent } from "react";
import styles from "./Game5OS.module.css";

interface Props {
    activeSet?: number;
    onComplete: () => void;
}

interface Line {
    id: number;
    text: string;
    type: "input" | "output" | "system" | "error" | "success" | "tableHeader" | "tableRow";
    columns?: string[];
    tableType?: "ps" | "resource" | "waiting";
}

const SETS = {
    1: {
        answer: "kill 344",
        processes: [
            { pid: "121", user: "root",    state: "R", cmd: "kernel_task" },
            { pid: "233", user: "api",     state: "W", cmd: "worker_pool" },
            { pid: "344", user: "cache",   state: "S", cmd: "redis_svr"  },
            { pid: "455", user: "sync",    state: "W", cmd: "db_sync"    },
            { pid: "566", user: "logger",  state: "S", cmd: "log_agent"  },
            { pid: "677", user: "worker",  state: "W", cmd: "sys_cron"   },
            { pid: "788", user: "backup",  state: "R", cmd: "tar_gzip"   },
            { pid: "899", user: "monitor", state: "S", cmd: "health_chk" },
        ],
        resources: [
            { name: "DB_LOCK",    pid: "455", usage: "88%"  },
            { name: "CACHE_LOCK", pid: "344", usage: "95%"  },
            { name: "LOG_FILE",   pid: "566", usage: "42%"  },
            { name: "THREAD_Q",   pid: "233", usage: "100%" },
            { name: "TEMP_BUF",   pid: "899", usage: "67%"  },
        ],
        waiting: [
            { pid: "233", resource: "DB_LOCK",    time: "04:12" },
            { pid: "455", resource: "CACHE_LOCK", time: "03:55" },
            { pid: "677", resource: "THREAD_Q",   time: "01:30" },
            { pid: "788", resource: "LOG_FILE",   time: "00:45" },
        ],
        releaseLogs: [
            "CACHE_LOCK released",
            "455 → RUNNING",
            "233 → RUNNING",
            "677 → RUNNING",
        ],
    },

    2: {
        answer: "kill 150",
        processes: [
            { pid: "101", user: "root",    state: "R", cmd: "kernel_task"  },
            { pid: "501", user: "api",     state: "W", cmd: "queue_mgr"   },
            { pid: "150", user: "memory",  state: "S", cmd: "cache_daemon" },
            { pid: "290", user: "sync",    state: "W", cmd: "disk_sync"   },
            { pid: "333", user: "logger",  state: "S", cmd: "audit_log"   },
            { pid: "812", user: "worker",  state: "W", cmd: "job_runner"  },
            { pid: "777", user: "backup",  state: "R", cmd: "tar_gzip"    },
            { pid: "666", user: "monitor", state: "S", cmd: "health_chk"  },
        ],
        resources: [
            { name: "IO_LOCK",    pid: "290", usage: "91%"  },
            { name: "MEM_LOCK",   pid: "150", usage: "97%"  },
            { name: "AUDIT_FILE", pid: "333", usage: "40%"  },
            { name: "QUEUE",      pid: "501", usage: "100%" },
            { name: "TEMP_SWAP",  pid: "666", usage: "65%"  },
        ],
        waiting: [
            { pid: "501", resource: "IO_LOCK",    time: "02:55" },
            { pid: "290", resource: "MEM_LOCK",   time: "03:20" },
            { pid: "812", resource: "QUEUE",      time: "01:10" },
            { pid: "777", resource: "AUDIT_FILE", time: "00:50" },
        ],
        releaseLogs: [
            "MEM_LOCK released",
            "290 → RUNNING",
            "501 → RUNNING",
            "812 → RUNNING",
        ],
    },

    3: {
        answer: "kill 305",
        processes: [
            { pid: "111", user: "root",    state: "R", cmd: "kernel_task" },
            { pid: "610", user: "api",     state: "W", cmd: "http_pool"  },
            { pid: "305", user: "cache",   state: "S", cmd: "mem_cache"  },
            { pid: "480", user: "sync",    state: "W", cmd: "fs_sync"    },
            { pid: "222", user: "logger",  state: "S", cmd: "log_agent"  },
            { pid: "920", user: "worker",  state: "W", cmd: "cron_exec"  },
            { pid: "701", user: "backup",  state: "R", cmd: "gzip"       },
            { pid: "555", user: "monitor", state: "S", cmd: "metrics"    },
        ],
        resources: [
            { name: "NET_LOCK",    pid: "480", usage: "89%"  },
            { name: "CACHE_UNIT",  pid: "305", usage: "96%"  },
            { name: "LOG_STREAM",  pid: "222", usage: "35%"  },
            { name: "THREAD_POOL", pid: "610", usage: "100%" },
            { name: "TEMP_QUEUE",  pid: "555", usage: "60%"  },
        ],
        waiting: [
            { pid: "610", resource: "NET_LOCK",    time: "03:40" },
            { pid: "480", resource: "CACHE_UNIT",  time: "02:50" },
            { pid: "920", resource: "THREAD_POOL", time: "01:20" },
            { pid: "701", resource: "LOG_STREAM",  time: "00:30" },
        ],
        releaseLogs: [
            "CACHE_UNIT released",
            "480 → RUNNING",
            "610 → RUNNING",
            "920 → RUNNING",
        ],
    },
};

export default function Game5OS({ activeSet = 1, onComplete }: Props) {

    const currentSet = SETS[activeSet as 1 | 2 | 3];

    const idRef = useRef(1);
    const bottomRef = useRef<HTMLDivElement>(null);

    const buildInitialLines = (): Line[] => {
        let id = 1;
        const arr: Line[] = [];

        arr.push({ id: id++, text: "PARALLAX OS v5.0", type: "system" });
        arr.push({ id: id++, text: "⚠ CRITICAL: PROCESS DEADLOCK DETECTED", type: "error" });

        // ── ps ──────────────────────────────────────────────
        arr.push({ id: id++, text: "$ ps", type: "input" });
        arr.push({
            id: id++, text: "",
            type: "tableHeader",
            columns: ["PID", "USER", "STATE", "COMMAND"],
            tableType: "ps",
        });
        currentSet.processes.forEach(p => {
            arr.push({
                id: id++, text: "",
                type: "tableRow",
                columns: [p.pid, p.user, p.state, p.cmd],
                tableType: "ps",
            });
        });

        arr.push({ id: id++, text: "", type: "output" });

        // ── resource-map ─────────────────────────────────────
        arr.push({ id: id++, text: "$ resource-map", type: "input" });
        arr.push({
            id: id++, text: "",
            type: "tableHeader",
            columns: ["RESOURCE", "LOCKED_BY", "USAGE_PCT"],
            tableType: "resource",
        });
        currentSet.resources.forEach(r => {
            arr.push({
                id: id++, text: "",
                type: "tableRow",
                columns: [r.name, r.pid, r.usage],
                tableType: "resource",
            });
        });

        arr.push({ id: id++, text: "", type: "output" });

        // ── waiting-list ──────────────────────────────────────
        arr.push({ id: id++, text: "$ waiting-list", type: "input" });
        arr.push({
            id: id++, text: "",
            type: "tableHeader",
            columns: ["PID", "WAITING_FOR", "TIME_WAIT"],
            tableType: "waiting",
        });
        currentSet.waiting.forEach(w => {
            arr.push({
                id: id++, text: "",
                type: "tableRow",
                columns: [w.pid, w.resource, w.time],
                tableType: "waiting",
            });
        });

        arr.push({ id: id++, text: "", type: "output" });
        arr.push({ id: id++, text: "Identify root blocker. Use command: kill <PID>", type: "system" });

        idRef.current = id;
        return arr;
    };

    const [lines, setLines] = useState<Line[]>(buildInitialLines);
    const [input, setInput] = useState("");
    const [complete, setComplete] = useState(false);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [lines]);

    const print = (text: string, type: Line["type"] = "output") => {
        setLines(prev => [...prev, { id: idRef.current++, text, type }]);
    };

    const handleCommand = (cmd: string) => {
        if (complete) return;

        const clean = cmd.trim().toLowerCase();
        print(`> ${cmd}`, "input");

        if (clean === currentSet.answer) {
            print(`Terminating process ${clean.split(" ")[1]}...`, "system");

            setTimeout(() => {
                print("Releasing locked resources...", "system");
                currentSet.releaseLogs.forEach(log => print(log, "output"));
                print("SYSTEM STABLE ✅", "success");
                setComplete(true);
                setTimeout(() => onComplete(), 2000);
            }, 800);

            return;
        }

        if (clean.startsWith("kill")) {
            print("Incorrect process terminated ❌", "error");
            print("Deadlock persists...", "error");
            return;
        }

        print("Invalid command", "error");
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        handleCommand(input);
        setInput("");
    };

    const getGridClass = (tableType?: "ps" | "resource" | "waiting") => {
        if (tableType === "ps")       return styles.psRow;
        if (tableType === "resource") return styles.resourceRow;
        if (tableType === "waiting")  return styles.waitingRow;
        return "";
    };

    return (
        <div className={styles.container}>
            <div className={styles.outputArea}>
                {lines.map(line => {
                    if (line.type === "tableHeader" || line.type === "tableRow") {
                        return (
                            <div
                                key={line.id}
                                className={[
                                    styles.tableRowBase,
                                    getGridClass(line.tableType),
                                    line.type === "tableHeader" ? styles.tableHeader : styles.tableDataRow,
                                ].join(" ")}
                            >
                                {line.columns!.map((col, i) => (
                                    <span key={i}>{col}</span>
                                ))}
                            </div>
                        );
                    }
                    return (
                        <div key={line.id} className={`${styles.line} ${styles[line.type]}`}>
                            {line.text}
                        </div>
                    );
                })}
                <div ref={bottomRef} />
            </div>

            {!complete ? (
                <form className={styles.inputArea} onSubmit={handleSubmit}>
                    <span className={styles.prompt}>{">"}</span>
                    <input
                        className={styles.textInput}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        autoFocus
                    />
                </form>
            ) : (
                <div className={styles.inputArea}>
                    <span className={styles.success}>[ NEXT LEVEL UNLOCKED ]</span>
                </div>
            )}
        </div>
    );
}