import * as THREE from 'three';

/**
 * Generates a full 720-sample C2-continuous periodic spline dataset from an array
 * of 3D control points [x, y, z, bank_deg, sector_id].
 * Exactly matches the schema of track_spline.json expected by CoasterTrackBuilder
 * and KartPhysicsController.
 */
export function generateSplineDataFromControlPoints(config) {
  const {
    id,
    name,
    description = '',
    controlPoints, // Array of [x, y, z, bank_deg, sector_id]
    sectors = [],
    track_width_m = 0.022,
    curb_width_m = 0.0025,
    rail_height_m = 0.0035,
    start_index = 0,
    atmosphereSettings = null,
  } = config;

  if (!controlPoints || controlPoints.length < 4) {
    throw new Error('Track requires at least 4 control points');
  }

  const M = controlPoints.length;
  const points = controlPoints.map((cp) => new THREE.Vector3(cp[0], cp[1], cp[2]));
  const banks = controlPoints.map((cp) => cp[3] || 0);
  const cpSectors = controlPoints.map((cp) => cp[4] || 1);

  // Closed Catmull-Rom curve in centripetal mode (avoids cusps and loops)
  const curve = new THREE.CatmullRomCurve3(points, true, 'centripetal');

  const N = 720; // Exact sample count standard for Desk Racer
  const rawPositions = new Array(N);

  for (let i = 0; i < N; i++) {
    const u = i / N;
    rawPositions[i] = curve.getPointAt(u);
  }

  // Precompute exact arc-lengths across all 720 segments
  let totalLength = 0;
  const arcLengths = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    arcLengths[i] = totalLength;
    const p0 = rawPositions[i];
    const p1 = rawPositions[(i + 1) % N];
    totalLength += p0.distanceTo(p1);
  }

  const samples = [];
  const _refUp = new THREE.Vector3(0, 1, 0);

  for (let i = 0; i < N; i++) {
    const u = i / N;
    const pos = rawPositions[i];
    const tangent = curve.getTangentAt(u).normalize();

    // Smoothly interpolate banking and sector from control points
    const cpFloat = u * M;
    const cp0 = Math.floor(cpFloat) % M;
    const cp1 = (cp0 + 1) % M;
    const frac = cpFloat - Math.floor(cpFloat);
    // Smooth Hermite s-curve interpolation
    const smoothT = frac * frac * (3 - 2 * frac);

    const bank_deg = banks[cp0] + (banks[cp1] - banks[cp0]) * smoothT;
    const sector = frac < 0.5 ? cpSectors[cp0] : cpSectors[cp1];

    // Reference Up orientation vector (fallback if tangent points near vertical)
    let upRef = _refUp;
    if (Math.abs(tangent.y) > 0.95) {
      upRef = new THREE.Vector3(0, 0, tangent.y > 0 ? -1 : 1);
    }

    // Right vector perpendicular to tangent and upRef
    // In Desk Racer: right x tangent = normal, tangent x normal = right
    const rawRight = new THREE.Vector3().crossVectors(tangent, upRef).normalize();
    const rawNormal = new THREE.Vector3().crossVectors(rawRight, tangent).normalize();

    // Bank angle rotates normal around the tangent axis
    const bankRad = (bank_deg * Math.PI) / 180;
    const normal = rawNormal.clone().applyAxisAngle(tangent, bankRad).normalize();
    const right = new THREE.Vector3().crossVectors(tangent, normal).normalize();

    samples.push({
      index: i,
      t: Number(u.toFixed(6)),
      sector: sector,
      position: [
        Number(pos.x.toFixed(5)),
        Number(pos.y.toFixed(5)),
        Number(pos.z.toFixed(5)),
      ],
      tangent: [
        Number(tangent.x.toFixed(5)),
        Number(tangent.y.toFixed(5)),
        Number(tangent.z.toFixed(5)),
      ],
      right: [
        Number(right.x.toFixed(5)),
        Number(right.y.toFixed(5)),
        Number(right.z.toFixed(5)),
      ],
      normal: [
        Number(normal.x.toFixed(5)),
        Number(normal.y.toFixed(5)),
        Number(normal.z.toFixed(5)),
      ],
      bank_deg: Number(bank_deg.toFixed(2)),
      arc_length_m: Number(arcLengths[i].toFixed(5)),
    });
  }

  return {
    id,
    name,
    description,
    is_closed_periodic_loop: true,
    track_width_m,
    curb_width_m,
    rail_height_m,
    total_length_m: Number(totalLength.toFixed(4)),
    scale_equivalent_length_m: Number((totalLength * 87).toFixed(1)),
    num_control_points: M,
    num_samples: N,
    start_index: Math.min(start_index, N - 1),
    sectors,
    control_points: controlPoints,
    samples,
    atmosphereSettings,
  };
}
