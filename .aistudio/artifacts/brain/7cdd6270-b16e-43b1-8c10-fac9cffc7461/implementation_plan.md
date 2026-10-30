# 20+ Vehicle Roster & Interactive 3D Garage Showroom

Deliver a comprehensive vehicle collection of 22 distinct cars featuring Formula 1 machines, Italian hypercars (Lamborghini, Bugatti, Ferrari), iconic Indian road cars (Tata Nexon EV, Harrier, Safari, Mahindra Thar), American muscle, JDM tuners, and hot hatches—each with authentic 3D silhouettes, custom physics tuning (speed, acceleration, handling, drift grip, weight), and an interactive 3D Garage Showroom with a rotating turntable and live stat bars.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The following user preferences were confirmed during Phase 1 clarification:
>
> - **Vehicle Handling & Performance**: **Unique stats** with distinct top speed, acceleration, braking, handling, weight, and drift grip across all vehicles.
> - **Customization & Browsing Interface**: **Interactive 3D Garage Showroom** featuring a rotating turntable platform, orbit controls, real-time stat bars, and category filters.
> - **Roster Composition**: **Full spectrum collection (22 cars)** spanning Formula 1 grid cars, exotic Italian hypercars, Indian road cars, American muscle, JDM legends, and hot hatches.

---

## 1. Overview & Core Concept

- **What It Does**: Transforms Desk Racer from a single go-kart game into a comprehensive multi-vehicle racing experience with 22 distinct playable vehicles. Players can open the 3D Garage Showroom, inspect vehicle silhouettes on a glowing rotating turntable, compare dynamic performance specs (Top Speed, Acceleration, Handling, Braking, Drift Grip, Weight), and pilot their chosen machine across all 52 desktop circuits.
- **Target Audience / Persona**: Racing enthusiasts, time-trial speedrunners, and fans of varied automotive culture (from F1 fans to supercar collectors to Indian automotive enthusiasts).
- **Key Value**: Drastically increases replayability, strategy, and tactile driving variety—tackling steep coaster drops and tight keyboard chicanes feels completely different in a lightweight, high-downforce F1 racer versus a muscular Dodge Charger or a high-ground-clearance Tata Safari.

---

## 2. User Experience & Visual Design

### Key User Flows
1. **Accessing the Garage**:
   - Click the new **`🏎️ [Car Name] (22 CARS) ▾`** pill in the top HUD bar (or press <kbd>C</kbd> / <kbd>G</kbd> on keyboard).
   - Alternatively, click the dedicated **`SELECT VEHICLE`** button on the launch Welcome card or on the post-race Finish dialog.
2. **Browsing the 3D Showroom**:
   - The interactive 3D Garage modal opens with a smooth blurred backdrop.
   - The selected car rotates on a metallic slotted turntable with radial blue underglow and soft overhead spotlighting.
   - Players can drag/swipe to rotate the car 360°, inspect spoilers, splitters, diffusers, and cockpit details.
   - Live segmented stat bars display Top Speed, Acceleration, Handling, Braking, Drift Grip, and Weight.
3. **Filtering & Searching**:
   - Filter pills allow instant switching between *All*, *F1 & Open Wheel*, *Exotic Hypercars*, *Indian Icons*, *Muscle & JDM*, and *Hot Hatch & Classic*.
   - Instant search filters the car grid by name, manufacturer (e.g. "Tata", "Bugatti", "Lambo"), or category.
4. **Selecting & Launching**:
   - Clicking **`DRIVE THIS VEHICLE`** smoothly swaps the active car model, applies the custom physics attributes, updates the HUD vehicle badge, saves the selection to `localStorage`, and closes the modal ready for racing.

### Visual Identity & Theme
- **Garage Lighting**: Dark studio aesthetic with ambient moody indigo (`#080b12`), a 24-spoke machined aluminum turntable platform, circular cyan neon track rim (`#00e8ff`), and dual high-key overhead softboxes.
- **Typography**: Orbitron font (`700`/`900` weights) for car names and class badges; JetBrains Mono for technical specs (horsepower, scale weight, gear ratio); Inter for descriptions.
- **Stat Gauges**: High-contrast segmented progress bars with color-coded gradients (cyan for speed/handling, amber for acceleration/drift, emerald for grip).
- **Anti-Slop Discipline**: No floating candy badges; clean unboxed typographic metadata separators (`Tata Motors · EV Compact · 1:87 HO Scale`).

---

## 3. Key Product Decisions & Trade-Offs

### Decision 1: Procedural Micro-Vehicle Geometry vs. Heavy External Meshes
- **Chosen Approach**: Build modular 3D vehicle geometries procedurally in Three.js with distinct body profiles, aerodynamic wings, sidepods, splitters, wheel designs, and liveries.
- **Why**: Keeps loading instant (0 ms network lag), guarantees 60 FPS performance in WebGL without downloading 50MB of external 3D files, ensures exact 1:87 HO scale matching the track rails, and allows instant color/material customization.
- **Alternatives Considered**: Loading 22 separate heavy `.glb` files from external CDNs, which would introduce loading spinners, asset failures, and high memory overhead.

### Decision 2: Physics Attribute Scaling & Multipliers
- **Chosen Approach**: Modulate the existing calibrated Rapier + Spline physics controller using normalized multipliers (`topSpeedMultiplier`, `accelMultiplier`, `handlingMultiplier`, `brakingMultiplier`, `driftGripMultiplier`, `weightMultiplier`).
- **Why**: Preserves the finely-tuned collision boundaries, rail-riding logic, and 60 FPS stability across all 52 tracks while providing immediately noticeable driving differences (e.g., F1 turns on a dime and accelerates instantly; Bugatti reaches insane terminal velocity on straights; Tata Safari handles bumps and curb rumbles with solid stability).
- **Alternatives Considered**: Separate physics engines for each car, which would risk karts clipping through coaster rails or failing on extreme loop-de-loops.

---

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                                 INDEX.HTML                             │
│  [HUD Top Bar: Map Pill | Vehicle Pill (22 CARS) | Lap Clock | Mute]   │
│  [Welcome Modal: Active Track Card + Active Vehicle Card]              │
│  [Finish Modal: Race Again | Change Map | Change Car | Autopilot]      │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        MAIN.JS (Application Root)                      │
│  - Tracks active vehicle state (default: 'f1_red_bull' or saved)       │
│  - Mounts GarageShowroomModal                                          │
│  - Invokes physics.setVehicle() & microKart.setVehicleModel()          │
└───────────────────┬───────────────────────────────┬────────────────────┘
                    │                               │
                    ▼                               ▼
┌───────────────────────────────────┐ ┌──────────────────────────────────┐
│   src/vehicles/VehicleRegistry.js │ │  src/ui/GarageShowroomModal.js   │
│  - 22 vehicle definitions         │ │  - Dedicated 3D Turntable Scene  │
│  - Full spec attributes           │ │  - 360° Drag & Auto-Rotation     │
│  - Category classifications       │ │  - Real-Time Spec Bars           │
│  - LocalStorage persistence       │ │  - Category Tabs & Search Filter │
└───────────────────┬───────────────┘ └──────────────────────────────────┘
                    │
                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                 src/scene/VehicleModelBuilder.js                       │
│  - Procedural 3D body builders:                                        │
│    * Formula 1 (Long nose, front/rear wings, halo ring, wide slicks)   │
│    * Supercars (Lamborghini angular wedge, Bugatti C-line curve)       │
│    * Indian Road Cars (Tata Nexon EV / Harrier / Safari SUV lines)     │
│    * Muscle & JDM (Mustang hood scoops, GT-R high spoiler, Supra)      │
│    * Hot Hatches (Mini Cooper bulldog stance, Golf R twin tailpipes)   │
│  - Retains functional wheels, LED lights, exhaust fire, spark emitter  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│               src/physics/KartPhysicsController.js                     │
│  - Added setVehicle(stats) method:                                     │
│    * Adjusts topSpeedMultiplier, accelMultiplier, steerRate            │
│    * Modulates drift spark threshold and lateral rail damping          │
└────────────────────────────────────────────────────────────────────────┘
```

### Complete 22-Vehicle Roster Breakdown

| # | ID | Name | Category | Top Speed | Accel | Handling | Drift Grip |
|---|---|---|---|---|---|---|---|
| 1 | `f1_red_bull` | Apex RB20 F1 | F1 & Open Wheel | 9.8 | 9.7 | 9.9 | 8.2 |
| 2 | `f1_ferrari` | Scuderia Rosso F1 | F1 & Open Wheel | 9.9 | 9.6 | 9.7 | 8.0 |
| 3 | `f1_mercedes` | Silver Arrow W15 | F1 & Open Wheel | 9.7 | 9.5 | 9.8 | 8.5 |
| 4 | `f1_mclaren` | Papaya Velocity F1 | F1 & Open Wheel | 9.8 | 9.8 | 9.6 | 8.1 |
| 5 | `lamborghini_aventador` | Aventador SVJ V12 | Exotic Hypercar | 9.5 | 9.2 | 9.0 | 9.2 |
| 6 | `lamborghini_huracan` | Huracán STO Track | Exotic Hypercar | 9.2 | 9.4 | 9.5 | 9.4 |
| 7 | `bugatti_chiron` | Chiron Pur Sport W16 | Exotic Hypercar | 10.0 | 9.1 | 8.4 | 7.8 |
| 8 | `bugatti_bolide` | Bolide Track Edition | Exotic Hypercar | 10.0 | 9.5 | 8.9 | 8.2 |
| 9 | `ferrari_laferrari` | LaFerrari Aperta | Exotic Hypercar | 9.6 | 9.3 | 9.2 | 8.8 |
| 10 | `porsche_911_gt3` | 911 GT3 RS Swan | Exotic Hypercar | 9.1 | 9.2 | 9.8 | 9.1 |
| 11 | `tata_nexon_ev` | Tata Nexon EV Max | Indian Icons | 7.8 | 8.6 | 8.3 | 8.0 |
| 12 | `tata_harrier_dark` | Tata Harrier Dark Ed. | Indian Icons | 8.2 | 7.9 | 8.1 | 8.4 |
| 13 | `tata_safari_gold` | Tata Safari Gold Flagship | Indian Icons | 8.0 | 7.6 | 7.9 | 8.6 |
| 14 | `mahindra_thar` | Mahindra Thar 4x4 Legend | Indian Icons | 7.4 | 7.5 | 7.8 | 8.9 |
| 15 | `ford_mustang_dark_horse` | Mustang Dark Horse V8 | Muscle & JDM | 8.9 | 8.8 | 8.2 | 9.6 |
| 16 | `dodge_charger_hellcat` | Charger SRT Hellcat | Muscle & JDM | 9.3 | 8.7 | 7.8 | 9.8 |
| 17 | `nissan_skyline_gtr` | Skyline GT-R R34 V-Spec | Muscle & JDM | 9.0 | 9.0 | 9.1 | 9.5 |
| 18 | `toyota_supra_mk4` | Supra Twin-Turbo 2JZ | Muscle & JDM | 9.1 | 8.9 | 8.8 | 9.7 |
| 19 | `mazda_rx7_veilside` | RX-7 FD Spirit R Rotary | Muscle & JDM | 8.8 | 9.1 | 9.6 | 9.3 |
| 20 | `mini_cooper_jcw` | Mini Cooper JCW GP | Hot Hatch & Classic | 8.3 | 8.8 | 9.7 | 8.6 |
| 21 | `volkswagen_golf_r` | Golf R Turbo AWD | Hot Hatch & Classic | 8.6 | 8.9 | 9.0 | 8.7 |
| 22 | `classic_micro_kart` | HO 1:87 Championship Kart | Hot Hatch & Classic | 8.5 | 8.5 | 8.5 | 8.5 |

---

## 5. Implementation Sequence

1. **`src/vehicles/VehicleRegistry.js`**: Create full data model with 22 car specs, category groups, descriptions, colors, and storage helpers.
2. **`src/scene/VehicleModelBuilder.js`**: Implement procedural 3D body builder generating accurate silhouettes (F1 wings, Lamborghini wedges, Bugatti C-curves, Tata SUV profiles, Mustang muscle lines).
3. **`src/scene/MicroKartBuilder.js`**: Connect vehicle swapping API to live kart in scene without disrupting physics or wheel spin loops.
4. **`src/physics/KartPhysicsController.js`**: Add `setVehicle(vehicleDef)` to dynamically update speeds, acceleration curves, handling, and drift factors.
5. **`src/ui/GarageShowroomModal.js`**: Build interactive 3D turntable showroom with orbit interaction, category filters, search input, and live stat bars.
6. **`index.html` & `src/main.js`**: Wire top-bar vehicle button, welcome card, finish overlay, and hotkeys (<kbd>C</kbd> / <kbd>G</kbd>).
7. **Verification**: Run `lint_applet` and `compile_applet`.
