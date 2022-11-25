export function clamp(num, min, max) {
  return Math.min(Math.max(num, min), max);
}

export function guassianRandom(mean, stdDev) {
  let u = 1 - Math.random(); //Converting [0,1) to (0,1)
  let v = Math.random();
  let randStdNormal =
    Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  return mean + randStdNormal * stdDev;
}

export function clampedGuassian(mean, stdDev, min, max) {
  return clamp(guassianRandom(mean, stdDev), min, max);
}
