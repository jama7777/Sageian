import * as THREE from 'three';

/**
 * Procedural 3D Vehicle Model Builder
 * Constructs rich, authentic 1:87 scale vehicle bodies for all 22 cars across:
 * - 'f1': Ground-effect aerodynamic single-seaters with multi-element wings & halo
 * - 'lamborghini': Angular wedge hypercars with deep side scoops, front splitters & swan-neck GT wings
 * - 'bugatti': Horseshoe front grille, sweeping C-line contour, dorsal fin & central quad exhausts
 * - 'tata_suv': Muscular SUV silhouette, floating contrast roofline, roof rails & dual skid plates
 * - 'muscle': Power-bulge hood, wide black honeycomb grille, fastback roof & ducktail spoiler
 * - 'jdm': Iconic Japanese tuner silhouettes, front intercoolers, high hoop wings & quad round lamps
 * - 'hatch': Compact hot-hatch silhouette, contrast roof, rally spoiler & center dual exhausts
 * - 'classic_kart': Open-cockpit tube frame, fairings & exposed race engine
 */

// Shared reusable materials & geometries cache for high performance
const materialCache = new Map();

function getOrCreateMaterial(colorHex, roughness, metalness, clearcoat = 0.5, name = '') {
  const key = `${colorHex}_${roughness}_${metalness}_${clearcoat}_${name}`;
  if (materialCache.has(key)) {
    return materialCache.get(key);
  }
  const mat = new THREE.MeshStandardMaterial({
    color: colorHex,
    roughness: roughness,
    metalness: metalness,
  });
  materialCache.set(key, mat);
  return mat;
}

export function buildVehicleBodyMesh(vehicleDef, options = {}) {
  const isShowroom = Boolean(options.showroom);
  const scale = options.scale || 1.0;

  const root = new THREE.Group();
  root.name = `VehicleBody_${vehicleDef.id}`;

  const primColor = vehicleDef.primaryColor ?? 0xff2b1e;
  const secColor = vehicleDef.secondaryColor ?? 0x181b22;
  const accColor = vehicleDef.accentColor ?? 0xffd700;

  // Standard material palettes
  const primaryMat = getOrCreateMaterial(primColor, 0.22, 0.40, 0.8, 'prim');
  const secondaryMat = getOrCreateMaterial(secColor, 0.35, 0.45, 0.4, 'sec');
  const accentMat = getOrCreateMaterial(accColor, 0.25, 0.70, 0.6, 'acc');
  const carbonMat = getOrCreateMaterial(0x111317, 0.50, 0.35, 0.1, 'carbon');
  const chromeMat = getOrCreateMaterial(0xdde4ed, 0.15, 0.95, 0.9, 'chrome');
  const darkGlassMat = new THREE.MeshStandardMaterial({
    color: 0x090b10,
    roughness: 0.10,
    metalness: 0.90,
  });
  const headlightMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xecf6ff,
    emissiveIntensity: 1.6,
    roughness: 0.1,
  });
  const taillightMat = new THREE.MeshStandardMaterial({
    color: 0xff1020,
    emissive: 0xff0a18,
    emissiveIntensity: 1.8,
    roughness: 0.1,
  });
  const goldWheelMat = getOrCreateMaterial(0xffbe3b, 0.22, 0.88, 0.5, 'gold');

  const bodyType = vehicleDef.bodyType || 'classic_kart';

  // -------------------------------------------------------------------------
  // 1. FORMULA 1 BODY
  // -------------------------------------------------------------------------
  if (bodyType === 'f1') {
    // Monocoque narrow central fuselage
    const tub = new THREE.Mesh(
      new THREE.BoxGeometry(0.0042, 0.0026, 0.0160),
      primaryMat
    );
    tub.position.set(0, 0.0024, 0.0005);
    root.add(tub);

    // Tapered Nose Cone (+Z front)
    const nose = new THREE.Mesh(
      new THREE.ConeGeometry(0.0020, 0.0075, 5),
      primaryMat
    );
    nose.rotation.x = Math.PI / 2;
    nose.position.set(0, 0.0021, 0.0095);
    nose.scale.set(1.0, 0.6, 1.0);
    root.add(nose);

    // Nose tip accent (e.g. Yellow/White/Red cone tip)
    const noseTip = new THREE.Mesh(
      new THREE.BoxGeometry(0.0016, 0.0012, 0.0022),
      accentMat
    );
    noseTip.position.set(0, 0.0019, 0.0125);
    root.add(noseTip);

    // Front Wing Mainplane + Endplates
    const frontWing = new THREE.Mesh(
      new THREE.BoxGeometry(0.0118, 0.0005, 0.0032),
      secondaryMat
    );
    frontWing.position.set(0, 0.0013, 0.0118);
    root.add(frontWing);

    for (const sx of [-0.0058, 0.0058]) {
      const fEndplate = new THREE.Mesh(
        new THREE.BoxGeometry(0.0004, 0.0020, 0.0034),
        accentMat
      );
      fEndplate.position.set(sx, 0.0020, 0.0118);
      root.add(fEndplate);
    }

    // Sidepods (left and right radiator cooling channels)
    for (const sx of [-0.0038, 0.0038]) {
      const sidepod = new THREE.Mesh(
        new THREE.BoxGeometry(0.0026, 0.0024, 0.0080),
        primaryMat
      );
      sidepod.position.set(sx, 0.0023, -0.0008);
      root.add(sidepod);

      // Black radiator intake mouth
      const intake = new THREE.Mesh(
        new THREE.BoxGeometry(0.0022, 0.0018, 0.0005),
        carbonMat
      );
      intake.position.set(sx, 0.0024, 0.0033);
      root.add(intake);

      // Bargeboards / floor edge
      const floorEdge = new THREE.Mesh(
        new THREE.BoxGeometry(0.0032, 0.0003, 0.0090),
        carbonMat
      );
      floorEdge.position.set(sx * 1.1, 0.0011, -0.0008);
      root.add(floorEdge);
    }

    // Cockpit surround & Cockpit opening
    const cockpitRecess = new THREE.Mesh(
      new THREE.BoxGeometry(0.0026, 0.0014, 0.0036),
      carbonMat
    );
    cockpitRecess.position.set(0, 0.0036, 0.0012);
    root.add(cockpitRecess);

    // F1 Halo Safety Ring
    const haloHoop = new THREE.Mesh(
      new THREE.TorusGeometry(0.0018, 0.00032, 6, 12, Math.PI),
      carbonMat
    );
    haloHoop.rotation.x = Math.PI * 0.45;
    haloHoop.position.set(0, 0.0049, 0.0005);
    root.add(haloHoop);

    const haloCenterPillar = new THREE.Mesh(
      new THREE.CylinderGeometry(0.00028, 0.00028, 0.0018, 6),
      carbonMat
    );
    haloCenterPillar.position.set(0, 0.0042, 0.0022);
    root.add(haloCenterPillar);

    // Engine Airbox & Shark Fin
    const airbox = new THREE.Mesh(
      new THREE.BoxGeometry(0.0020, 0.0026, 0.0044),
      secondaryMat
    );
    airbox.position.set(0, 0.0046, -0.0026);
    root.add(airbox);

    const sharkFin = new THREE.Mesh(
      new THREE.BoxGeometry(0.0003, 0.0028, 0.0055),
      primaryMat
    );
    sharkFin.position.set(0, 0.0056, -0.0036);
    root.add(sharkFin);

    // Rear High Downforce Wing (DRS wing) + Twin Pylons + Endplates
    const rearWing = new THREE.Mesh(
      new THREE.BoxGeometry(0.0110, 0.0006, 0.0028),
      primaryMat
    );
    rearWing.position.set(0, 0.0076, -0.0084);
    rearWing.rotation.x = -0.15;
    root.add(rearWing);

    const rearWingFlap = new THREE.Mesh(
      new THREE.BoxGeometry(0.0108, 0.0004, 0.0014),
      accentMat
    );
    rearWingFlap.position.set(0, 0.0080, -0.0092);
    rearWingFlap.rotation.x = -0.25;
    root.add(rearWingFlap);

    for (const sx of [-0.0053, 0.0053]) {
      const rEndplate = new THREE.Mesh(
        new THREE.BoxGeometry(0.0004, 0.0038, 0.0042),
        secondaryMat
      );
      rEndplate.position.set(sx, 0.0065, -0.0084);
      root.add(rEndplate);
    }

    for (const sx of [-0.0012, 0.0012]) {
      const pylon = new THREE.Mesh(
        new THREE.BoxGeometry(0.0004, 0.0042, 0.0012),
        carbonMat
      );
      pylon.position.set(sx, 0.0052, -0.0078);
      root.add(pylon);
    }

    // Rain light (flashing ruby LED at center of rear crash structure)
    const rainLight = new THREE.Mesh(
      new THREE.BoxGeometry(0.0012, 0.0008, 0.0004),
      taillightMat
    );
    rainLight.position.set(0, 0.0022, -0.0094);
    root.add(rainLight);

  // -------------------------------------------------------------------------
  // 2. LAMBORGHINI WEDGE HYPERCAR BODY
  // -------------------------------------------------------------------------
  } else if (bodyType === 'lamborghini') {
    // Low angular wedge main body
    const mainBody = new THREE.Mesh(
      new THREE.BoxGeometry(0.0100, 0.0024, 0.0162),
      primaryMat
    );
    mainBody.position.set(0, 0.0024, 0.0002);
    root.add(mainBody);

    // Front angled nose wedge (+Z front)
    const noseWedge = new THREE.Mesh(
      new THREE.BoxGeometry(0.0092, 0.0016, 0.0042),
      primaryMat
    );
    noseWedge.position.set(0, 0.0020, 0.0085);
    noseWedge.rotation.x = 0.22;
    root.add(noseWedge);

    // Aggressive front carbon splitter
    const splitter = new THREE.Mesh(
      new THREE.BoxGeometry(0.0108, 0.0004, 0.0030),
      carbonMat
    );
    splitter.position.set(0, 0.0011, 0.0098);
    root.add(splitter);

    // Y-Shaped Headlight accents
    for (const sx of [-0.0036, 0.0036]) {
      const headlight = new THREE.Mesh(
        new THREE.BoxGeometry(0.0022, 0.0006, 0.0010),
        headlightMat
      );
      headlight.position.set(sx, 0.0024, 0.0096);
      headlight.rotation.y = sx < 0 ? 0.25 : -0.25;
      root.add(headlight);
    }

    // Cockpit & roof canopy
    const canopy = new THREE.Mesh(
      new THREE.BoxGeometry(0.0068, 0.0024, 0.0076),
      darkGlassMat
    );
    canopy.position.set(0, 0.0043, -0.0004);
    canopy.rotation.x = -0.08;
    root.add(canopy);

    // Roof scoop / contrast central pillar
    const roofScoop = new THREE.Mesh(
      new THREE.BoxGeometry(0.0018, 0.0008, 0.0046),
      carbonMat
    );
    roofScoop.position.set(0, 0.0056, -0.0012);
    root.add(roofScoop);

    // Deep Angular Side Air Intakes
    for (const sx of [-0.0052, 0.0052]) {
      const sideIntake = new THREE.Mesh(
        new THREE.BoxGeometry(0.0012, 0.0020, 0.0044),
        secondaryMat
      );
      sideIntake.position.set(sx, 0.0026, -0.0022);
      root.add(sideIntake);

      const airHole = new THREE.Mesh(
        new THREE.BoxGeometry(0.0006, 0.0015, 0.0028),
        carbonMat
      );
      airHole.position.set(sx * 1.05, 0.0026, -0.0015);
      root.add(airHole);
    }

    // Rear Swan-Neck GT Wing
    const gtWing = new THREE.Mesh(
      new THREE.BoxGeometry(0.0116, 0.0006, 0.0026),
      carbonMat
    );
    gtWing.position.set(0, 0.0072, -0.0078);
    gtWing.rotation.x = -0.12;
    root.add(gtWing);

    for (const sx of [-0.0034, 0.0034]) {
      const swanNeck = new THREE.Mesh(
        new THREE.BoxGeometry(0.0004, 0.0036, 0.0016),
        carbonMat
      );
      swanNeck.position.set(sx, 0.0054, -0.0072);
      swanNeck.rotation.x = 0.25;
      root.add(swanNeck);
    }

    // Rear hexagonal taillights & quad diffuser
    for (const sx of [-0.0036, 0.0036]) {
      const lamboTail = new THREE.Mesh(
        new THREE.BoxGeometry(0.0022, 0.0007, 0.0004),
        taillightMat
      );
      lamboTail.position.set(sx, 0.0029, -0.0084);
      root.add(lamboTail);
    }

    const diffuser = new THREE.Mesh(
      new THREE.BoxGeometry(0.0088, 0.0012, 0.0022),
      carbonMat
    );
    diffuser.position.set(0, 0.0013, -0.0082);
    root.add(diffuser);

  // -------------------------------------------------------------------------
  // 3. BUGATTI HYPERCAR BODY
  // -------------------------------------------------------------------------
  } else if (bodyType === 'bugatti') {
    // Flowing hypercar curved monocoque
    const bugattiBody = new THREE.Mesh(
      new THREE.BoxGeometry(0.0102, 0.0026, 0.0160),
      primaryMat
    );
    bugattiBody.position.set(0, 0.0025, 0.0002);
    root.add(bugattiBody);

    // Distinctive Front Horseshoe Grille
    const horseshoe = new THREE.Mesh(
      new THREE.CylinderGeometry(0.0018, 0.0018, 0.0008, 16),
      chromeMat
    );
    horseshoe.rotation.x = Math.PI / 2;
    horseshoe.position.set(0, 0.0022, 0.0090);
    horseshoe.scale.set(0.85, 1.0, 1.25);
    root.add(horseshoe);

    const grilleInner = new THREE.Mesh(
      new THREE.CylinderGeometry(0.0014, 0.0014, 0.0009, 16),
      carbonMat
    );
    grilleInner.rotation.x = Math.PI / 2;
    grilleInner.position.set(0, 0.0022, 0.0091);
    grilleInner.scale.set(0.80, 1.0, 1.15);
    root.add(grilleInner);

    // Front horizontal quadruple LED headlights
    for (const sx of [-0.0038, 0.0038]) {
      const bugattiLamp = new THREE.Mesh(
        new THREE.BoxGeometry(0.0020, 0.0005, 0.0008),
        headlightMat
      );
      bugattiLamp.position.set(sx, 0.0025, 0.0086);
      bugattiLamp.rotation.y = sx < 0 ? 0.18 : -0.18;
      root.add(bugattiLamp);
    }

    // Iconic Bugatti "C-Line" Side Accent Flares
    for (const sx of [-0.0052, 0.0052]) {
      const cLineRing = new THREE.Mesh(
        new THREE.TorusGeometry(0.0036, 0.00045, 6, 16, Math.PI * 1.3),
        chromeMat
      );
      cLineRing.rotation.y = sx < 0 ? -Math.PI / 2 : Math.PI / 2;
      cLineRing.rotation.z = Math.PI * 0.15;
      cLineRing.position.set(sx, 0.0035, -0.0005);
      root.add(cLineRing);

      const secondaryFlank = new THREE.Mesh(
        new THREE.BoxGeometry(0.0006, 0.0028, 0.0062),
        secondaryMat
      );
      secondaryFlank.position.set(sx * 0.98, 0.0028, -0.0005);
      root.add(secondaryFlank);
    }

    // Smooth teardrop glass canopy
    const canopy = new THREE.Mesh(
      new THREE.BoxGeometry(0.0064, 0.0022, 0.0078),
      darkGlassMat
    );
    canopy.position.set(0, 0.0044, -0.0006);
    canopy.rotation.x = -0.06;
    root.add(canopy);

    // Central Aerodynamic Dorsal Spine (from roof to active wing)
    const spine = new THREE.Mesh(
      new THREE.BoxGeometry(0.0004, 0.0016, 0.0090),
      accentMat
    );
    spine.position.set(0, 0.0049, -0.0026);
    root.add(spine);

    // Active flush rear wing
    const activeWing = new THREE.Mesh(
      new THREE.BoxGeometry(0.0108, 0.0005, 0.0026),
      carbonMat
    );
    activeWing.position.set(0, 0.0054, -0.0075);
    activeWing.rotation.x = -0.10;
    root.add(activeWing);

    // Full-width continuous ruby LED light bar across tail
    const rearLightBar = new THREE.Mesh(
      new THREE.BoxGeometry(0.0094, 0.0005, 0.0005),
      taillightMat
    );
    rearLightBar.position.set(0, 0.0031, -0.0084);
    root.add(rearLightBar);

    // Central titanium quad exhaust cluster
    for (const ex of [-0.0009, -0.0003, 0.0003, 0.0009]) {
      const tip = new THREE.Mesh(
        new THREE.CylinderGeometry(0.0003, 0.0003, 0.0012, 10),
        chromeMat
      );
      tip.rotation.x = Math.PI / 2;
      tip.position.set(ex, 0.0018, -0.0084);
      root.add(tip);
    }

  // -------------------------------------------------------------------------
  // 4. TATA & MAHINDRA ROBUST SUV / OFF-ROAD BODY
  // -------------------------------------------------------------------------
  } else if (bodyType === 'tata_suv') {
    // Muscular high two-box SUV lower body
    const suvLower = new THREE.Mesh(
      new THREE.BoxGeometry(0.0098, 0.0034, 0.0152),
      primaryMat
    );
    suvLower.position.set(0, 0.0031, 0.0002);
    root.add(suvLower);

    // Dark protective cladding around lower perimeter
    const lowerCladding = new THREE.Mesh(
      new THREE.BoxGeometry(0.0101, 0.0011, 0.0155),
      carbonMat
    );
    lowerCladding.position.set(0, 0.0016, 0.0002);
    root.add(lowerCladding);

    // Front silver skid plate
    const frontSkid = new THREE.Mesh(
      new THREE.BoxGeometry(0.0062, 0.0008, 0.0018),
      chromeMat
    );
    frontSkid.position.set(0, 0.0014, 0.0082);
    root.add(frontSkid);

    // High bold upright front grille (Tata Humanity Line / Chrome tri-arrow)
    const grille = new THREE.Mesh(
      new THREE.BoxGeometry(0.0078, 0.0016, 0.0008),
      secondaryMat
    );
    grille.position.set(0, 0.0034, 0.0080);
    root.add(grille);

    // Slim Upper LED DRL Eyebrows
    for (const sx of [-0.0036, 0.0036]) {
      const eyebrow = new THREE.Mesh(
        new THREE.BoxGeometry(0.0018, 0.00035, 0.0006),
        headlightMat
      );
      eyebrow.position.set(sx, 0.0044, 0.0080);
      root.add(eyebrow);

      // Lower projector headlamp cluster in bumper
      const projector = new THREE.Mesh(
        new THREE.BoxGeometry(0.0012, 0.0012, 0.0006),
        headlightMat
      );
      projector.position.set(sx, 0.0031, 0.0080);
      root.add(projector);
    }

    // Upright SUV Cabin & Glass Greenhouse
    const cabin = new THREE.Mesh(
      new THREE.BoxGeometry(0.0084, 0.0032, 0.0086),
      darkGlassMat
    );
    cabin.position.set(0, 0.0058, -0.0012);
    root.add(cabin);

    // Floating Contrast Roof (e.g. Piano Black / Starlight Gold roof)
    const floatingRoof = new THREE.Mesh(
      new THREE.BoxGeometry(0.0088, 0.0007, 0.0090),
      secondaryMat
    );
    floatingRoof.position.set(0, 0.0076, -0.0012);
    root.add(floatingRoof);

    // Silver Functional Roof Rails
    for (const sx of [-0.0038, 0.0038]) {
      const roofRail = new THREE.Mesh(
        new THREE.BoxGeometry(0.00035, 0.0005, 0.0078),
        chromeMat
      );
      roofRail.position.set(sx, 0.0081, -0.0012);
      root.add(roofRail);
    }

    // Integrated rear tailgate spoiler
    const rearSpoiler = new THREE.Mesh(
      new THREE.BoxGeometry(0.0086, 0.0005, 0.0018),
      secondaryMat
    );
    rearSpoiler.position.set(0, 0.0077, -0.0062);
    root.add(rearSpoiler);

    // Connected LED tailgate lightbar (Harrier/Safari signature)
    const tailBar = new THREE.Mesh(
      new THREE.BoxGeometry(0.0084, 0.0006, 0.0006),
      taillightMat
    );
    tailBar.position.set(0, 0.0039, -0.0078);
    root.add(tailBar);

    // Rear silver faux skid plate & dual exhaust tips
    const rearSkid = new THREE.Mesh(
      new THREE.BoxGeometry(0.0060, 0.0008, 0.0014),
      chromeMat
    );
    rearSkid.position.set(0, 0.0016, -0.0076);
    root.add(rearSkid);

  // -------------------------------------------------------------------------
  // 5. AMERICAN MUSCLE (Mustang Dark Horse / Hellcat)
  // -------------------------------------------------------------------------
  } else if (bodyType === 'muscle') {
    // Wide muscular lower chassis
    const muscleBody = new THREE.Mesh(
      new THREE.BoxGeometry(0.0102, 0.0026, 0.0164),
      primaryMat
    );
    muscleBody.position.set(0, 0.0026, 0.0002);
    root.add(muscleBody);

    // Long powerful hood with center power-dome bulge
    const hoodBulge = new THREE.Mesh(
      new THREE.BoxGeometry(0.0044, 0.0008, 0.0064),
      secondaryMat
    );
    hoodBulge.position.set(0, 0.0040, 0.0042);
    root.add(hoodBulge);

    // Dual hood heat extractors
    for (const sx of [-0.0015, 0.0015]) {
      const vent = new THREE.Mesh(
        new THREE.BoxGeometry(0.0008, 0.0003, 0.0022),
        carbonMat
      );
      vent.position.set(sx, 0.0044, 0.0046);
      root.add(vent);
    }

    // Wide menacing honeycomb front grille
    const grille = new THREE.Mesh(
      new THREE.BoxGeometry(0.0094, 0.0016, 0.0008),
      carbonMat
    );
    grille.position.set(0, 0.0025, 0.0086);
    root.add(grille);

    // Tri-bar LED / Inset aggressive headlights
    for (const sx of [-0.0038, 0.0038]) {
      const head = new THREE.Mesh(
        new THREE.BoxGeometry(0.0016, 0.0007, 0.0006),
        headlightMat
      );
      head.position.set(sx, 0.0029, 0.0087);
      root.add(head);
    }

    // Fastback muscle coupe roofline
    const roof = new THREE.Mesh(
      new THREE.BoxGeometry(0.0076, 0.0025, 0.0074),
      darkGlassMat
    );
    roof.position.set(0, 0.0047, -0.0008);
    roof.rotation.x = -0.14;
    root.add(roof);

    // Distinctive rear ducktail / wickerbill spoiler
    const ducktail = new THREE.Mesh(
      new THREE.BoxGeometry(0.0096, 0.0012, 0.0014),
      secondaryMat
    );
    ducktail.position.set(0, 0.0044, -0.0082);
    ducktail.rotation.x = 0.22;
    root.add(ducktail);

    // Iconic Tri-Bar vertical taillights
    for (const sx of [-0.0038, 0.0038]) {
      for (let bar = -1; bar <= 1; bar++) {
        const triBar = new THREE.Mesh(
          new THREE.BoxGeometry(0.00035, 0.0012, 0.0004),
          taillightMat
        );
        triBar.position.set(sx + bar * 0.0005, 0.0029, -0.0086);
        root.add(triBar);
      }
    }

    // Massive quad chrome exhaust cannons
    for (const sx of [-0.0032, -0.0022, 0.0022, 0.0032]) {
      const tip = new THREE.Mesh(
        new THREE.CylinderGeometry(0.00042, 0.00042, 0.0016, 12),
        chromeMat
      );
      tip.rotation.x = Math.PI / 2;
      tip.position.set(sx, 0.0017, -0.0086);
      root.add(tip);
    }

  // -------------------------------------------------------------------------
  // 6. JAPANESE JDM LEGENDS (Skyline GT-R / Supra MK4 / RX-7)
  // -------------------------------------------------------------------------
  } else if (bodyType === 'jdm') {
    // Low tuner aerodynamic body
    const jdmBody = new THREE.Mesh(
      new THREE.BoxGeometry(0.0098, 0.0023, 0.0160),
      primaryMat
    );
    jdmBody.position.set(0, 0.0024, 0.0002);
    root.add(jdmBody);

    // Front intercooler mouth opening & aluminum intercooler
    const intercooler = new THREE.Mesh(
      new THREE.BoxGeometry(0.0048, 0.0012, 0.0012),
      chromeMat
    );
    intercooler.position.set(0, 0.0017, 0.0084);
    root.add(intercooler);

    const frontLip = new THREE.Mesh(
      new THREE.BoxGeometry(0.0102, 0.0004, 0.0024),
      carbonMat
    );
    frontLip.position.set(0, 0.0011, 0.0088);
    root.add(frontLip);

    // Sleek aerodynamic headlights
    for (const sx of [-0.0036, 0.0036]) {
      const head = new THREE.Mesh(
        new THREE.BoxGeometry(0.0018, 0.0006, 0.0014),
        headlightMat
      );
      head.position.set(sx, 0.0026, 0.0084);
      head.rotation.x = 0.15;
      root.add(head);
    }

    // Aerodynamic bubble canopy
    const canopy = new THREE.Mesh(
      new THREE.BoxGeometry(0.0070, 0.0024, 0.0072),
      darkGlassMat
    );
    canopy.position.set(0, 0.0044, -0.0006);
    root.add(canopy);

    // High Arched Hoop Wing (Supra) or Twin-Blade GT Wing (GT-R)
    const hoopWing = new THREE.Mesh(
      new THREE.BoxGeometry(0.0104, 0.0006, 0.0026),
      primaryMat
    );
    hoopWing.position.set(0, 0.0068, -0.0078);
    hoopWing.rotation.x = -0.08;
    root.add(hoopWing);

    for (const sx of [-0.0042, 0.0042]) {
      const wingStalk = new THREE.Mesh(
        new THREE.BoxGeometry(0.0005, 0.0036, 0.0018),
        primaryMat
      );
      wingStalk.position.set(sx, 0.0051, -0.0076);
      root.add(wingStalk);
    }

    // Iconic Four Round Skyline Taillights (or Supra 4-lens cluster)
    for (const sx of [-0.0034, -0.0020, 0.0020, 0.0034]) {
      const roundTail = new THREE.Mesh(
        new THREE.CylinderGeometry(0.00052, 0.00052, 0.0004, 12),
        taillightMat
      );
      roundTail.rotation.x = Math.PI / 2;
      roundTail.position.set(sx, 0.0027, -0.0083);
      root.add(roundTail);
    }

    // JDM single cannon exhaust with burnt titanium tip
    const jdmMuffler = new THREE.Mesh(
      new THREE.CylinderGeometry(0.00055, 0.00055, 0.0022, 12),
      chromeMat
    );
    jdmMuffler.rotation.x = Math.PI / 2 + 0.08;
    jdmMuffler.rotation.y = -0.15;
    jdmMuffler.position.set(0.0032, 0.0016, -0.0084);
    root.add(jdmMuffler);

  // -------------------------------------------------------------------------
  // 7. HOT HATCH (Mini JCW / Golf R)
  // -------------------------------------------------------------------------
  } else if (bodyType === 'hatch') {
    // Compact upright hot-hatch lower body
    const hatchBody = new THREE.Mesh(
      new THREE.BoxGeometry(0.0094, 0.0028, 0.0146),
      primaryMat
    );
    hatchBody.position.set(0, 0.0026, 0.0002);
    root.add(hatchBody);

    // Front honeycomb grille & red accent line
    const grille = new THREE.Mesh(
      new THREE.BoxGeometry(0.0076, 0.0014, 0.0006),
      carbonMat
    );
    grille.position.set(0, 0.0026, 0.0077);
    root.add(grille);

    const redGtiLine = new THREE.Mesh(
      new THREE.BoxGeometry(0.0078, 0.00025, 0.0007),
      accentMat
    );
    redGtiLine.position.set(0, 0.0032, 0.0078);
    root.add(redGtiLine);

    // Round or swept headlights
    for (const sx of [-0.0034, 0.0034]) {
      const head = new THREE.Mesh(
        new THREE.CylinderGeometry(0.0007, 0.0007, 0.0005, 12),
        headlightMat
      );
      head.rotation.x = Math.PI / 2;
      head.position.set(sx, 0.0031, 0.0076);
      root.add(head);
    }

    // Upright cabin greenhouse
    const cabin = new THREE.Mesh(
      new THREE.BoxGeometry(0.0080, 0.0028, 0.0078),
      darkGlassMat
    );
    cabin.position.set(0, 0.0052, -0.0008);
    root.add(cabin);

    // Contrast Painted Roof (e.g. Chili Red or Gloss Black)
    const roof = new THREE.Mesh(
      new THREE.BoxGeometry(0.0084, 0.0006, 0.0080),
      secondaryMat
    );
    roof.position.set(0, 0.0068, -0.0008);
    root.add(roof);

    // High rally / biplane roof spoiler
    const rallyWing = new THREE.Mesh(
      new THREE.BoxGeometry(0.0086, 0.0006, 0.0018),
      secondaryMat
    );
    rallyWing.position.set(0, 0.0070, -0.0055);
    rallyWing.rotation.x = 0.15;
    root.add(rallyWing);

    // Rear taillights & center twin chrome exhausts
    for (const sx of [-0.0034, 0.0034]) {
      const tail = new THREE.Mesh(
        new THREE.BoxGeometry(0.0014, 0.0014, 0.0005),
        taillightMat
      );
      tail.position.set(sx, 0.0035, -0.0075);
      root.add(tail);
    }

    for (const sx of [-0.0007, 0.0007]) {
      const tip = new THREE.Mesh(
        new THREE.CylinderGeometry(0.00035, 0.00035, 0.0014, 12),
        chromeMat
      );
      tip.rotation.x = Math.PI / 2;
      tip.position.set(sx, 0.0016, -0.0076);
      root.add(tip);
    }

  // -------------------------------------------------------------------------
  // 8. CLASSIC MICRO-KART (Tube-frame open cockpit)
  // -------------------------------------------------------------------------
  } else {
    // Floor pan
    const floorPan = new THREE.Mesh(
      new THREE.BoxGeometry(0.0082, 0.0009, 0.0155),
      carbonMat
    );
    floorPan.position.set(0, 0.0014, 0);
    root.add(floorPan);

    // Front aerodynamic nose fairing (+Z front)
    const noseCone = new THREE.Mesh(
      new THREE.BoxGeometry(0.0086, 0.0021, 0.0044),
      primaryMat
    );
    noseCone.position.set(0, 0.0023, 0.0068);
    noseCone.rotation.x = 0.22;
    root.add(noseCone);

    // Nose Number Plate
    const numberPlate = new THREE.Mesh(
      new THREE.BoxGeometry(0.0048, 0.0004, 0.0028),
      secondaryMat
    );
    numberPlate.position.set(0, 0.0033, 0.0066);
    numberPlate.rotation.x = 0.22;
    root.add(numberPlate);

    // Left & Right Side Pods
    for (const sx of [-0.0044, 0.0044]) {
      const sidePod = new THREE.Mesh(
        new THREE.BoxGeometry(0.0024, 0.0024, 0.0076),
        primaryMat
      );
      sidePod.position.set(sx, 0.0024, -0.0004);
      root.add(sidePod);
    }

    // Rear Engine Block
    const engineBlock = new THREE.Mesh(
      new THREE.BoxGeometry(0.0034, 0.0036, 0.0042),
      chromeMat
    );
    engineBlock.position.set(0.0022, 0.0036, -0.0048);
    root.add(engineBlock);

    // Rear Wing
    const rearWing = new THREE.Mesh(
      new THREE.BoxGeometry(0.0096, 0.0007, 0.0024),
      carbonMat
    );
    rearWing.position.set(0, 0.0068, -0.0076);
    rearWing.rotation.x = -0.18;
    root.add(rearWing);

    // Bucket seat
    const seat = new THREE.Mesh(
      new THREE.BoxGeometry(0.0042, 0.0044, 0.0038),
      carbonMat
    );
    seat.position.set(0, 0.0036, -0.0015);
    seat.rotation.x = -0.22;
    root.add(seat);
  }

  // -------------------------------------------------------------------------
  // SHOWROOM-SPECIFIC ACCESSORIES (Wheels & Presentation Brake Rotors)
  // When displayed in the 3D Garage Showroom turntable, add complete 4 wheels
  // -------------------------------------------------------------------------
  if (isShowroom) {
    const tireMat = getOrCreateMaterial(0x181a1f, 0.78, 0.08, 0.0, 'tire');
    const rimMat = goldWheelMat;
    const brakeMat = chromeMat;

    // Front and rear wheel offsets
    const wheelPositions = [
      { x: -0.0054, y: 0.0024, z: 0.0054 }, // Front Left
      { x: 0.0054, y: 0.0024, z: 0.0054 },  // Front Right
      { x: -0.0056, y: 0.0026, z: -0.0054 }, // Rear Left
      { x: 0.0056, y: 0.0026, z: -0.0054 },  // Rear Right
    ];

    for (const pos of wheelPositions) {
      const wheelGroup = new THREE.Group();
      wheelGroup.position.set(pos.x, pos.y, pos.z);

      // Tire torus / cylinder
      const tire = new THREE.Mesh(
        new THREE.CylinderGeometry(0.0026, 0.0026, 0.0014, 16),
        tireMat
      );
      tire.rotation.z = Math.PI / 2;
      wheelGroup.add(tire);

      // Metallic rim hub
      const rim = new THREE.Mesh(
        new THREE.CylinderGeometry(0.0016, 0.0016, 0.00145, 12),
        rimMat
      );
      rim.rotation.z = Math.PI / 2;
      wheelGroup.add(rim);

      // Center lug nut
      const lug = new THREE.Mesh(
        new THREE.CylinderGeometry(0.0006, 0.0006, 0.00152, 6),
        chromeMat
      );
      lug.rotation.z = Math.PI / 2;
      wheelGroup.add(lug);

      root.add(wheelGroup);
    }
  }

  if (scale !== 1.0) {
    root.scale.set(scale, scale, scale);
  }

  return root;
}
