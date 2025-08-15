export function parseIdParam(id: string | string[] | undefined): string | null {
  if (!id) return null;
  const raw = Array.isArray(id) ? id[0] : id;
  const trimmed = `${raw}`.trim();
  if (!trimmed) return null;
  return trimmed;
}
