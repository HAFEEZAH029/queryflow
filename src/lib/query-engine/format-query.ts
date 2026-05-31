export function formatQuery(
  query: unknown,
) {
  return JSON.stringify(
    query,
    null,
    2,
  );
}