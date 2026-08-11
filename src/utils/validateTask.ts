export function validateTask(text: string): boolean {
  return text.trim().length >= 3;
}