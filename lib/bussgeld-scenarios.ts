/**
 * Kuratierte Nicht-Tempo-Szenarien für Hinweise (MPU, Aufbauseminar).
 * Keine Rechtsberatung.
 */

export type ScenarioId =
  | 'alcohol_low'
  | 'alcohol_mid'
  | 'alcohol_high'
  | 'alcohol_refusal'
  | 'drugs';

export type ScenarioMeta = {
  id: ScenarioId;
  mpu: boolean;
  aufbau: boolean;
};

export const SCENARIOS: ScenarioMeta[] = [
  { id: 'alcohol_low', mpu: false, aufbau: true },
  { id: 'alcohol_mid', mpu: true, aufbau: true },
  { id: 'alcohol_high', mpu: true, aufbau: true },
  { id: 'alcohol_refusal', mpu: true, aufbau: false },
  { id: 'drugs', mpu: true, aufbau: false },
];
