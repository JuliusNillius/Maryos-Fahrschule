export interface FleetVehicle {
  id: string;
  model: string;
  transmission: 'manual' | 'automatic';
  classes: string[];
  image: string;
  /** PS, optional */
  powerPs?: number | null;
  hasDriverAssistance?: boolean;
  hasAppleCarplay?: boolean;
  /** Freitext für Steckbrief */
  steckbriefNotes?: string | null;
}

export function mapFleetRow(row: {
  id: string;
  model: string;
  transmission: string;
  classes: string[];
  image: string;
  power_ps?: number | string | null;
  has_driver_assistance?: boolean | null;
  has_apple_carplay?: boolean | null;
  steckbrief_notes?: string | null;
}): FleetVehicle {
  const notes = row.steckbrief_notes?.trim();
  return {
    id: row.id,
    model: row.model ?? '',
    transmission: row.transmission === 'automatic' ? 'automatic' : 'manual',
    classes: Array.isArray(row.classes) ? row.classes : [],
    image: row.image ?? '',
    powerPs: (() => {
      const n = row.power_ps;
      if (n == null || n === '') return null;
      if (typeof n === 'string' && n.trim() === '') return null;
      const x = typeof n === 'number' ? n : Number(n);
      return Number.isFinite(x) ? x : null;
    })(),
    hasDriverAssistance: !!row.has_driver_assistance,
    hasAppleCarplay: !!row.has_apple_carplay,
    steckbriefNotes: notes && notes.length > 0 ? notes : null,
  };
}

export const FLEET: FleetVehicle[] = [
  {
    id: 'golf-manual',
    model: 'VW Golf 8',
    transmission: 'manual',
    classes: ['B', 'BF17'],
    image: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=600&h=400&fit=crop',
    powerPs: 150,
    hasDriverAssistance: true,
    hasAppleCarplay: true,
    steckbriefNotes: 'Beispiel — Werte im Live-Betrieb im Backoffice pflegen.',
  },
  {
    id: 'golf-auto',
    model: 'VW Golf 8',
    transmission: 'automatic',
    classes: ['B', 'BF17'],
    image: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=600&h=400&fit=crop',
    powerPs: 150,
    hasDriverAssistance: true,
    hasAppleCarplay: true,
  },
  {
    id: 'audi-a3',
    model: 'Audi A3',
    transmission: 'manual',
    classes: ['B', 'BF17'],
    image: 'https://images.unsplash.com/photo-1614200179396-2bdb77ebf81b?w=600&h=400&fit=crop',
    powerPs: 110,
    hasDriverAssistance: false,
    hasAppleCarplay: true,
  },
];
