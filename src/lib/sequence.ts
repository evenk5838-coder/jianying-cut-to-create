// Absolute scroll positions; the original opening keeps its original scroll distance.
export const END = 6.65;
export const clamp = (v: number) => Math.max(0, Math.min(1, v));
export const ramp = (v: number, a: number, b: number) =>
  clamp((v - a) / (b - a));
export const spans = (mobile: boolean) =>
  mobile
    ? [632 / 6.65, 200, 200, 200, 200, 200, 100]
    : [865 / 6.65, 240, 240, 240, 240, 240, 150];
export const totalSpan = (mobile: boolean) =>
  spans(mobile).reduce((a, b) => a + b, 0);
export const journeyHeight = (mobile: boolean) => 100 + totalSpan(mobile);
export function scrollClock(progress: number, mobile: boolean) {
  let d = clamp(progress) * totalSpan(mobile);
  const list = spans(mobile);
  for (let i = 0; i < 7; i++) {
    if (d <= list[i] || i === 6)
      return i + (d / list[i]) * (i === 6 ? 0.65 : 1);
    d -= list[i];
  }
  return END;
}
export function clockProgress(x: number, mobile: boolean) {
  const list = spans(mobile),
    i = Math.min(6, Math.floor(x));
  return (
    (list.slice(0, i).reduce((a, b) => a + b, 0) +
      ((x - i) / (i === 6 ? 0.65 : 1)) * list[i]) /
    totalSpan(mobile)
  );
}
export function sequence(x: number) {
  const from = Math.min(6, Math.floor(x)),
    local = x - from,
    mix = from === 6 ? 0 : ramp(local, from === 0 ? 0.32 : 0.8, 0.98);
  return {
    from,
    local,
    mix,
    current: mix >= 0.5 ? Math.min(6, from + 1) : from,
    to: Math.min(6, from + 1),
  };
}
export function copyOpacity(x: number, i: number) {
  const local = x - i;
  return (
    (i === 0 ? 1 : ramp(local, 0.025, 0.13)) *
    (i === 6
      ? 1
      : 1 - ramp(local, i === 0 ? 0.04 : 0.68, i === 0 ? 0.24 : 0.78))
  );
}
export function textPhase(
  x: number,
  i: number,
  phase: "description" | "benefit" | "actions",
) {
  if (i === 0 || i === 6) return 1;
  const local = x - i;
  const [a, b] =
    phase === "description"
      ? [0.15, 0.24]
      : phase === "benefit"
        ? [0.26, 0.34]
        : [0.38, 0.46];
  return ramp(local, a, b);
}
