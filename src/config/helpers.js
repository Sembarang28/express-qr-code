const TARGET_LATITUDE = -5.036202194922914;
const TARGET_LONGITUDE = 119.57160283048552;

function haversineFormula(lat, lon) {
  const R = 6371e3; // metres
  const φ1 = (TARGET_LATITUDE * Math.PI) / 180; // φ, λ in radians
  const φ2 = (lat * Math.PI) / 180;
  const Δφ = ((lat - TARGET_LATITUDE) * Math.PI) / 180;
  const Δλ = ((lon - TARGET_LONGITUDE) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const d = R * c; // in metres
  return d;
}

module.exports = haversineFormula;
