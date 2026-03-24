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

---

## Sector 6: ADVANCED HARMONIC SYNTHESIS
The incoming signal requires precise manipulation of Amplitude and Phase across 6 frequency bands.

**STEP 1: Identify the Signal Recipe**
Ask the Operator for the **Signal ID**. This tells you the exact Frequencies, Amplitudes, and Target Phases required.

| Signal ID | Component 1 | Component 2 | Component 3 |
| :--- | :--- | :--- | :--- |
| **ECHO-7** | Fund. (1x): Amp 5, Ph 0° | 2nd Harm (2x): Amp 3, Ph 180° | 4th Harm (4x): Amp 4, Ph 90° |
| **NOVA-3** | 3rd Harm (3x): Amp 4, Ph 270° | 5th Harm (5x): Amp 2, Ph 90° | 6th Harm (6x): Amp 5, Ph 0° |
| **PULSAR-9**| Fund. (1x): Amp 3, Ph 180° | 2nd Harm (2x): Amp 4, Ph 270° | 3rd Harm (3x): Amp 5, Ph 90° |

**STEP 2: Hardware Routing**
Ask the Operator for the **Routing Board** name. This tells you which Channel (A-F) controls which Frequency multiplier.

| Routing Board | CH A | CH B | CH C | CH D | CH E | CH F |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **EPSILON** | 4x | 1x | 5x | 3x | 2x | 6x |
| **OMEGA** | 1x | 6x | 3x | 2x | 5x | 4x |
| **SIGMA** | 2x | 3x | 4x | 5x | 6x | 1x |

**STEP 3: Calculate Phase Interference (CRITICAL)**
The Routing Boards have hardware defects that *add* a permanent Phase Shift to certain channels. You must tell the Operator to subtract this interference from the Target Phase.

* **EPSILON BOARD:** Adds **+180°** to channels on the Left Bank (**Channels A, B, C**).
* **OMEGA BOARD:** Adds **+90°** to channels on the Right Bank (**Channels D, E, F**).
* **SIGMA BOARD:** Adds **+270°** to **ALL Channels**.

*(Example: If the Recipe needs Phase 90° on Channel A, but you are on EPSILON, the board adds 180°. The Operator must input 270° so the total wraps around to 90°).*

---


## Sector 7: Encrypted Dials
A legacy radar jammer requires manual symbol alignment. The symbols are Greek/Runic characters.

**The Operator must tell you:**
1. The internal temperature gauge reading.
2. The WAVE profile (Amplitude and Wavelength/Grid Units).

**Your Job:** Tell them which symbol to set for Dials 1, 2, and 3.

**DIAL CALIBRATION CHART:**

| Signal | Target Wave | Temp | Dial 1 | Dial 2 | Dial 3 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **ALPHA** | Amp 4 / WL 8 | 75°C | Δ | α | Ω |
| **BETA** | Amp 2 / WL 4 | 45°C | β | γ | Φ |
| **GAMMA** | Amp 5 / WL 10 | 60°C | Ω | Ψ | α |

---

## Sector 8: ADVANCED UAV CALIBRATION PROTOCOL

To calibrate a drifting UAV, follow these 4 steps precisely.

**STEP 1: Identify Factory Baseline**
Find the drone's model number on the telemetry feed to get the baseline values.
* **Model RX-7:** Base Pitch = +10 | Base Roll = -5
* **Model TX-9:** Base Pitch = -5 | Base Roll = +15
* **Model QF-4:** Base Pitch = 0 | Base Roll = -10

**STEP 2: Determine Offset Value & Polarity**
Cross-reference the Diagnostic LEDs with the Radar Ring number (1 is center-most, 5 is outer-most) where the drone is currently drifting.

| Diagnostic LEDs | Rings 1-2 | Rings 3-4 | Ring 5 | Polarity State |
| :--- | :--- | :--- | :--- | :--- |
| **YEL-RED-YEL** | Offset = 4 | Offset = 8 | Offset = 12|  |
| **RED-YEL-RED** | Offset = 5 | Offset = 10 | Offset = 15| **NORMAL** |
| **GRN-BLU-GRN** | Offset = 6 | Offset = 9 | Offset = 14| **INVERTED** |

**STEP 3: Apply Quadrant Rules**
Determine which quadrant of the radar the drone is in. Apply the Offset Value from Step 2 to the Baselines from Step 1.
* **Top-Right (Q1):** Subtract Offset from Pitch. Subtract Offset from Roll.
* **Top-Left (Q2):** Subtract Offset from Pitch. Add Offset to Roll.
* **Bottom-Left (Q3):** Add Offset to Pitch. Add Offset to Roll.
* **Bottom-Right (Q4):** Add Offset to Pitch. Subtract Offset from Roll.

**STEP 4: The Polarity Override**
* If the Polarity State (from Step 2) is **NORMAL**: Input the Pitch and Roll values as calculated.
* If the Polarity State is **INVERTED**: Toggle the Polarity Switch to ON. **You must SWAP the final Pitch and Roll values** (Input calculated Pitch into the Roll field, and vice versa).

---


## Sector 9: The Alchemist's Crucible
Proprietary material synthesis via a 3x3 grid.

**The Operator must tell you:** What raw materials they have and what the environment contains (Magma/Cryo-fluid).

**Your Job:** Guide them through the logic chain to create **Obsidian** and break it.

**THE SYNTHESIZER BLUEPRINT:**

**1. Tool Recipes (3x3 Grid):**
- **Silicate Tool (Stone Pick):** 3 Silicate and 2 Carbon Rods in a **V-shape** (Slots 0, 2, 4, 7, 8 approx). *Forged at Room Temp (20°C).*
- **Ferrous Tool (Iron Pick):** 3 Purified Ferrous and 2 Carbon Rods in an **Upside-down T** (Slots 1, 4, 6, 7, 8). *Forged at Room Temp (20°C).*
- **Crystalline Tool (Diamond Pick):** 3 Usable Crystalline and 2 Carbon Rods in an **L-shape** (Slots 0, 3, 6, 7, 8). *Forged at Room Temp (20°C).*

**2. Refinement:**
- **Purified Ferrous:** Place Raw Ferrous in Slot 4. Heat to **1200°C**.
- **Usable Crystalline:** The Operator must "use" the **Ferrous Tool** on raw Crystalline in their inventory.
- **Thermal Receptacle (Bucket):** 3 Purified Ferrous in a **Diagonal Line** (Slots 0, 4, 8).

**3. Thermodynamics (The Trap):**
- **To create Dense Obsidian:** Magma must be added to Cryo-Fluid. (Fill Receptacle with Magma first, then pour into Cryo-Fluid).
- *Warning: Adding Cryo-Fluid to Magma results in Pumice (Useless).*

---

## Sector 10: THE SNORING SABOTAGE

The sleeping target is directly beneath a suspended load ($m_2$). You must calculate the exact counter-weight ($m_1$) to balance the load without snapping the rope. 

**STEP 1: Calculate Load Mass ($m_2$)**
Identify the Container and its Contents. Multiply Volume by Density.
* **Containers (Volume):**
    * **CRATE:** 10 Vol
    * **SAFE:** 5 Vol
    * **BARREL:** 20 Vol
* **Contents (Density):**
    * **Scrap Iron:** 8 kg / Vol
    * **Lead:** 12 kg / Vol
    * **Gold Bars:** 20 kg / Vol

**STEP 2: Calculate Base Tension**
Divide the Load Mass ($m_2$) by the Mechanical Advantage (MA). The MA is the number of vertical ropes directly supporting the load.
* `Base Tension = Load Mass / MA`

**STEP 3: Add Friction Modifier**
Rusty pulleys require more tension to overcome friction. Add **5kg** to your Base Tension for **EVERY** rusty pulley in the rig.
* `Target Weight (m1) = Base Tension + (Rusty Pulleys x 5kg)`

**STEP 4: Verify Rope Tensile Strength (CRITICAL)**
Check the color and condition of the rope. If your `Target Weight (m1)` is GREATER than the Max Load of the rope, the rope will snap and wake the target!
* **Blue Thick Rope:** Max Load = 200 kg
* **Green Braided Rope:** Max Load = 150 kg
* **Red Frayed Rope:** Max Load = 40 kg

*If `Target Weight` > `Max Load`, DO NOT ADD WEIGHT. Instruct the Operator to pull the **EMERGENCY LOCK LEVER**.*
