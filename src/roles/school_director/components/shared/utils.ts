export function capitalize(s?: string) {
  if (!s) return '';
  return s
    .split(/\s|_|\./)
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(' ');
}


