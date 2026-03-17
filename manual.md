# COOPERATIVE PROTOCOL MANUAL
**CLASSIFICATION:** TOP SECRET // EYES ONLY
**ROLE:** INCIDENT GUIDE

*Operator, if you are reading this, you have committed a security violation. This document is strictly for the Guide. You will fail the aptitude test.*

---

## Sector 1: The Power Grid
The facility's power routing nodes require manual circuitry bypassing. You must instruct the Operator on which proprietary logic gates to place.

**The Operator must tell you:**
1. The identifier of the Grid (Alpha, Beta, or Gamma).
2. Their 10 inputs and how the wiring requires them to route.

**Your Job:** Tell them which obscure logic gates to place to ensure the final output is True (ON).

**Proprietary Gate Schematics:**
- **Gate Δ (Delta)**: Standard `AND` Gate. (Both inputs must be ON).
- **Gate Σ (Sigma)**: Standard `OR` Gate. (At least one input must be ON).
- **Gate Φ (Phi)**: Standard `XOR` Gate. (Exactly one input must be ON. If both are the same, it outputs OFF).
- **Gate Ψ (Psi)**: Standard `NAND` Gate. (Outputs ON *unless* both inputs are ON).

*Hint: They have 10 inputs and multiple layers of gates. Use pen and paper to trace their boolean logic tree.*

---

## Sector 2: The Handshake Proxy
An encrypted handshake is occurring. Hexadecimal packets (e.g., `0x4A`, `0x1B`) are hitting the terminal rapidly.
The Operator must tell you the **Active Protocol** displayed on their screen.

Based on the Active Protocol, instruct the Operator on when to press **ACTION A**, **ACTION S**, or **IGNORE**. You must do this mathematically in real-time.

**If Active Protocol is ALPHA:**
- **ACTION A:** If the Hex value converted to Decimal is a multiple of 7. *(E.g. 0x0E = 14 = ACTION A)*.
- **ACTION S:** If the Hex string literally contains the letter 'C' or 'D'. *(E.g. 0x4C, 0xD1)*.
- **IGNORE:** Otherwise.

**If Active Protocol is BETA:**
- **ACTION A:** The sum of the two hex digits (as pure hex integer values) is greater than 15 (0xF). *(E.g. 0x89 -> 8+9 = 17 > 15 = ACTION A)*.
- **ACTION S:** The two hex digits are identical (a Palindrome). *(E.g. 0x22, 0xEE)*.
- **IGNORE:** Otherwise.

**If Active Protocol is GAMMA:**
- **ACTION A:** The bitwise AND of the two hex digits is non-zero. *(E.g. 0x31 -> 3 & 1 = 1 = ACTION A)*.
- **ACTION S:** The Hex value converted to Decimal is a Prime Number. *(E.g. 0x0B = 11 = ACTION S)*.
- **IGNORE:** Otherwise.

---

## Sector 3: Database Schema
The database is locked. The Operator will receive a cryptic error message or incident log regarding missing system data.

**Your Job:** You hold the Database Schema. You must deduce which Table and Column the Operator needs to query to retrieve the missing information, and tell them the exact SQL query to enter. 

**Database Schema Documentation:**

`Table: personnel`
- `emp_id` (INT)
- `first_name` (VARCHAR)
- `last_name` (VARCHAR)
- `security_clearance` (INT)

`Table: maintenance_logs`
- `log_id` (INT)
- `floor` (INT)
- `protocol_id` (VARCHAR)
- `status` (VARCHAR)

`Table: network_nodes`
- `node_name` (VARCHAR)
- `ip_address` (VARCHAR)
- `uptime` (INT)

**Rules for Operator input:**
- They must use standard SQL: `SELECT [column1, column2] FROM [table] WHERE [condition];`
- They must include the semicolon `;` at the end!
- If querying a string, use single quotes (e.g. `WHERE node_name = 'Substation C'`).

---

## Sector 4: The Firewall
The Operator is completely blind inside a 7x7 security grid grid. (Coordinates `0,0` through `6,6`, where `0,0` is bottom-left and `6,6` is top-right). 

They cannot see walls. If they hit a wall, they are immediately forcefully disconnected and sent back to `0,0`. 

**The Operator must tell you:** Their starting constraint (Maze 1, Maze 2, or Maze 3) and their current `X,Y` coordinates.

**Your Job:** Give them step-by-step turn directions. Do not let them hit a wall.

**MAZE 1 MAP:**
[0,0] -> [0,1] -> [0,2] -> [1,2] -> [2,2] -> [2,3] -> [2,4] -> [3,4] -> [4,4] -> [5,4] -> [6,4] -> [6,5] -> [6,6] (EXIT)

**MAZE 2 MAP:**
[6,0] -> [5,0] -> [4,0] -> [4,1] -> [4,2] -> [5,2] -> [6,2] -> [6,3] -> [6,4] -> [5,4] -> [4,4] -> [3,4] -> [2,4] -> [2,5] -> [2,6] -> [1,6] -> [0,6] (EXIT)

**MAZE 3 MAP:**
[3,0] -> [3,1] -> [2,1] -> [1,1] -> [1,2] -> [1,3] -> [2,3] -> [3,3] -> [4,3] -> [5,3] -> [5,4] -> [5,5] -> [4,5] -> [3,5] -> [3,6] (EXIT)

---

## Sector 5: The Decryption Key
The terminal requires a classified Authorization Code Phrase to reboot the system.
The Operator will see an english prompt asking for a specific codeword. They will have a keyboard of alien symbols.

**Your Job:** Ask the Operator what codeword the system is demanding. You must use the Rosetta Matrix below to spell out that word in alien symbols, and describe the symbols to the Operator so they can type them in order.

**Rosetta Matrix:**
- **A** = Ω (Omega Horseshoe)
- **B** = ⍜ (Circle with line)
- **C** = ❂ (Sunburst / Asterisk)
- **D** = ⎔ (Hexagon with dot)
- **E** = ∆ (Triangle)
- **F** = ⍿ (Square with dot)
- **G** = ☿ (Mercury symbol / humanoid)
- **H** = ⋈ (Bowtie / Hourglass)
- **I** = ⟁ (Triangle with line through it)
- **J** = ⍶ (Curved pitchfork)
- **K** = ⍲ (Square with cross)
- **L** = ⛤ (Pentagram)
- **M** = ⎈ (Ship's wheel)
- **N** = ▱ (Parallelogram)
- **O** = Ψ (Psi/ Trident)
- **P** = ⍟ (Circle with Star)
- **Q** = ⍡ (Square with star)
- **R** = ᚱ (Rune R)
- **S** = ✦ (Four-point star)
- **T** = ⨂ (Circle with X)
- **U** = ⍝ (Square bracket U)
- **V** = ⍫ (Triangle with dot)
- **W** = ⍭ (Circle with dot)
- **X** = ⍮ (Triangle with cross)
- **Y** = ⍯ (Square bracket Y)
- **Z** = ⍰ (Square bracket Z)
