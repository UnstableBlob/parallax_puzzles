6.
The "Harmonic Synthesizer" (Combining Waves)

In this puzzle, the Operator isn't just matching a wave; they are acting as a human Fourier transform, combining multiple basic sine waves to recreate a complex, corrupted audio signal.

    The Vibe: A secure communications array where the incoming transmission has been shattered into different frequency bands.

    Operator's Screen: * A large, central oscilloscope showing the Target Wave (a complex, jagged, or stepped line).

        Below it, four "Source Channels" (A, B, C, D). Each channel has a toggle switch (On/Off) and a slider marked 1 through 5.

        A Mix Wave screen showing the result of what they currently have turned on.

    Guide's Manual: The "Signal Reconstruction Matrix." This document contains visual profiles of complex waves and the "recipes" to build them.

    The Gameplay Loop:

        Identify: The Operator describes the Target Wave. "It’s a blocky wave, like castle battlements, but the top is a little slanted."

        Cross-Reference: The Guide looks at their visual reference sheet and identifies this as 'Encrypted Signal Type-4'.

        Translate: The Guide reads the recipe for Type-4: "To rebuild Type-4, you need the Fundamental Frequency at max amplitude, plus the 3rd Harmonic at half amplitude." 4.  The Catch (Asymmetry): The Operator doesn't have buttons labeled "Fundamental" or "3rd Harmonic." They just have Channels A, B, C, D.

        Solve: The Guide has a routing table: "Check the 'Array Power' light. Is it Green or Blue?" Operator: "Green." Guide: "Okay, on Green power, Channel B is your Fundamental, Channel D is your 3rd Harmonic. Turn on B and set the slider to 5. Turn on D and set the slider to 3."

        The Mix Wave perfectly matches the Target Wave. Signal decrypted.


7.
Encrypted Dials (The Best Option for Co-op)

    The Vibe: An old Soviet radar jammer.

    Operator's Screen: A target wave that is constantly shifting (e.g., Amplitude is 4, Wavelength is 8). There are three dials, but instead of numbers, they have strange runic symbols or Greek letters (α,β,γ,Δ, etc.).

    Guide's Manual: A "Dial Calibration Chart."

    The Gameplay Loop:

        Operator: "I have a wave. It peaks 4 grid squares high, and repeats every 8 grid squares."

        Guide: "Got it. Amplitude 4, Wavelength 8. To set Amplitude to 4, turn Dial 1 to the symbol that looks like a triangle with a line through it."

        Operator: "There are two triangles with lines. One vertical line, one horizontal."

        Guide: "Check the machine's internal temperature gauge. Is it over 50 degrees?"

        Operator: "Yes, it's at 75."

        Guide: "Then use the vertical line."

8.
The Broken Drone Calibration

    The Vibe: First-person or top-down radar view of a drone acting completely erratic. It’s drifting, spinning, and the HUD is spitting out raw telemetry.

    Operator's Screen: Visual feedback of the drone drifting (e.g., drifting top-right). A telemetry dashboard showing Gyro Offsets, Motor RPMs, and a sequence of flashing colored LEDs on the drone chassis.

    Guide’s Manual: A "UAV Field Repair Schematic". It contains tables that translate LED flash patterns into error codes, and a PID controller tuning guide (simplified to "If drifting X, adjust Pitch/Roll by Y").

    The Gameplay Loop:

        Operator says: "The drone is drifting hard to the top-right, and the back-left motor LED is flashing Yellow-Red-Yellow."

        Guide looks up the flash code: "Yellow-Red-Yellow means 'Gyroscope Inversion'. You need to flip the Gyro Polarity switch. Do you see that?"

        Operator flips it. "Done. It's still drifting top-right."

        Guide checks the calibration matrix: "To counter a top-right drift, you need to set the Pitch offset to -15 and Roll offset to -10. Then hold the 'Sync' button for 3 seconds."

        Operator inputs the numbers, holds the button, and the drone stabilizes.

9.
"The Alchemist's Crucible"

We keep your exact logic chain (Stone -> Iron -> Bucket -> Diamond -> Obsidian), but we change the names, the crafting shapes, and add a "catalyst" condition so the Operator must rely on the Guide.
1. The Setup

    Operator's Screen: * The Environment: A 3x1 grid. Cell A contains Liquid Magma (Lava). Cell C contains Cryo-Fluid (Water). Cell B is empty.

        The Bag (Inventory): Contains raw materials: Carbon Rods (Wood/Sticks), Silicate (Stone), Raw Ferrous (Iron Ore), and Carbon Crystalline (Diamond).

        The Crucible: A 3x3 crafting grid with a Temperature Dial next to it.

    Guide's Manual: "The Synthesizer Blueprint." This contains the new, altered recipes and the rules of thermodynamics.

2. The Gameplay Flow (The Logic Chain)

    The Stone Pickaxe: * Minecraft knowledge: T-shape.

        Your Game: The Guide's manual says a Silicate Fracture Tool requires 3 Silicate and 2 Carbon Rods in a V-shape, forged at Room Temperature.

    The Iron (Smelting): * Operator puts Raw Ferrous in the Crucible.

        Guide's manual: "To purify Ferrous material, heat to 1200°C." Operator turns the dial, and it turns into Purified Ferrous (Iron Ingots).

    The Bucket & The Iron Pickaxe:

        Minecraft knowledge: Bucket is a V-shape, Pickaxe is a T-shape.

        Your Game: Guide reads: "A Thermal Receptacle (Bucket) requires 3 Purified Ferrous in a diagonal line. A Ferrous Fracture Tool (Iron Pick) requires 3 Ferrous and 2 Rods in an upside-down T-shape."

    Mining the Diamond:

        Operator uses the new Iron Pick to break the Carbon Crystalline block in their bag to make it usable.

        Guide reads: "A Crystalline Fracture Tool (Diamond Pick) requires 3 Crystalline and 2 Rods in an L-shape."

    Creating Obsidian:

        The Trap: In Minecraft, water onto a lava source makes Obsidian. Lava onto water makes Cobblestone.

        Your Game (Flipping the script): The Guide's manual explicitly states: "WARNING: Adding Cryo-Fluid (Water) to Magma (Lava) results in useless Pumice. To create Dense Obsidian, Magma must be poured into the Cryo-Fluid."

        Operator drags the Bucket to the Lava, then drags the Lava Bucket to the Water. It solidifies into Obsidian.

    The Finish: Operator drags the Diamond Pickaxe to the Obsidian to clear the level.

10.
"The Snoring Sabotage" (The Rigger's Equation)

The objective is to eliminate the "direct lookup" vulnerability. Instead of the Guide simply looking up "Heavy Water = 55kg", the Operator must provide multiple variables (Container Type, Material, Rope Details, Pulley Condition) that the Guide plugs into a multi-step formula.

Now, every set requires calculation, and every set requires checking the "Trap" condition (the rope breaking). The trap is no longer a one-off gimmick for Set 3; it is a persistent threat they must calculate for every time.

### **The Enhanced Puzzle Logic: "The Rigger's Equation"**

**The Operator must communicate 5 variables:**
1. **Container Type:** Defines the Volume multiplier.
2. **Contents Label:** Defines the Material Density.
3. **Mechanical Advantage (MA):** The number of vertical ropes supporting the load.
4. **Pulley Condition:** The number of rusty, squeaking pulleys in the rig.
5. **Rope Specs:** The color and condition of the rope holding the bucket.

**The Gameplay Loop:**
1. **Operator:** "I have a Crate filled with Lead. There are 3 ropes supporting it (MA 3). I see 1 rusty pulley. The rope is a Green Braided cord."
2. **Guide:** (Calculates) "A crate is volume 10. Lead is 12kg per volume. Total mass is 120kg. Divide by MA 3 gives 40kg base tension. One rusty pulley adds 5kg friction. You need 45kg total."
3. **Guide:** (Checks Safety) "Wait, let me check the rope. Green Braided holds up to 150kg. You only need 45kg. You are safe. Add exactly 45kg to the bucket."
4. **Operator:** *Adds weights. System balances.*

*(If it was a Frayed Red cord, which snaps at 40kg, the 45kg requirement would break it, forcing them to pull the Emergency Lever instead).*

---

### **The Puzzle Configuration (Equally difficult sets):**
* **Set 1:** Crate(10) * Lead(12) = 120kg. MA=3 -> 40kg. Rusty=1(+5) -> Target: 45kg. Green Braided max is 150. (45 < 150) -> **Safe.**
* **Set 2:** Safe(5) * Gold(20) = 100kg. MA=2 -> 50kg. Rusty=2(+10) -> Target: 60kg. Red Frayed max is 40. (60 > 40) -> **TRAP! Pull Lever.**
* **Set 3:** Barrel(20) * Scrap(8) = 160kg. MA=4 -> 40kg. Rusty=3(+15) -> Target: 55kg. Blue Thick max is 200. (55 < 200) -> **Safe.**