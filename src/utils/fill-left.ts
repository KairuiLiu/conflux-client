export function fillLeft(v: string, len: number) {
  if (v.length >= len) return v;
  return '0'.repeat(len - v.length) + v;
}
