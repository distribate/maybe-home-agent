export function invariant<T>(
  value: T | null | undefined,
  message?: string
): T {
  if (value === null || value === undefined) {
    throw new Error(message ?? `Invariant failed: ${String(value)} is not defined`);
  }
  return value;
}