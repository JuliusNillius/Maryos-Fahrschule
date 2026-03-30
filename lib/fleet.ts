export interface FleetVehicle {
  id: string;
  model: string;
  transmission: 'manual' | 'automatic';
  classes: string[];
  image: string;
}

export function mapFleetRow(row: { id: string; model: string; transmission: string; classes: string[]; image: string }): FleetVehicle {
  return {
    id: row.id,
    model: row.model ?? '',
    transmission: row.transmission === 'automatic' ? 'automatic' : 'manual',
    classes: Array.isArray(row.classes) ? row.classes : [],
    image: row.image ?? '',
  };
}

export const FLEET: FleetVehicle[] = [
  {
    id: 'golf-manual',
    model: 'VW Golf 8',
    transmission: 'manual',
    classes: ['B'],
    image: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=600&h=400&fit=crop',
  },
  {
    id: 'golf-auto',
    model: 'VW Golf 8',
    transmission: 'automatic',
    classes: ['B', 'BE'],
    image: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=600&h=400&fit=crop',
  },
  {
    id: 'audi-a3',
    model: 'Audi A3',
    transmission: 'manual',
    classes: ['B'],
    image: 'https://images.unsplash.com/photo-1614200179396-2bdb77ebf81b?w=600&h=400&fit=crop',
  },
  {
    id: 'honda-cb500',
    model: 'Honda CB500F',
    transmission: 'manual',
    classes: ['A2', 'A'],
    image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600&h=400&fit=crop',
  },
  {
    id: 'honda-cbf125',
    model: 'Honda CBF125',
    transmission: 'manual',
    classes: ['A1'],
    image: 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=600&h=400&fit=crop',
  },
  {
    id: 'peugeot-am',
    model: 'Peugeot 50ccm',
    transmission: 'manual',
    classes: ['AM'],
    image: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=600&h=400&fit=crop',
  },
];
