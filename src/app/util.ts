export function toPlural(text: string, count: number) {
  return `${text}${count === 1 ? '' : 's'}`;
}