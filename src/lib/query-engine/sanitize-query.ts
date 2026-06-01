export function sanitizeValue(value: unknown): unknown {
  if (typeof value === "string") {
    return value.replace(/[<>]/g, "").trim();
  }

  if (Array.isArray(value)) {
    return value.map((item) => sanitizeValue(item));
  }

  return value;
}