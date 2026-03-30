import { NextRequest, NextResponse } from 'next/server';

/**
 * Adress-Vorschläge via Photon (OpenStreetMap, kostenlos).
 * GET /api/address-suggestions?q=41063+Mönchengladbach+Viersener
 * Liefert Straße, PLZ, Ort für Autocomplete.
 */
const PHOTON_URL = 'https://photon.komoot.io/api/';

type AddressSuggestion = {
  street: string;
  zip: string;
  city: string;
  label: string;
};

function parseFeature(f: { properties?: Record<string, unknown> }): AddressSuggestion | null {
  const p = f.properties ?? {};
  const streetName = (p.street as string) ?? '';
  const houseNumber = (p.housenumber as string) ?? '';
  const postcode = (p.postcode as string) ?? '';
  const city =
    (p.city as string) ??
    (p.town as string) ??
    (p.village as string) ??
    (p.municipality as string) ??
    (p.locality as string) ??
    '';

  // Nur Einträge mit mindestens Straße oder Ort + PLZ
  const hasAddress = (streetName && city) || (postcode && city) || (streetName && postcode);
  if (!hasAddress) return null;

  const street = [streetName, houseNumber].filter(Boolean).join(' ').trim() || streetName || houseNumber;
  const zip = postcode;
  const label = [street, postcode, city].filter(Boolean).join(', ');

  return { street, zip, city, label };
}

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q')?.trim();
  if (!q || q.length < 2) {
    return NextResponse.json([]);
  }

  const limit = Math.min(Number(request.nextUrl.searchParams.get('limit')) || 8, 15);
  const url = new URL(PHOTON_URL);
  url.searchParams.set('q', q);
  url.searchParams.set('limit', String(limit));
  url.searchParams.set('lang', 'de');
  // Ortsbias: Mönchengladbach, bessere Treffer für die Region
  url.searchParams.set('lat', '51.18');
  url.searchParams.set('lon', '6.44');
  url.searchParams.set('location_bias_scale', '2');

  try {
    const res = await fetch(url.toString(), {
      headers: { Accept: 'application/json' },
      next: { revalidate: 0 },
    });
    if (!res.ok) return NextResponse.json([]);

    const data = (await res.json()) as { features?: unknown[] };
    const features = Array.isArray(data.features) ? data.features : [];
    const suggestions: AddressSuggestion[] = [];
    const seen = new Set<string>();

    for (const f of features) {
      const parsed = parseFeature(f as { properties?: Record<string, unknown> });
      if (!parsed || seen.has(parsed.label)) continue;
      seen.add(parsed.label);
      suggestions.push(parsed);
      if (suggestions.length >= limit) break;
    }

    return NextResponse.json(suggestions);
  } catch {
    return NextResponse.json([]);
  }
}
