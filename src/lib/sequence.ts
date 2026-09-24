// One deterministic clock for forward/backward scrolling. No triggered entrance loops.
export const END = 6.65;
export const clamp = (v: number) => Math.max(0, Math.min(1, v));
export const ramp = (v: number, a: number, b: number) =>
  clamp((v - a) / (b - a));
export function sequence(x: number) {
  const from = Math.min(6, Math.floor(x));
  const local = x - from;
  const mix = from === 6 ? 0 : ramp(local, from === 0 ? 0.32 : 0.72, 0.98);
  const current = mix >= 0.5 ? Math.min(6, from + 1) : from;
  return { from, local, mix, current, to: Math.min(6, from + 1) };
}
export function copyOpacity(x: number, i: number) {
  const local = x - i;
  const enter = i === 0 ? 1 : ramp(local, 0.025, 0.16);
  const leave =
    i === 6 ? 1 : 1 - ramp(local, i === 0 ? 0.04 : 0.52, i === 0 ? 0.24 : 0.68);
  return enter * leave;
}
