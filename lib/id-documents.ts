/** Ausweis-Upload: gleiche Regeln Client + API */
// WICHTIG: Auf Deployments (z. B. Vercel) kann multipart/form-data schnell an Plattform-Limits stoßen.
// 2 MB pro Seite ist ein guter Praxiswert (Fotos vorher komprimieren/als JPG exportieren).
export const ID_DOCUMENT_MAX_BYTES = 2 * 1024 * 1024;
export const ID_DOCUMENT_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;

export type IdDocumentMime = (typeof ID_DOCUMENT_MIME_TYPES)[number];

export function isAllowedIdMime(type: string): type is IdDocumentMime {
  return (ID_DOCUMENT_MIME_TYPES as readonly string[]).includes(type);
}

export function extensionForMime(mime: string): string {
  if (mime === 'image/png') return 'png';
  if (mime === 'image/webp') return 'webp';
  return 'jpg';
}

export function validateIdFile(file: File): string | null {
  if (!file.size) return 'empty';
  if (file.size > ID_DOCUMENT_MAX_BYTES) return 'size';
  if (!isAllowedIdMime(file.type)) return 'mime';
  return null;
}
