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
    classes: ['B', 'BF17'],
    image: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=600&h=400&fit=crop',
  },
  {
    id: 'golf-auto',
    model: 'VW Golf 8',
    transmission: 'automatic',
    classes: ['B', 'BF17'],
    image: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=600&h=400&fit=crop',
  },
  {
    id: 'audi-a3',
    model: 'Audi A3',
    transmission: 'manual',
    classes: ['B', 'BF17'],
    image: 'https://images.unsplash.com/photo-1614200179396-2bdb77ebf81b?w=600&h=400&fit=crop',
  },
];
