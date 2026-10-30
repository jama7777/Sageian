/**
 * Vehicle Registry: 22 distinct playable vehicles across Formula 1,
 * Exotic Hypercars (Lamborghini, Bugatti, Ferrari), Indian Road Icons (Tata, Mahindra),
 * Muscle & JDM legends, and Hot Hatches.
 *
 * Each vehicle has:
 * - id: unique identifier string
 * - name: Display title
 * - manufacturer: Brand name
 * - category: 'F1 & Open Wheel' | 'Exotic Hypercar' | 'Indian Icons' | 'Muscle & JDM' | 'Hot Hatch & Classic'
 * - bodyType: 'f1' | 'lamborghini' | 'bugatti' | 'tata_suv' | 'muscle' | 'jdm' | 'hatch' | 'classic_kart'
 * - description: Automotive lore and background
 * - engine: Drivetrain / engine specs
 * - primaryColor: hex number
 * - secondaryColor: hex number
 * - accentColor: hex number
 * - liveryStyle: string
 * - stats:
 *    - topSpeed: 1-10
 *    - acceleration: 1-10
 *    - handling: 1-10
 *    - braking: 1-10
 *    - driftGrip: 1-10
 *    - weight: 1-10
 * - physicsMultipliers:
 *    - topSpeedMult: relative multiplier on manualMaxSpeed (e.g. 0.90 to 1.30)
 *    - accelMult: relative multiplier on manualAccel (e.g. 0.85 to 1.35)
 *    - handlingMult: relative multiplier on steer rate & lateral agility (e.g. 0.85 to 1.30)
 *    - brakingMult: relative multiplier on braking deceleration
 *    - driftGripMult: drift spark charging threshold and slip damping
 *    - weightMult: impact stability and momentum
 */

export const VEHICLE_CATEGORIES = [
  'All',
  'F1 & Open Wheel',
  'Exotic Hypercar',
  'Indian Icons',
  'Muscle & JDM',
  'Hot Hatch & Classic',
];

export const VEHICLE_DEFINITIONS = [
  // -------------------------------------------------------------------------
  // 1. FORMULA 1 & OPEN WHEEL
  // -------------------------------------------------------------------------
  {
    id: 'f1_red_bull',
    name: 'Apex RB20 Championship',
    manufacturer: 'Apex Grand Prix',
    category: 'F1 & Open Wheel',
    bodyType: 'f1',
    description: 'Ground-effect aerodynamic masterpiece with sculpted sidepods, DRS high-downforce rear wing, and blistering high-speed cornering bite.',
    engine: '1.6L V6 Turbo-Hybrid · 1040 HP · 15,000 RPM',
    primaryColor: 0x141f38, // Deep Matte Navy
    secondaryColor: 0xff1b2d, // Red Bull Racing Red
    accentColor: 0xffcc00, // Sunburst Yellow nose tip
    liveryStyle: 'bull_racing',
    stats: {
      topSpeed: 9.8,
      acceleration: 9.7,
      handling: 9.9,
      braking: 9.8,
      driftGrip: 8.2,
      weight: 4.8,
    },
    physicsMultipliers: {
      topSpeedMult: 1.25,
      accelMult: 1.28,
      handlingMult: 1.30,
      brakingMult: 1.25,
      driftGripMult: 1.15,
      weightMult: 0.82,
    },
  },
  {
    id: 'f1_ferrari',
    name: 'Scuderia Rosso SF24',
    manufacturer: 'Scuderia Maranello',
    category: 'F1 & Open Wheel',
    bodyType: 'f1',
    description: 'The legendary Italian crimson speed machine. Razor-thin front wing endplates and immense longitudinal acceleration out of hairpins.',
    engine: '1.6L V6 Turbo-Hybrid · 1055 HP · 15,000 RPM',
    primaryColor: 0xd40000, // Corsa Red
    secondaryColor: 0xffffff, // White accent stripe
    accentColor: 0xffd700, // Giallo Modena yellow
    liveryStyle: 'scuderia_tricolor',
    stats: {
      topSpeed: 9.9,
      acceleration: 9.6,
      handling: 9.7,
      braking: 9.7,
      driftGrip: 8.0,
      weight: 4.9,
    },
    physicsMultipliers: {
      topSpeedMult: 1.26,
      accelMult: 1.26,
      handlingMult: 1.25,
      brakingMult: 1.24,
      driftGripMult: 1.12,
      weightMult: 0.84,
    },
  },
  {
    id: 'f1_mercedes',
    name: 'Silver Arrow W15',
    manufacturer: 'Silver Star Grand Prix',
    category: 'F1 & Open Wheel',
    bodyType: 'f1',
    description: 'Surgical German precision engineering with exposed carbon fiber sidepods, teal aerodynamic floor vanes, and rock-solid braking stability.',
    engine: '1.6L V6 Turbo-Hybrid · 1045 HP · 15,000 RPM',
    primaryColor: 0xc0c5cb, // Sterling Silver
    secondaryColor: 0x00f0d4, // Petronas Turquoise
    accentColor: 0x111317, // Raw exposed carbon
    liveryStyle: 'silver_teal_lines',
    stats: {
      topSpeed: 9.7,
      acceleration: 9.5,
      handling: 9.8,
      braking: 9.9,
      driftGrip: 8.5,
      weight: 5.0,
    },
    physicsMultipliers: {
      topSpeedMult: 1.22,
      accelMult: 1.24,
      handlingMult: 1.28,
      brakingMult: 1.30,
      driftGripMult: 1.18,
      weightMult: 0.85,
    },
  },
  {
    id: 'f1_mclaren',
    name: 'Papaya Velocity MCL38',
    manufacturer: 'McLaren Racing',
    category: 'F1 & Open Wheel',
    bodyType: 'f1',
    description: 'Electric papaya orange rocket with explosive mid-corner grip and ultra-rapid throttle pickup along steep coaster drops.',
    engine: '1.6L V6 Turbo-Hybrid · 1048 HP · 15,000 RPM',
    primaryColor: 0xff8000, // Vivid Papaya Orange
    secondaryColor: 0x1a2130, // Anthracite Black
    accentColor: 0x00d4ff, // Gulf Cyan pinstripe
    liveryStyle: 'papaya_stealth',
    stats: {
      topSpeed: 9.8,
      acceleration: 9.8,
      handling: 9.6,
      braking: 9.6,
      driftGrip: 8.1,
      weight: 4.8,
    },
    physicsMultipliers: {
      topSpeedMult: 1.24,
      accelMult: 1.30,
      handlingMult: 1.24,
      brakingMult: 1.22,
      driftGripMult: 1.14,
      weightMult: 0.83,
    },
  },

  // -------------------------------------------------------------------------
  // 2. EXOTIC HYPERCARS
  // -------------------------------------------------------------------------
  {
    id: 'lamborghini_aventador',
    name: 'Aventador SVJ Jota',
    manufacturer: 'Automobili Lamborghini',
    category: 'Exotic Hypercar',
    bodyType: 'lamborghini',
    description: 'The roaring naturally-aspirated V12 raging bull. Sharp stealth-fighter hexagonal contours, high-mount swan-neck GT rear wing, and active aerodynamics.',
    engine: '6.5L V12 Naturally Aspirated · 770 HP · 8,700 RPM',
    primaryColor: 0x76c900, // Verde Alceo Matte Green
    secondaryColor: 0x161618, // Matte Carbon
    accentColor: 0xffffff, // White SVJ script
    liveryStyle: 'svj_graphics',
    stats: {
      topSpeed: 9.5,
      acceleration: 9.2,
      handling: 9.0,
      braking: 9.1,
      driftGrip: 9.2,
      weight: 6.8,
    },
    physicsMultipliers: {
      topSpeedMult: 1.19,
      accelMult: 1.16,
      handlingMult: 1.15,
      brakingMult: 1.15,
      driftGripMult: 1.25,
      weightMult: 1.05,
    },
  },
  {
    id: 'lamborghini_huracan',
    name: 'Huracán STO Squadra',
    manufacturer: 'Automobili Lamborghini',
    category: 'Exotic Hypercar',
    bodyType: 'lamborghini',
    description: 'Track-homologated road-legal race car. Roof-mounted intake scoop, shark fin aerodynamic stabilizer, and explosive rear-wheel drive agility.',
    engine: '5.2L V10 Track Spec · 640 HP · 8,500 RPM',
    primaryColor: 0x0099ff, // Blu Laufey
    secondaryColor: 0xff5500, // Arancio California Orange
    accentColor: 0xffffff, // STO decals
    liveryStyle: 'sto_contrasting',
    stats: {
      topSpeed: 9.2,
      acceleration: 9.4,
      handling: 9.5,
      braking: 9.3,
      driftGrip: 9.4,
      weight: 6.0,
    },
    physicsMultipliers: {
      topSpeedMult: 1.15,
      accelMult: 1.20,
      handlingMult: 1.22,
      brakingMult: 1.18,
      driftGripMult: 1.28,
      weightMult: 0.98,
    },
  },
  {
    id: 'bugatti_chiron',
    name: 'Chiron Pur Sport W16',
    manufacturer: 'Bugatti Automobiles',
    category: 'Exotic Hypercar',
    bodyType: 'bugatti',
    description: 'The monumental quad-turbocharged 16-cylinder titan. Sweeping horseshoe front grille, iconic French Racing Blue livery, and peerless top-end straightaway thrust.',
    engine: '8.0L Quad-Turbo W16 · 1500 HP · 1,600 Nm Torque',
    primaryColor: 0x0055ff, // French Racing Blue
    secondaryColor: 0x0d121c, // Deep Bugatti Carbon
    accentColor: 0xd4e2f8, // Polished Aluminum Horseshoe Rim
    liveryStyle: 'bugatti_duotone',
    stats: {
      topSpeed: 10.0,
      acceleration: 9.1,
      handling: 8.4,
      braking: 8.9,
      driftGrip: 7.8,
      weight: 8.8,
    },
    physicsMultipliers: {
      topSpeedMult: 1.30,
      accelMult: 1.15,
      handlingMult: 1.05,
      brakingMult: 1.12,
      driftGripMult: 1.08,
      weightMult: 1.25,
    },
  },
  {
    id: 'bugatti_bolide',
    name: 'Bolide X-Wing Prototype',
    manufacturer: 'Bugatti Automobiles',
    category: 'Exotic Hypercar',
    bodyType: 'bugatti',
    description: 'Radical track-only hypercar built around the W16 engine with futuristic X-shaped matrix headlights, roof scoop, and mammoth rear downforce diffuser.',
    engine: '8.0L Quad-Turbo W16 Racing · 1850 HP · 110-Octane',
    primaryColor: 0x101318, // Stealth Black Carbon
    secondaryColor: 0x00d0ff, // Electric French Cyan
    accentColor: 0xffffff, // White X-beam LEDs
    liveryStyle: 'x_wing_stealth',
    stats: {
      topSpeed: 10.0,
      acceleration: 9.5,
      handling: 8.9,
      braking: 9.2,
      driftGrip: 8.2,
      weight: 7.2,
    },
    physicsMultipliers: {
      topSpeedMult: 1.31,
      accelMult: 1.22,
      handlingMult: 1.12,
      brakingMult: 1.18,
      driftGripMult: 1.16,
      weightMult: 1.10,
    },
  },
  {
    id: 'ferrari_laferrari',
    name: 'LaFerrari Aperta Hybrid',
    manufacturer: 'Ferrari',
    category: 'Exotic Hypercar',
    bodyType: 'lamborghini',
    description: 'Pinnacle hybrid hypercar combining a screaming naturally aspirated V12 with HY-KERS electric instant-boost torque.',
    engine: '6.3L V12 + KERS Electric · 963 HP · 9,250 RPM',
    primaryColor: 0xb50000, // Rosso Corsa Deep
    secondaryColor: 0x141416, // Naked Carbon Roof
    accentColor: 0xff3b30, // Red Pin-Stripe Rim
    liveryStyle: 'aperta_clean',
    stats: {
      topSpeed: 9.6,
      acceleration: 9.3,
      handling: 9.2,
      braking: 9.1,
      driftGrip: 8.8,
      weight: 6.5,
    },
    physicsMultipliers: {
      topSpeedMult: 1.20,
      accelMult: 1.18,
      handlingMult: 1.18,
      brakingMult: 1.16,
      driftGripMult: 1.20,
      weightMult: 1.02,
    },
  },
  {
    id: 'porsche_911_gt3',
    name: '911 GT3 RS Weissach',
    manufacturer: 'Porsche Motorsport',
    category: 'Exotic Hypercar',
    bodyType: 'lamborghini',
    description: 'Track-day scalpel featuring active front fender louvers, massive top-hung carbon swan-neck rear wing, and surgical apex trajectory.',
    engine: '4.0L Flat-6 Naturally Aspirated · 525 HP · 9,000 RPM',
    primaryColor: 0xf4f4f6, // Pure White
    secondaryColor: 0xff0033, // Guards Red Graphics
    accentColor: 0x1a1a1a, // Carbon hood panels
    liveryStyle: 'weissach_graphics',
    stats: {
      topSpeed: 9.1,
      acceleration: 9.2,
      handling: 9.8,
      braking: 9.6,
      driftGrip: 9.1,
      weight: 6.2,
    },
    physicsMultipliers: {
      topSpeedMult: 1.12,
      accelMult: 1.16,
      handlingMult: 1.26,
      brakingMult: 1.25,
      driftGripMult: 1.24,
      weightMult: 0.96,
    },
  },

  // -------------------------------------------------------------------------
  // 3. INDIAN ROAD ICONS
  // -------------------------------------------------------------------------
  {
    id: 'tata_nexon_ev',
    name: 'Tata Nexon EV Max',
    manufacturer: 'Tata Motors',
    category: 'Indian Icons',
    bodyType: 'tata_suv',
    description: 'India\'s best-selling electric crossover champion. Instant zip electric torque from zero RPM, robust high-tensile safety shell, and signature teal-blue signature accents.',
    engine: 'Permanent Magnet AC Motor · 143 HP · 250 Nm Instant Torque',
    primaryColor: 0x0a6fb8, // Signature Intensi-Teal Blue
    secondaryColor: 0xffffff, // Contrast White Floating Roof
    accentColor: 0x00e8ff, // Electric Teal Underbody Strip
    liveryStyle: 'tata_ev_duotone',
    stats: {
      topSpeed: 7.8,
      acceleration: 8.6,
      handling: 8.3,
      braking: 8.4,
      driftGrip: 8.0,
      weight: 7.8,
    },
    physicsMultipliers: {
      topSpeedMult: 0.96,
      accelMult: 1.12,
      handlingMult: 1.05,
      brakingMult: 1.08,
      driftGripMult: 1.05,
      weightMult: 1.12,
    },
  },
  {
    id: 'tata_harrier_dark',
    name: 'Tata Harrier #Dark Edition',
    manufacturer: 'Tata Motors',
    category: 'Indian Icons',
    bodyType: 'tata_suv',
    description: 'Menacing mid-size SUV built on the Land Rover-derived OMEGArc platform. Oberon Black body, dual LED daytime running brow, and commanding road presence.',
    engine: '2.0L Kryotec Turbocharged Diesel · 170 HP · 350 Nm Torque',
    primaryColor: 0x0e1116, // Oberon Black
    secondaryColor: 0x1e2430, // Blackstone Chrome Accents
    accentColor: 0xff3b30, // Red Caliper Brake Flash
    liveryStyle: 'dark_monochrome',
    stats: {
      topSpeed: 8.2,
      acceleration: 7.9,
      handling: 8.1,
      braking: 8.2,
      driftGrip: 8.4,
      weight: 8.4,
    },
    physicsMultipliers: {
      topSpeedMult: 1.02,
      accelMult: 1.00,
      handlingMult: 1.02,
      brakingMult: 1.05,
      driftGripMult: 1.10,
      weightMult: 1.18,
    },
  },
  {
    id: 'tata_safari_gold',
    name: 'Tata Safari Gold Flagship',
    manufacturer: 'Tata Motors',
    category: 'Indian Icons',
    bodyType: 'tata_suv',
    description: 'The iconic Indian flagship 7-seater adventure tourer. Stepped-roof silhouette with roof rails, White Gold metallic grille tri-arrow motifs, and stable long-wheelbase poise.',
    engine: '2.0L Turbo Diesel · 170 HP · Long-Haul Cruiser',
    primaryColor: 0x161616, // Black Gold Metallic
    secondaryColor: 0xd4af37, // Royal Warm Gold Roof & Grille
    accentColor: 0xffffff, // Signature Tri-Arrow Highlights
    liveryStyle: 'safari_gold_prestige',
    stats: {
      topSpeed: 8.0,
      acceleration: 7.6,
      handling: 7.9,
      braking: 8.0,
      driftGrip: 8.6,
      weight: 8.9,
    },
    physicsMultipliers: {
      topSpeedMult: 1.00,
      accelMult: 0.96,
      handlingMult: 0.98,
      brakingMult: 1.02,
      driftGripMult: 1.12,
      weightMult: 1.22,
    },
  },
  {
    id: 'mahindra_thar',
    name: 'Mahindra Thar 4x4 Legend',
    manufacturer: 'Mahindra Auto',
    category: 'Indian Icons',
    bodyType: 'tata_suv',
    description: 'India\'s revered off-road conquering beast. Boxy flared wheel arches, exposed door hinges, knobby all-terrain tires, and supreme curb-climbing resilience.',
    engine: '2.0L mStallion Turbo-Petrol · 150 HP · Shift-on-Fly 4x4',
    primaryColor: 0xa8201a, // Red Rage
    secondaryColor: 0x141414, // Matte Black Hard Top & Fender Flares
    accentColor: 0xffcc00, // Fog Light Halos
    liveryStyle: 'thar_adventure',
    stats: {
      topSpeed: 7.4,
      acceleration: 7.5,
      handling: 7.8,
      braking: 7.9,
      driftGrip: 8.9,
      weight: 8.6,
    },
    physicsMultipliers: {
      topSpeedMult: 0.92,
      accelMult: 0.95,
      handlingMult: 0.96,
      brakingMult: 1.00,
      driftGripMult: 1.20,
      weightMult: 1.20,
    },
  },

  // -------------------------------------------------------------------------
  // 4. MUSCLE & JDM LEGENDS
  // -------------------------------------------------------------------------
  {
    id: 'ford_mustang_dark_horse',
    name: 'Mustang Dark Horse V8',
    manufacturer: 'Ford Performance',
    category: 'Muscle & JDM',
    bodyType: 'muscle',
    description: 'The roaring 5.0L Coyote V8 pony car. Functional hood heat extractors, aggressive front chin splitter, and tire-smoking power drift slides.',
    engine: '5.0L Coyote V8 · 500 HP · 7,250 RPM',
    primaryColor: 0x243550, // Blue Ember Metallic
    secondaryColor: 0x12151b, // Satin Black Roof & Stripes
    accentColor: 0x00d0ff, // Blue Breather LEDs
    liveryStyle: 'dark_horse_stripes',
    stats: {
      topSpeed: 8.9,
      acceleration: 8.8,
      handling: 8.2,
      braking: 8.4,
      driftGrip: 9.6,
      weight: 7.4,
    },
    physicsMultipliers: {
      topSpeedMult: 1.08,
      accelMult: 1.10,
      handlingMult: 1.04,
      brakingMult: 1.08,
      driftGripMult: 1.34,
      weightMult: 1.10,
    },
  },
  {
    id: 'dodge_charger_hellcat',
    name: 'Charger SRT Hellcat',
    manufacturer: 'Dodge SRT',
    category: 'Muscle & JDM',
    bodyType: 'muscle',
    description: 'The supercharged widebody quarter-mile king. Deep V8 whine, aggressive hood scoop, and intoxicating high-speed straight-line momentum.',
    engine: '6.2L Supercharged HEMI V8 · 707 HP · 880 Nm',
    primaryColor: 0x8a0b12, // Octane Red
    secondaryColor: 0x0b0c10, // Dual Carbon Racing Stripes
    accentColor: 0xffffff, // Hellcat Fender Badge
    liveryStyle: 'hellcat_stripes',
    stats: {
      topSpeed: 9.3,
      acceleration: 8.7,
      handling: 7.8,
      braking: 8.1,
      driftGrip: 9.8,
      weight: 8.2,
    },
    physicsMultipliers: {
      topSpeedMult: 1.14,
      accelMult: 1.08,
      handlingMult: 0.98,
      brakingMult: 1.04,
      driftGripMult: 1.38,
      weightMult: 1.16,
    },
  },
  {
    id: 'nissan_skyline_gtr',
    name: 'Skyline GT-R R34 V-Spec',
    manufacturer: 'Nissan Motorsport',
    category: 'Muscle & JDM',
    bodyType: 'jdm',
    description: 'Godzilla. Legendary ATTESA E-TS all-wheel drive, twin-turbo inline-6, iconic quad round taillights, and race-winning chassis balance.',
    engine: '2.6L RB26DETT Twin-Turbo I6 · 330 HP Tuned',
    primaryColor: 0x183a75, // Bayside Blue
    secondaryColor: 0xffffff, // White Nismo Decals
    accentColor: 0xcc0000, // Red GT-R Badge
    liveryStyle: 'gtr_bayside',
    stats: {
      topSpeed: 9.0,
      acceleration: 9.0,
      handling: 9.1,
      braking: 9.0,
      driftGrip: 9.5,
      weight: 6.8,
    },
    physicsMultipliers: {
      topSpeedMult: 1.10,
      accelMult: 1.14,
      handlingMult: 1.16,
      brakingMult: 1.14,
      driftGripMult: 1.30,
      weightMult: 1.02,
    },
  },
  {
    id: 'toyota_supra_mk4',
    name: 'Supra Twin-Turbo 2JZ',
    manufacturer: 'Toyota Gazoo',
    category: 'Muscle & JDM',
    bodyType: 'jdm',
    description: 'The golden era Japanese grand tourer. Bulletproof 2JZ twin-turbo powertrain, signature tall hoop rear spoiler, and buttery smooth drift transitions.',
    engine: '3.0L 2JZ-GTE Sequential Twin-Turbo I6 · 320 HP',
    primaryColor: 0xef233c, // Renaissance Red
    secondaryColor: 0x141414, // Carbon Front Lip & Spoiler
    accentColor: 0xffd700, // Gold 5-Spoke Tuner Rims
    liveryStyle: 'supra_classic',
    stats: {
      topSpeed: 9.1,
      acceleration: 8.9,
      handling: 8.8,
      braking: 8.7,
      driftGrip: 9.7,
      weight: 6.9,
    },
    physicsMultipliers: {
      topSpeedMult: 1.12,
      accelMult: 1.12,
      handlingMult: 1.12,
      brakingMult: 1.10,
      driftGripMult: 1.35,
      weightMult: 1.04,
    },
  },
  {
    id: 'mazda_rx7_veilside',
    name: 'RX-7 FD Spirit R Rotary',
    manufacturer: 'Mazda Motorsport',
    category: 'Muscle & JDM',
    bodyType: 'jdm',
    description: 'The high-revving sequential twin-turbo rotary icon. Near-perfect 50:50 weight distribution, pop-up headlight housings, and telepathic steering precision.',
    engine: '1.3L 13B-REW Twin-Rotary · 280 HP · 8,000 RPM',
    primaryColor: 0xd6c278, // Titanium Gray Metallic
    secondaryColor: 0x1a1a1e, // Carbon Aero Mirrors
    accentColor: 0xff3b30, // Red Spirit R Interior Glimpse
    liveryStyle: 'rotary_spirit',
    stats: {
      topSpeed: 8.8,
      acceleration: 9.1,
      handling: 9.6,
      braking: 9.3,
      driftGrip: 9.3,
      weight: 5.6,
    },
    physicsMultipliers: {
      topSpeedMult: 1.08,
      accelMult: 1.16,
      handlingMult: 1.24,
      brakingMult: 1.18,
      driftGripMult: 1.26,
      weightMult: 0.92,
    },
  },

  // -------------------------------------------------------------------------
  // 5. HOT HATCH & CLASSIC
  // -------------------------------------------------------------------------
  {
    id: 'mini_cooper_jcw',
    name: 'Mini Cooper JCW GP',
    manufacturer: 'John Cooper Works',
    category: 'Hot Hatch & Classic',
    bodyType: 'hatch',
    description: 'The road-going go-kart. Ultra-short wheelbase, aggressive carbon wheel arch spats, roof-mounted biplane wing, and instantaneous slalom change-of-direction.',
    engine: '2.0L Turbo 4-Cylinder · 306 HP · Front-Wheel Drive Bite',
    primaryColor: 0x3d434a, // Racing Grey Metallic
    secondaryColor: 0xd90429, // Chili Red Accent Roof & Mirror Caps
    accentColor: 0xffffff, // White Bonnet Stripes
    liveryStyle: 'jcw_rally',
    stats: {
      topSpeed: 8.3,
      acceleration: 8.8,
      handling: 9.7,
      braking: 9.2,
      driftGrip: 8.6,
      weight: 5.4,
    },
    physicsMultipliers: {
      topSpeedMult: 1.02,
      accelMult: 1.12,
      handlingMult: 1.25,
      brakingMult: 1.16,
      driftGripMult: 1.14,
      weightMult: 0.90,
    },
  },
  {
    id: 'volkswagen_golf_r',
    name: 'Golf R 4MOTION Turbo',
    manufacturer: 'Volkswagen R',
    category: 'Hot Hatch & Classic',
    bodyType: 'hatch',
    description: 'The all-weather pocket rocket. 4MOTION torque vectoring all-wheel-drive, quad chrome exhaust pipes, and unflappable stability through steep coaster drops.',
    engine: '2.0L TSI Turbocharged I4 · 320 HP · 7-Speed DSG',
    primaryColor: 0x0047bb, // Lapiz Blue Metallic
    secondaryColor: 0x111317, // Gloss Black Mirror Caps
    accentColor: 0x00d4ff, // Blue R-Logo Signature
    liveryStyle: 'golf_r_clean',
    stats: {
      topSpeed: 8.6,
      acceleration: 8.9,
      handling: 9.0,
      braking: 8.9,
      driftGrip: 8.7,
      weight: 6.2,
    },
    physicsMultipliers: {
      topSpeedMult: 1.05,
      accelMult: 1.14,
      handlingMult: 1.15,
      brakingMult: 1.12,
      driftGripMult: 1.18,
      weightMult: 0.98,
    },
  },
  {
    id: 'classic_micro_kart',
    name: 'HO 1:87 Championship Kart',
    manufacturer: 'Desk Racer Classics',
    category: 'Hot Hatch & Classic',
    bodyType: 'classic_kart',
    description: 'The iconic open-cockpit micro go-kart that started it all! Tubular steel perimeter frame, twin side pods, white racing stripe, and a fearless helmeted driver.',
    engine: '125cc 2-Stroke Racing Motor · 45 HP · Direct Drive',
    primaryColor: 0xff2b1e, // Classic Racer Crimson
    secondaryColor: 0xf7f9fc, // Racing White Center Stripe
    accentColor: 0xffbb44, // Gold Anodized Rims
    liveryStyle: 'classic_stripes',
    stats: {
      topSpeed: 8.5,
      acceleration: 8.5,
      handling: 8.5,
      braking: 8.5,
      driftGrip: 8.5,
      weight: 5.0,
    },
    physicsMultipliers: {
      topSpeedMult: 1.00,
      accelMult: 1.00,
      handlingMult: 1.00,
      brakingMult: 1.00,
      driftGripMult: 1.00,
      weightMult: 1.00,
    },
  },
];

const STORAGE_KEY = 'desk_racer_active_vehicle_id';

/**
 * Returns the currently active vehicle definition.
 */
export function getActiveVehicle() {
  let storedId = null;
  try {
    if (typeof localStorage !== 'undefined') {
      storedId = localStorage.getItem(STORAGE_KEY);
    }
  } catch (_e) {}

  if (storedId) {
    const found = VEHICLE_DEFINITIONS.find((v) => v.id === storedId);
    if (found) return found;
  }
  return VEHICLE_DEFINITIONS[0]; // Default: Apex RB20 F1
}

/**
 * Saves the selected vehicle ID to localStorage.
 */
export function setActiveVehicle(vehicleId) {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, vehicleId);
    }
  } catch (_e) {}
  return getVehicleById(vehicleId);
}

/**
 * Finds a vehicle definition by ID.
 */
export function getVehicleById(vehicleId) {
  return VEHICLE_DEFINITIONS.find((v) => v.id === vehicleId) || VEHICLE_DEFINITIONS[0];
}
