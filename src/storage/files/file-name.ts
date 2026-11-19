// Nombre de archivo seguro a partir de un título: sin acentos, minúsculas y con guiones.
export function fileSlug(text: string, fallback = 'documento'): string {
  const slug = text
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return slug.slice(0, 60) || fallback;
}
