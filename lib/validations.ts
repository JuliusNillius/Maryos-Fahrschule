import { z } from 'zod';

/** PKW: B, BF17, B197, BE */
const LICENCE_CLASSES = ['B', 'BF17', 'B197', 'BE'] as const;
/** Unterrichts- / Kommunikationssprachen (Website & Anmeldung: DE, TR, AR) */
const LANGUAGES = ['de', 'ar', 'tr'] as const;
const TIME_SLOTS = ['morning', 'noon', 'afternoon', 'evening'] as const;
const SOURCES = ['google', 'instagram', 'tiktok', 'recommendation', 'walkby', 'other'] as const;
const OFFER_TYPES = ['standard', 'bundle_10_promo'] as const;

export const registrationStep1Schema = z.object({
  firstName: z.string().min(1, 'Vorname erforderlich'),
  lastName: z.string().min(1, 'Nachname erforderlich'),
  email: z.string().email('Ungültige E-Mail'),
  phone: z.string().min(1, 'Telefon erforderlich'),
  birthDate: z.string().min(1, 'Geburtsdatum erforderlich'),
  street: z.string().optional(),
  zip: z.string().optional(),
  city: z.string().optional(),
  motherTongue: z.enum(LANGUAGES),
  referrerCode: z.string().max(20).optional().or(z.literal('')),
});

export const registrationStep2Schema = z.object({
  licenceClass: z.enum(LICENCE_CLASSES),
  offerType: z.enum(OFFER_TYPES).default('standard'),
  transmission: z.enum(['manual', 'automatic']).optional(),
  instructorId: z.string().optional(),
  lessonLanguage: z.enum(LANGUAGES),
  hasLicence: z.boolean().default(false),
  existingLicenceClass: z.string().optional(),
  existingLicenceCountry: z.string().optional(),
  bf17: z.boolean().default(false),
  timeSlots: z.array(z.enum(TIME_SLOTS)).optional(),
  source: z.enum(SOURCES).optional(),
});

export const registrationStep3Schema = z.object({
  acceptTerms: z.boolean().refine((v) => v === true, 'AGB müssen akzeptiert werden'),
  acceptPrivacy: z.boolean().refine((v) => v === true, 'Datenschutz muss akzeptiert werden'),
});

export type RegistrationStep1 = z.infer<typeof registrationStep1Schema>;
export type RegistrationStep2 = z.infer<typeof registrationStep2Schema>;
export type RegistrationStep3 = z.infer<typeof registrationStep3Schema>;

export type RegistrationFormData = RegistrationStep1 & RegistrationStep2 & RegistrationStep3;

/** Booking-Calendar: Terminanfrage */
export const bookingRequestSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Datum YYYY-MM-DD'),
  time: z.string().min(1, 'Uhrzeit erforderlich'),
  name: z.string().max(200).optional(),
  email: z.string().email().max(320).optional(),
  phone: z.string().max(50).optional(),
});
export type BookingRequest = z.infer<typeof bookingRequestSchema>;
