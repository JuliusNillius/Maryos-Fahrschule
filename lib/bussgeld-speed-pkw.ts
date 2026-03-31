/**
 * PKW-Geschwindigkeitsüberschreitung nach Bußgeldkatalog (Anlage zur BKat / VwV-StVO).
 * Zuletzt gegen öffentliche Tabellen abgeglichen (u. a. bussgeldkatalog.org, Portal Dez. 2025 / Struktur 2026).
 * Autobahn (beschildert): für PKW dieselben Staffeln wie „außerhalb geschlossener Ortschaften“.
 *
 * Bei künftigen BKat-Anpassungen: DATA_AS_OF und Staffeln hier aktualisieren.
 * Keine Rechtsberatung — nur technische Orientierung für UI-Rechner.
 */

export type SpeedZone = 'inner' | 'outer' | 'motorway';

export type SpeedTierRow = {
  minExcess: number;
  maxExcess: number;
  fineEur: number;
  points: number;
  /** Monate Fahrverbot; null = keins laut Tabelle */
  banMonths: number | null;
  /** Häufig nur bei Wiederholung / Einzelfall anders */
  banConditional?: boolean;
};

/** Innerorts — PKW */
const INNER: SpeedTierRow[] = [
  { minExcess: 1, maxExcess: 10, fineEur: 30, points: 0, banMonths: null },
  { minExcess: 11, maxExcess: 15, fineEur: 50, points: 0, banMonths: null },
  { minExcess: 16, maxExcess: 20, fineEur: 70, points: 0, banMonths: null },
  { minExcess: 21, maxExcess: 25, fineEur: 115, points: 1, banMonths: null },
  { minExcess: 26, maxExcess: 30, fineEur: 180, points: 1, banMonths: 1, banConditional: true },
  { minExcess: 31, maxExcess: 40, fineEur: 260, points: 2, banMonths: 1 },
  { minExcess: 41, maxExcess: 50, fineEur: 400, points: 2, banMonths: 1 },
  { minExcess: 51, maxExcess: 60, fineEur: 560, points: 2, banMonths: 2 },
  { minExcess: 61, maxExcess: 70, fineEur: 700, points: 2, banMonths: 3 },
  { minExcess: 71, maxExcess: 999, fineEur: 800, points: 2, banMonths: 3 },
];

/** Außerorts / Autobahn (PKW, ohne Anhänger) */
const OUTER: SpeedTierRow[] = [
  { minExcess: 1, maxExcess: 10, fineEur: 20, points: 0, banMonths: null },
  { minExcess: 11, maxExcess: 15, fineEur: 40, points: 0, banMonths: null },
  { minExcess: 16, maxExcess: 20, fineEur: 60, points: 0, banMonths: null },
  { minExcess: 21, maxExcess: 25, fineEur: 100, points: 1, banMonths: null },
  { minExcess: 26, maxExcess: 30, fineEur: 150, points: 1, banMonths: 1, banConditional: true },
  { minExcess: 31, maxExcess: 40, fineEur: 200, points: 1, banMonths: 1, banConditional: true },
  { minExcess: 41, maxExcess: 50, fineEur: 320, points: 2, banMonths: 1 },
  { minExcess: 51, maxExcess: 60, fineEur: 480, points: 2, banMonths: 1 },
  { minExcess: 61, maxExcess: 70, fineEur: 600, points: 2, banMonths: 2 },
  { minExcess: 71, maxExcess: 999, fineEur: 700, points: 2, banMonths: 3 },
];

const TABLES: Record<SpeedZone, SpeedTierRow[]> = {
  inner: INNER,
  outer: OUTER,
  motorway: OUTER,
};

/** Üblicher Mess-Toleranzabzug (Annäherung; Messgerät/Behörde kann abweichen). */
export function toleranceDeductionKmh(measuredKmh: number): number {
  if (measuredKmh <= 0) return 0;
  if (measuredKmh <= 100) return 3;
  return Math.round(measuredKmh * 0.03 * 10) / 10;
}

export function speedAfterTolerance(measuredKmh: number): number {
  return Math.max(0, measuredKmh - toleranceDeductionKmh(measuredKmh));
}

/**
 * Überschreitung in km/h (ganzzahlig abgerundet).
 * Wenn applyTolerance false: gemessene Geschwindigkeit ohne Abzug.
 */
export function computeExcessKmH(params: {
  limitKmh: number;
  measuredKmh: number;
  applyTolerance: boolean;
}): number {
  const { limitKmh, measuredKmh, applyTolerance } = params;
  const v = applyTolerance ? speedAfterTolerance(measuredKmh) : measuredKmh;
  const raw = v - limitKmh;
  return raw > 0 ? Math.floor(raw) : 0;
}

export function lookupSpeedFine(zone: SpeedZone, excessKmH: number): SpeedTierRow | null {
  if (excessKmH < 1) return null;
  const table = TABLES[zone];
  const row = table.find((r) => excessKmH >= r.minExcess && excessKmH <= r.maxExcess);
  return row ?? null;
}

export const BKAT_REFERENCE_LABEL = 'Anlage (BKat) zu § 1 OWiG i. V. m. § 3 StVO';
/** Anzeige im UI; bei BKat-Update Datum und ggf. Beträge anpassen. */
export const DATA_AS_OF = '2026-03';
