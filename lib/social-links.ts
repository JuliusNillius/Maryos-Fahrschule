/** Einheitliche Social-URLs: Backoffice-Werte oder sinnvolle www-Defaults (keine leeren Profile). */
export type SocialLinks = {
  instagram?: string;
  tiktok?: string;
  facebook?: string;
  youtube?: string;
};

const FALLBACK: Record<keyof SocialLinks, string> = {
  instagram: 'https://www.instagram.com/',
  tiktok: 'https://www.tiktok.com/',
  facebook: 'https://www.facebook.com/',
  youtube: 'https://www.youtube.com/',
};

export function socialHref(kind: keyof SocialLinks, social?: SocialLinks | null): string {
  const raw = social?.[kind]?.trim();
  return raw && raw.length > 0 ? raw : FALLBACK[kind];
}
