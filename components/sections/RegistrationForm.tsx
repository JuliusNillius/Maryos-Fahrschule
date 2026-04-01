'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { registrationStep1Schema, registrationStep2Schema, registrationStep3Schema } from '@/lib/validations';
import type { RegistrationStep1, RegistrationStep2, RegistrationStep3 } from '@/lib/validations';
import { getRegistrationClass, getRegistrationInstructor } from '@/lib/registration';
import type { Instructor } from '@/lib/instructors';
import { Link } from '@/i18n/navigation';
import AddressAutocomplete from '@/components/AddressAutocomplete';
import {
  getOfferCheckout,
  PRICING_APP_EUR,
  PRICING_LESSON_HOUR_EUR,
  PRICING_REGISTRATION_EUR,
  type OfferType,
} from '@/lib/pricing';
import { validateIdFile } from '@/lib/id-documents';

const stripePromise = typeof window !== 'undefined' && process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null;

function Step3PayButton({
  formData,
  validate,
  onBack,
  checkoutTotal,
  registrationId,
  t,
}: {
  formData: FormData;
  validate: () => boolean;
  onBack: () => void;
  checkoutTotal: number;
  registrationId: string | null;
  t: (key: string, values?: Record<string, string | number>) => string;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);

  const handlePay = async () => {
    if (!validate()) return;
    if (!stripe || !elements) return;
    if (!registrationId) {
      setPayError(t('paymentSessionStale'));
      return;
    }
    setPayError(null);
    setLoading(true);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(PENDING_PAYMENT_KEY, JSON.stringify(formData));
      sessionStorage.setItem(PENDING_REGISTRATION_ID_KEY, registrationId);
    }
    const returnUrl =
      typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}` : '';
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: returnUrl },
    });
    setLoading(false);
    if (error) {
      setPayError(error.message ?? 'Payment failed');
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem(PENDING_PAYMENT_KEY);
        sessionStorage.removeItem(PENDING_REGISTRATION_ID_KEY);
      }
    }
  };

  return (
    <>
      {payError && <p className="text-sm text-red-500">{payError}</p>}
      <div className="flex gap-4">
        <button type="button" onClick={onBack} className="btn-ghost" data-testid="registration-step3-back">
          ← {t('back')}
        </button>
        <button
          type="button"
          onClick={handlePay}
          disabled={!stripe || !elements || loading}
          className="btn-primary flex-1"
          data-cta
          data-testid="registration-step3-pay"
        >
          🏁 {loading ? '…' : t('submitPay', { total: checkoutTotal })}
        </button>
      </div>
    </>
  );
}

function IdUploadSlot({
  label,
  dropLabel,
  clearLabel,
  file,
  onPick,
}: {
  label: string;
  dropLabel: string;
  clearLabel: string;
  file: File | null;
  onPick: (f: File | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    onPick(f);
    e.target.value = '';
  };
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) onPick(f);
  };
  return (
    <div
      className={`rounded-xl border border-dashed border-white/25 bg-surface2/50 p-4 transition-colors hover:border-green-primary/40 ${file ? 'border-green-primary/40' : ''}`}
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDrop}
    >
      <p className="mb-2 font-body text-sm font-medium text-white">{label}</p>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        onChange={onChange}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="w-full rounded-lg border border-white/15 bg-surface2 px-4 py-3 text-left font-body text-sm text-text-muted hover:border-green-primary/40 hover:text-white"
      >
        {file ? <span className="text-white">{file.name}</span> : dropLabel}
      </button>
      {file && (
        <button type="button" className="mt-2 font-body text-xs text-red-400 underline hover:text-red-300" onClick={() => onPick(null)}>
          {clearLabel}
        </button>
      )}
    </div>
  );
}

const LICENCE_CLASSES = ['B', 'BF17', 'B197', 'BE'] as const;
const LANGUAGES = [
  { value: 'de', label: 'Deutsch' },
  { value: 'ar', label: 'Arabisch' },
  { value: 'tr', label: 'Türkisch' },
];
const TIME_PILLS = [
  { value: 'morning', labelKey: 'timeMorning' as const },
  { value: 'noon', labelKey: 'timeNoon' as const },
  { value: 'afternoon', labelKey: 'timeAfternoon' as const },
  { value: 'evening', labelKey: 'timeEvening' as const },
];
const SOURCES = [
  { value: 'google', labelKey: 'sourceGoogle' as const },
  { value: 'instagram', labelKey: 'sourceInstagram' as const },
  { value: 'tiktok', labelKey: 'sourceTiktok' as const },
  { value: 'recommendation', labelKey: 'sourceRecommendation' as const },
  { value: 'walkby', labelKey: 'sourceWalkby' as const },
  { value: 'other', labelKey: 'sourceOther' as const },
];

type FormData = RegistrationStep1 & RegistrationStep2 & RegistrationStep3;
type TimeSlot = 'morning' | 'noon' | 'afternoon' | 'evening';

const STORAGE_KEY = 'maryos-registration-draft';
const PENDING_PAYMENT_KEY = 'maryos-payment-pending';
const PENDING_REGISTRATION_ID_KEY = 'maryos-payment-registration-id';

type RegistrationFormProps = { instructors?: Instructor[]; initialRefCode?: string };

export default function RegistrationForm({ instructors = [], initialRefCode = '' }: RegistrationFormProps) {
  const list = instructors?.length ? instructors : [];
  const t = useTranslations('registration');
  const [step, setStep] = useState(1);
  const [success, setSuccess] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentRegistrationId, setPaymentRegistrationId] = useState<string | null>(null);
  const [stripeError, setStripeError] = useState<string | null>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const defaultClass = typeof window !== 'undefined' ? getRegistrationClass() : null;
  const defaultInstructor = typeof window !== 'undefined' ? getRegistrationInstructor() : null;

  const [myReferralCode, setMyReferralCode] = useState<string | null>(null);
  const [idFrontFile, setIdFrontFile] = useState<File | null>(null);
  const [idBackFile, setIdBackFile] = useState<File | null>(null);
  const [idDocErr, setIdDocErr] = useState<string | null>(null);

  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      motherTongue: 'de',
      licenceClass: (defaultClass as FormData['licenceClass']) ?? 'B',
      transmission: 'manual',
      lessonLanguage: 'de',
      hasLicence: false,
      bf17: false,
      timeSlots: [],
      source: 'google',
      offerType: 'standard' as OfferType,
      referrerCode: initialRefCode,
      acceptTerms: false,
      acceptPrivacy: false,
    },
  });

  const licenceClass = watch('licenceClass');
  const motherTongue = watch('motherTongue');
  const offerType = (watch('offerType') ?? 'standard') as OfferType;
  const checkout = getOfferCheckout(offerType);

  useEffect(() => {
    setValue('lessonLanguage', motherTongue as FormData['lessonLanguage']);
  }, [motherTongue, setValue]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved) as Partial<FormData>;
        Object.entries(data).forEach(([key, value]) => {
          if (value !== undefined) setValue(key as keyof FormData, value);
        });
      } catch {
        // ignore
      }
    }
    if (initialRefCode.trim()) setValue('referrerCode', initialRefCode.trim());
  }, [setValue, initialRefCode]);

  useEffect(() => {
    if (defaultClass) {
      if (defaultClass === 'BF17' || defaultClass === 'bf17') {
        setValue('licenceClass', 'BF17');
        setValue('bf17', true);
      } else if (defaultClass === 'B197' || defaultClass === 'b197') {
        setValue('licenceClass', 'B197');
        setValue('bf17', false);
      } else if (defaultClass === 'BE' || defaultClass === 'be') {
        setValue('licenceClass', 'BE');
        setValue('bf17', false);
      } else if (defaultClass === 'B' || defaultClass === 'b') {
        setValue('licenceClass', 'B');
        setValue('bf17', false);
      }
    }
  }, [defaultClass, setValue]);

  useEffect(() => {
    if (defaultInstructor) setValue('instructorId', defaultInstructor);
  }, [defaultInstructor, setValue]);

  // Nach Stripe-Redirect: PaymentIntent serverseitig prüfen (nicht ?payment=success allein)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const piId = params.get('payment_intent');
    if (!piId) return;

    let cancelled = false;

    (async () => {
      const pending = sessionStorage.getItem(PENDING_PAYMENT_KEY);
      const regIdStored = sessionStorage.getItem(PENDING_REGISTRATION_ID_KEY);
      const pathOnly = window.location.pathname + (window.location.hash || '');

      const cleanupUrl = () => {
        if (!cancelled) window.history.replaceState({}, '', pathOnly);
      };

      if (!pending || !regIdStored) {
        cleanupUrl();
        return;
      }

      let data: FormData;
      try {
        data = JSON.parse(pending) as FormData;
      } catch {
        sessionStorage.removeItem(PENDING_PAYMENT_KEY);
        sessionStorage.removeItem(PENDING_REGISTRATION_ID_KEY);
        cleanupUrl();
        return;
      }

      try {
        const res = await fetch('/api/stripe/verify-return', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paymentIntentId: piId }),
        });
        const json = (await res.json()) as {
          ok?: boolean;
          registrationId?: string;
          email?: string;
        };
        if (cancelled) return;
        if (!res.ok || !json.ok || !json.registrationId) {
          sessionStorage.removeItem(PENDING_PAYMENT_KEY);
          sessionStorage.removeItem(PENDING_REGISTRATION_ID_KEY);
          cleanupUrl();
          return;
        }
        if (json.registrationId !== regIdStored) {
          sessionStorage.removeItem(PENDING_PAYMENT_KEY);
          sessionStorage.removeItem(PENDING_REGISTRATION_ID_KEY);
          cleanupUrl();
          return;
        }
        const pendingEmail = (data.email ?? '').trim().toLowerCase();
        if (json.email && pendingEmail && json.email !== pendingEmail) {
          sessionStorage.removeItem(PENDING_PAYMENT_KEY);
          sessionStorage.removeItem(PENDING_REGISTRATION_ID_KEY);
          cleanupUrl();
          return;
        }

        const codeStored = sessionStorage.getItem('maryos-my-referral-code');
        if (codeStored) setMyReferralCode(codeStored);
        sendConfirmationEmail(data);
        sessionStorage.removeItem(PENDING_PAYMENT_KEY);
        sessionStorage.removeItem(PENDING_REGISTRATION_ID_KEY);
        sessionStorage.removeItem(STORAGE_KEY);
        sessionStorage.removeItem('maryos-my-referral-code');
        setSuccess(true);
        cleanupUrl();
      } catch {
        if (!cancelled) {
          sessionStorage.removeItem(PENDING_PAYMENT_KEY);
          sessionStorage.removeItem(PENDING_REGISTRATION_ID_KEY);
          cleanupUrl();
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // PaymentIntent erstellen, sobald Schritt 3 erreicht wird (nur einmal)
  // ClientSecret wird erst nach "Zahlung starten" geholt (mit Registration-ID für Webhook)
  const startPayment = async () => {
    const data = watch();
    const result = registrationStep3Schema.safeParse(data);
    if (!result.success) return;
    setStripeError(null);
    try {
      const regRes = await fetch('/api/registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          birthDate: data.birthDate,
          street: data.street,
          zip: data.zip,
          city: data.city,
          motherTongue: data.motherTongue,
          referrerCode: data.referrerCode ?? '',
          licenceClass: data.licenceClass,
          offerType: data.offerType,
          transmission: data.transmission,
          instructorId: data.instructorId,
          lessonLanguage: data.lessonLanguage,
          hasLicence: data.hasLicence,
          existingLicenceClass: data.existingLicenceClass,
          existingLicenceCountry: data.existingLicenceCountry,
          bf17: data.licenceClass === 'BF17',
          timeSlots: data.timeSlots,
          source: data.source,
        }),
      });
      const regJson = await regRes.json();
      if (!regRes.ok || !regJson.id) {
        setStripeError('Anmeldung konnte nicht gespeichert werden.');
        return;
      }
      if (!idFrontFile || !idBackFile) {
        setStripeError(t('idDocRequired'));
        return;
      }
      const docFd = new FormData();
      docFd.append('registrationId', regJson.id);
      docFd.append('email', data.email);
      docFd.append('front', idFrontFile);
      docFd.append('back', idBackFile);
      const docRes = await fetch('/api/registration/upload-id', { method: 'POST', body: docFd });
      const docJson = await docRes.json().catch(() => ({}));
      if (!docRes.ok) {
        setStripeError(typeof docJson.error === 'string' ? docJson.error : 'Ausweis-Upload fehlgeschlagen.');
        return;
      }
      if (regJson.myReferralCode && typeof window !== 'undefined') {
        sessionStorage.setItem('maryos-my-referral-code', regJson.myReferralCode);
      }
      const stripeRes = await fetch('/api/stripe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email, licenceClass: data.licenceClass, registrationId: regJson.id }),
      });
      const stripeJson = await stripeRes.json();
      if (stripeJson.error) setStripeError(stripeJson.error);
      else if (stripeJson.clientSecret) {
        setClientSecret(stripeJson.clientSecret);
        setPaymentRegistrationId(regJson.id);
      }
    } catch {
      setStripeError('Zahlung derzeit nicht verfügbar.');
    }
  };

  useEffect(() => {
    if (step !== 3) {
      setClientSecret(null);
      setPaymentRegistrationId(null);
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem(PENDING_REGISTRATION_ID_KEY);
      }
    }
  }, [step]);

  useEffect(() => {
    if (progressRef.current) {
      progressRef.current.style.width = `${(step / 3) * 100}%`;
    }
  }, [step]);

  const saveDraft = (data: Partial<FormData>) => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  };

  const idDocErrorMessage = (code: string | null) => {
    if (!code) return null;
    if (code === 'required') return t('idDocRequired');
    if (code === 'empty') return t('idDocErrorEmpty');
    if (code === 'size') return t('idDocErrorSize');
    if (code === 'mime') return t('idDocErrorMime');
    return code;
  };

  const onStep1Next = () => {
    const data = watch();
    const result = registrationStep1Schema.safeParse(data);
    if (!result.success) return;
    if (!idFrontFile || !idBackFile) {
      setIdDocErr('required');
      return;
    }
    for (const f of [idFrontFile, idBackFile]) {
      const err = validateIdFile(f);
      if (err) {
        setIdDocErr(err);
        return;
      }
    }
    setIdDocErr(null);
    saveDraft(data);
    setStep(2);
  };

  const onStep2Next = () => {
    const data = watch();
    const result = registrationStep2Schema.safeParse(data);
    if (!result.success) return;
    saveDraft(data);
    setStep(3);
  };

  async function sendConfirmationEmail(data: FormData) {
    try {
      await fetch('/api/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: data.email,
          firstName: data.firstName,
          licenceClass: data.licenceClass,
        }),
      });
    } catch {
      // ignore
    }
  }

  const inputClass =
    'w-full rounded-lg border border-white/10 bg-surface2 px-4 py-3 font-body text-white placeholder:text-text-muted focus:border-green-primary focus:outline-none focus:ring-2 focus:ring-green-primary/30';

  if (success) {
    return (
      <section id="anmelden" className="section-divider scroll-mt-20 bg-bg py-20 md:py-28">
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
          <div className="relative z-10 max-w-md px-6 text-center">
            <span className="text-6xl" aria-hidden>🏁</span>
            <h2 className="mt-6 font-heading text-2xl font-bold italic uppercase text-white sm:text-3xl">
              {t('successTitle')}
            </h2>
            <p className="mt-4 font-body text-text-muted">{t('successMessage')}</p>
            {myReferralCode && (
              <div className="mt-6 rounded-xl border border-green-500/30 bg-green-500/10 p-4">
                <p className="font-body text-sm text-text-muted">{t('yourReferralCode')}</p>
                <p className="mt-2 font-mono text-xl font-bold tracking-wider text-green-400">{myReferralCode}</p>
                <p className="mt-2 text-xs text-text-muted">{t('referralCodeSuccessHint')}</p>
              </div>
            )}
            <Link href="/" className="btn-primary mt-8" data-testid="registration-success-home">
              {t('successCta')}
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="anmelden"
      className="section-divider scroll-mt-20 bg-bg py-20 md:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-4 text-center font-heading text-3xl font-bold italic uppercase tracking-tight text-white sm:text-4xl">
          {t('heading')}
        </h2>
        <div className="mx-auto mb-10 h-1.5 max-w-md overflow-hidden rounded-full bg-surface2">
          <div
            ref={progressRef}
            className="h-full w-0 rounded-full bg-green-primary transition-all duration-500 ease-out"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        <form
          className="lg:flex lg:gap-12"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <div className="lg:w-[60%]">
            {step === 1 && (
              <div className="space-y-6">
                <h3 className="font-heading text-lg font-bold italic uppercase text-green-primary">
                  {t('step1Title')}
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block font-body text-sm text-text-muted">{t('firstName')} *</label>
                    <input {...register('firstName')} className={inputClass} />
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-red-500">{errors.firstName.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="mb-1 block font-body text-sm text-text-muted">{t('lastName')} *</label>
                    <input {...register('lastName')} className={inputClass} />
                    {errors.lastName && <p className="mt-1 text-sm text-red-500">{errors.lastName.message}</p>}
                  </div>
                </div>
                <div>
                  <label className="mb-1 block font-body text-sm text-text-muted">{t('email')} *</label>
                  <input type="email" {...register('email')} className={inputClass} />
                  {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
                </div>
                <div>
                  <label className="mb-1 block font-body text-sm text-text-muted">{t('phone')} *</label>
                  <input type="tel" {...register('phone')} className={inputClass} />
                  {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>}
                </div>
                <div>
                  <label className="mb-1 block font-body text-sm text-text-muted">{t('birthDate')} *</label>
                  <input type="date" {...register('birthDate')} className={inputClass} />
                  {errors.birthDate && <p className="mt-1 text-sm text-red-500">{errors.birthDate.message}</p>}
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="sm:col-span-2">
                    <label className="mb-1 block font-body text-sm text-text-muted">{t('street')}</label>
                    <AddressAutocomplete
                      value={watch('street') ?? ''}
                      onChange={(v) => setValue('street', v)}
                      onSelect={(s) => {
                        setValue('street', s.street);
                        setValue('zip', s.zip);
                        setValue('city', s.city);
                      }}
                      placeholder={t('streetPlaceholder')}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block font-body text-sm text-text-muted">{t('zip')}</label>
                    <input {...register('zip')} className={inputClass} placeholder="z. B. 41063" />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block font-body text-sm text-text-muted">{t('city')}</label>
                  <input {...register('city')} className={inputClass} placeholder="z. B. Mönchengladbach" />
                </div>
                <div>
                  <label className="mb-1 block font-body text-sm text-text-muted">{t('motherTongue')} *</label>
                  <select {...register('motherTongue')} className={inputClass}>
                    {LANGUAGES.map(({ value, label }) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="rounded-xl border border-white/10 bg-surface/40 p-4">
                  <h4 className="mb-2 font-heading text-sm font-bold uppercase text-green-primary">{t('idDocSection')}</h4>
                  <p className="mb-3 font-body text-xs text-text-muted">{t('idDocHint')}</p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <IdUploadSlot
                      label={t('idDocFront')}
                      dropLabel={t('idDocDrop')}
                      clearLabel={t('idDocClear')}
                      file={idFrontFile}
                      onPick={setIdFrontFile}
                    />
                    <IdUploadSlot
                      label={t('idDocBack')}
                      dropLabel={t('idDocDrop')}
                      clearLabel={t('idDocClear')}
                      file={idBackFile}
                      onPick={setIdBackFile}
                    />
                  </div>
                  {idDocErr && <p className="mt-3 text-sm text-red-500">{idDocErrorMessage(idDocErr)}</p>}
                  <p className="mt-3 font-body text-xs text-text-muted">{t('idDocPrivacy')}</p>
                </div>
                <div>
                  <label className="mb-1 block font-body text-sm text-text-muted">{t('referrerCode')}</label>
                  <input
                    {...register('referrerCode')}
                    className={inputClass}
                    placeholder={t('referrerCodePlaceholder')}
                    autoComplete="off"
                  />
                  <p className="mt-1 text-xs text-text-muted">{t('referrerCodeHint')}</p>
                </div>
                <button type="button" onClick={onStep1Next} className="btn-primary w-full sm:w-auto" data-cta data-testid="registration-step1-next">
                  {t('next')} →
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <h3 className="font-heading text-lg font-bold italic uppercase text-green-primary">
                  {t('step2Title')}
                </h3>
                <div>
                  <label className="mb-2 block font-body text-sm text-text-muted">{t('licenceClass')} *</label>
                  <div className="flex flex-wrap gap-2">
                    {LICENCE_CLASSES.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => {
                          setValue('licenceClass', c);
                          setValue('bf17', c === 'BF17');
                        }}
                        className={`rounded-lg border px-4 py-2 font-heading text-sm font-bold uppercase transition-colors ${
                          licenceClass === c
                            ? 'border-green-primary bg-green-primary/20 text-green-primary'
                            : 'border-white/20 bg-surface2 text-white hover:border-green-primary/50'
                        }`}
                      >
                        {c === 'B'
                          ? t('licenceOptionB')
                          : c === 'BF17'
                            ? t('licenceOptionBF17')
                            : c === 'B197'
                              ? t('licenceOptionB197')
                              : t('licenceOptionBE')}
                      </button>
                    ))}
                  </div>
                </div>
                {(licenceClass === 'B' ||
                  licenceClass === 'BF17' ||
                  licenceClass === 'B197' ||
                  licenceClass === 'BE') && (
                  <div className="flex gap-4">
                    <label className="flex cursor-pointer items-center gap-2">
                      <input type="radio" value="manual" {...register('transmission')} className="text-green-primary" />
                      <span className="font-body text-sm">{t('transmissionManual')}</span>
                    </label>
                    <label className="flex cursor-pointer items-center gap-2">
                      <input type="radio" value="automatic" {...register('transmission')} className="text-green-primary" />
                      <span className="font-body text-sm">{t('transmissionAuto')}</span>
                    </label>
                  </div>
                )}
                <div>
                  <label className="mb-1 block font-body text-sm text-text-muted">{t('instructor')}</label>
                  <select {...register('instructorId')} className={inputClass}>
                    <option value="">{t('instructorAny')}</option>
                    {list.filter((i) => i.available).map((i) => (
                      <option key={i.id} value={i.id}>
                        {i.name} — {i.classes.join(', ')}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block font-body text-sm text-text-muted">{t('lessonLanguage')} *</label>
                  <select {...register('lessonLanguage')} className={inputClass}>
                    {LANGUAGES.map(({ value, label }) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-wrap gap-4">
                  <label className="flex cursor-pointer items-center gap-2">
                    <input type="checkbox" {...register('hasLicence')} className="rounded text-green-primary" />
                    <span className="font-body text-sm">{t('hasLicence')}</span>
                  </label>
                </div>
                <div>
                  <label className="mb-2 block font-body text-sm text-text-muted">{t('timeSlots')}</label>
                  <div className="flex flex-wrap gap-2">
                    {TIME_PILLS.map(({ value, labelKey }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => {
                          const current = watch('timeSlots') ?? [];
                          const next = (current as TimeSlot[]).includes(value as TimeSlot)
                            ? (current as TimeSlot[]).filter((x) => x !== value)
                            : [...(current as TimeSlot[]), value as TimeSlot];
                          setValue('timeSlots', next);
                        }}
                        className={`rounded-full border px-4 py-2 font-body text-sm transition-colors ${
                          (watch('timeSlots') ?? []).includes(value as TimeSlot)
                            ? 'border-green-primary bg-green-primary/20 text-green-primary'
                            : 'border-white/20 bg-surface2 text-white'
                        }`}
                      >
                        {t(labelKey)}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="mb-1 block font-body text-sm text-text-muted">{t('source')}</label>
                  <select {...register('source')} className={inputClass}>
                    {SOURCES.map(({ value, labelKey }) => (
                      <option key={value} value={value}>
                        {t(labelKey)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="rounded-xl border border-white/10 bg-surface/40 p-4">
                  <p className="mb-3 font-heading text-sm font-bold uppercase text-green-primary">{t('offerLabel')}</p>
                  <div className="space-y-3">
                    <label className="flex cursor-pointer gap-3 rounded-lg border border-white/10 bg-surface2/80 p-3 has-[:checked]:border-green-primary/60 has-[:checked]:bg-green-primary/5">
                      <input type="radio" value="standard" {...register('offerType')} className="mt-1 text-green-primary" />
                      <span>
                        <span className="font-body font-medium text-white">{t('offerStandardTitle')}</span>
                        <span className="mt-1 block font-body text-xs text-text-muted">{t('offerStandardDesc')}</span>
                      </span>
                    </label>
                    <label className="flex cursor-pointer gap-3 rounded-lg border border-white/10 bg-surface2/80 p-3 has-[:checked]:border-green-primary/60 has-[:checked]:bg-green-primary/5">
                      <input type="radio" value="bundle_10_promo" {...register('offerType')} className="mt-1 text-green-primary" />
                      <span>
                        <span className="font-body font-medium text-white">{t('offerBundleTitle')}</span>
                        <span className="mt-1 block font-body text-xs text-text-muted">{t('offerBundleDesc', { price: PRICING_LESSON_HOUR_EUR })}</span>
                      </span>
                    </label>
                  </div>
                </div>
                <div className="flex gap-4">
                  <button type="button" onClick={() => setStep(1)} className="btn-ghost" data-testid="registration-step2-back">
                    ← {t('back')}
                  </button>
                  <button type="button" onClick={onStep2Next} className="btn-primary" data-cta data-testid="registration-step2-next">
                    {t('next')} →
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <h3 className="font-heading text-lg font-bold italic uppercase text-green-primary">
                  {t('step3Title')}
                </h3>
                <p className="rounded-lg border border-white/10 bg-surface2/60 p-4 font-body text-xs leading-relaxed text-text-muted">
                  {t('paymentExplainer')}
                </p>
                {offerType === 'bundle_10_promo' && (
                  <p className="rounded-lg border border-green-primary/20 bg-green-primary/5 p-3 font-body text-xs text-text-muted">
                    {t('paymentExplainerBundle')}
                  </p>
                )}
                <div className="rounded-xl border border-[rgba(93,196,34,0.2)] bg-surface/80 p-6">
                  <p className="font-body text-sm text-text-muted">{t('summaryText')}</p>
                  <ul className="mt-2 space-y-1 font-body text-sm text-white">
                    <li className="flex justify-between gap-4">
                      <span className="text-text-muted">{t('feeRegistration')}</span>
                      <span>{PRICING_REGISTRATION_EUR},00 €</span>
                    </li>
                    <li className="flex justify-between gap-4">
                      <span className="text-text-muted">{t('feeApp')}</span>
                      <span>{PRICING_APP_EUR},00 €</span>
                    </li>
                    {checkout.lessonSubtotalEur > 0 && (
                      <>
                        <li className="flex justify-between gap-4">
                          <span className="text-text-muted">
                            {t('feeBundleLessons', { paid: checkout.paidLessonHours, price: PRICING_LESSON_HOUR_EUR })}
                          </span>
                          <span>{checkout.lessonSubtotalEur},00 €</span>
                        </li>
                        <li className="text-xs text-green-primary/90">{t('feePromoLesson', { n: checkout.promoLessonHours })}</li>
                      </>
                    )}
                    <li className="mt-2 flex justify-between gap-4 border-t border-white/10 pt-2 font-heading font-bold text-green-primary">
                      <span>{t('feeTotalNow')}</span>
                      <span>{checkout.totalEur},00 €</span>
                    </li>
                  </ul>
                  <p className="mt-2 text-xs text-text-muted">{t('inclVat')}</p>
                </div>
                {stripeError && (
                  <p className="rounded-lg border border-amber-500/50 bg-amber-500/10 px-4 py-2 text-sm text-amber-400">
                    {stripeError}
                  </p>
                )}
                {clientSecret && stripePromise && (
                  <div className="rounded-xl border border-white/10 bg-surface2 p-4">
                    <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'night' } }}>
                      <PaymentElement options={{ layout: 'tabs' }} />
                      <label className="mt-4 flex cursor-pointer items-start gap-2">
                        <input type="checkbox" {...register('acceptTerms')} className="mt-1 rounded text-green-primary" />
                        <span className="font-body text-sm text-text-muted">
                          {t('acceptTerms')}{' '}
                          <Link href="/agb" className="text-green-primary underline">{t('termsLink')}</Link>.
                        </span>
                      </label>
                      {errors.acceptTerms && <p className="text-sm text-red-500">{errors.acceptTerms.message}</p>}
                      <label className="flex cursor-pointer items-start gap-2">
                        <input type="checkbox" {...register('acceptPrivacy')} className="mt-1 rounded text-green-primary" />
                        <span className="font-body text-sm text-text-muted">
                          {t('acceptPrivacy')}{' '}
                          <Link href="/datenschutz" className="text-green-primary underline">{t('privacyLink')}</Link>
                          {t('acceptPrivacySuffix')}
                        </span>
                      </label>
                      {errors.acceptPrivacy && <p className="text-sm text-red-500">{errors.acceptPrivacy.message}</p>}
                      <Step3PayButton
                        formData={watch()}
                        validate={() => registrationStep3Schema.safeParse(watch()).success}
                        onBack={() => setStep(2)}
                        checkoutTotal={checkout.totalEur}
                        registrationId={paymentRegistrationId}
                        t={t}
                      />
                    </Elements>
                  </div>
                )}
                {(!clientSecret || !stripePromise) && (
                  <>
                    <label className="flex cursor-pointer items-start gap-2">
                      <input type="checkbox" {...register('acceptTerms')} className="mt-1 rounded text-green-primary" />
                      <span className="font-body text-sm text-text-muted">
                        {t('acceptTerms')}{' '}
                        <Link href="/agb" className="text-green-primary underline">{t('termsLink')}</Link>.
                      </span>
                    </label>
                    {errors.acceptTerms && <p className="text-sm text-red-500">{errors.acceptTerms.message}</p>}
                    <label className="flex cursor-pointer items-start gap-2">
                      <input type="checkbox" {...register('acceptPrivacy')} className="mt-1 rounded text-green-primary" />
                      <span className="font-body text-sm text-text-muted">
                        {t('acceptPrivacy')}{' '}
                        <Link href="/datenschutz" className="text-green-primary underline">{t('privacyLink')}</Link>
                        {t('acceptPrivacySuffix')}
                      </span>
                    </label>
                    <div className="flex gap-4">
                      <button type="button" onClick={() => setStep(2)} className="btn-ghost" data-testid="registration-step3-back-top">
                        ← {t('back')}
                      </button>
                      <button
                        type="button"
                        onClick={startPayment}
                        data-testid="registration-step3-start-payment"
                        className="btn-primary flex-1"
                        data-cta
                      >
                        🏁 {t('submitPay', { total: checkout.totalEur })}
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="mt-10 lg:mt-0 lg:w-[40%]">
            <div className="sticky top-24 rounded-xl border border-[rgba(93,196,34,0.2)] bg-surface/80 p-6">
              <h4 className="font-heading text-sm font-bold italic uppercase text-green-primary">
                {t('summary')}
              </h4>
              <dl className="mt-4 space-y-2 font-body text-sm text-text-muted">
                <div>
                  <dt>{t('summaryClass')}</dt>
                  <dd className="font-medium text-white">
                    {watch('licenceClass') === 'BF17'
                      ? t('licenceOptionBF17')
                      : watch('licenceClass') === 'B'
                        ? t('licenceOptionB')
                        : watch('licenceClass') === 'B197'
                          ? t('licenceOptionB197')
                          : watch('licenceClass') === 'BE'
                            ? t('licenceOptionBE')
                            : '–'}
                  </dd>
                </div>
                <div>
                  <dt>{t('summaryInstructor')}</dt>
                  <dd className="font-medium text-white">
                    {list.find((i) => i.id === watch('instructorId'))?.name ?? t('instructorAny')}
                  </dd>
                </div>
                <div>
                  <dt>{t('summaryLanguage')}</dt>
                  <dd className="font-medium text-white">{watch('lessonLanguage') ?? '–'}</dd>
                </div>
                <hr className="border-white/10" />
                <div>
                  <dt>{t('summaryOffer')}</dt>
                  <dd className="font-medium text-white">
                    {offerType === 'bundle_10_promo' ? t('offerBundleTitle') : t('offerStandardTitle')}
                  </dd>
                </div>
                <div>
                  <dt>{t('feeTotalNow')}</dt>
                  <dd className="font-display font-bold text-green-primary">{checkout.totalEur},00 €</dd>
                </div>
                <p className="text-xs text-text-muted">({t('inclVat')})</p>
              </dl>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
