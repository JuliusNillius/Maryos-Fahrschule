# Button-Checkliste – alle Buttons mit Funktion

Diese Liste enthält **alle klickbaren Buttons und CTAs** (inkl. Links mit `onClick`) im Projekt. Jeder Eintrag hat eine **Funktion** und kann manuell getestet werden.

## data-testid für E2E-Tests

Alle wichtigen Buttons/CTAs haben ein **data-testid**-Attribut für stabile Selektoren in Playwright, Cypress o. Ä.:

| data-testid | Komponente |
|-------------|------------|
| `hero-cta-primary`, `hero-cta-secondary` | Hero |
| `faq-toggle-1` … `faq-toggle-9` | FAQ |
| `navbar-lang-toggle`, `navbar-register`, `navbar-backoffice`, `navbar-mobile-open`, `navbar-mobile-close` | Navbar |
| `registration-step1-next`, `registration-step2-back`, `registration-step2-next`, `registration-step3-back`, `registration-step3-back-top`, `registration-step3-pay`, `registration-step3-start-payment`, `registration-success-home` | RegistrationForm |
| `pricing-cta-{item.id}` (z. B. `pricing-cta-b`) | Pricing |
| `classes-cta-{id}` (z. B. `classes-cta-b`) | Classes |
| `instructors-filter-lang-{lang}`, `instructors-filter-class-{c}`, `instructors-cta-{inst.id}` | Instructors |
| `home-tab-{id}` (z. B. `home-tab-fuehrerscheine`) | HomeTabs |
| `quiz-lang-{l}`, `quiz-class-pkw`, `quiz-class-motorrad`, `quiz-finish`, `quiz-cta-result`, `quiz-browse-all`, `quiz-restart` | InstructorQuiz |
| `booking-submit` | BookingCalendar |
| `calculator-class-{cls}`, `calculator-transmission-manual`, `calculator-transmission-automatic`, `calculator-intensive-toggle`, `calculator-breakdown-toggle` | PriceCalculator |
| `whatsapp-cta` | WhatsAppButton |
| `backoffice-login-submit` | Login |
| `backoffice-logout` | BackofficeShell |
| `backoffice-lehrer-new`, `backoffice-lehrer-edit-{id}`, `backoffice-lehrer-delete-{id}`, `backoffice-lehrer-cancel`, `backoffice-lehrer-save` | Backoffice Lehrer |
| `backoffice-faq-new`, `backoffice-faq-edit-{id}`, `backoffice-faq-delete-{id}`, `backoffice-faq-cancel`, `backoffice-faq-save` | Backoffice FAQ |
| `backoffice-einstellungen-save`, `backoffice-preise-save` | Backoffice Einstellungen / Preise |

**Beispiel (Playwright):** `await page.getByTestId('hero-cta-primary').click();`

---

## Öffentliche Website

### Hero (`components/sections/Hero.tsx`)
| Element | Typ | Funktion | Erwartetes Verhalten |
|--------|-----|----------|----------------------|
| „Fahr in dein Glück“ (Primary CTA) | `Link` | `href="/#anmelden"` | Scrollt zu #anmelden |
| Sekundärer CTA | `Link` | `href="/#lehrer"` | Scrollt zu #lehrer |

### FAQ (`components/sections/FAQ.tsx`)
| Element | Typ | Funktion | Erwartetes Verhalten |
|--------|-----|----------|----------------------|
| FAQ-Item (Überschrift) | `button` | `onClick={onToggle}` | Öffnet/schließt Antwort |

### Anmeldung / RegistrationForm (`components/sections/RegistrationForm.tsx`)
| Element | Typ | Funktion | Erwartetes Verhalten |
|--------|-----|----------|----------------------|
| „Zurück“ (Step 3) | `button` | `onClick={onBack}` | Zurück zu Step 2 |
| „Submit / 99 €“ (Step 3) | `button` | `onClick={handlePay}` | Stripe-Zahlung starten |
| „Weiter“ (Step 1) | `button` | `onClick={onStep1Next}` | Validiert & Step 2 |
| Führerschein-Klasse (Pills) | `button` | `onClick={() => setValue('licenceClass', c)}` | Setzt gewählte Klasse |
| Zeit-Pill | `button` | `onClick={() => {...}}` | Setzt gewählte Zeit |
| „Zurück“ (Step 2) | `button` | `onClick={() => setStep(1)}` | Zurück zu Step 1 |
| „Weiter“ (Step 2) | `button` | `onClick={onStep2Next}` | Validiert & Step 3 |
| „Zurück“ (Step 3, oben) | `button` | `onClick={() => setStep(2)}` | Zurück zu Step 2 |
| „Jetzt zahlen“ (Step 3) | `button` | `onClick={startPayment}` | Öffnet Zahlungs-UI |
| „Zur Startseite“ | `Link` | `href="/"` | Navigiert zur Startseite |

### Preise / Pricing (`components/sections/Pricing.tsx`)
| Element | Typ | Funktion | Erwartetes Verhalten |
|--------|-----|----------|----------------------|
| „Jetzt anmelden“ pro Paket | `Link` | `href="/#anmelden"` + `onClick={() => setRegistrationClass(...)}` | Setzt Klasse, scrollt zu #anmelden |

### Lehrer / Instructors (`components/sections/Instructors.tsx`)
| Element | Typ | Funktion | Erwartetes Verhalten |
|--------|-----|----------|----------------------|
| Sprach-Filter (Pills) | `button` | `onClick={() => toggleLang(lang)}` | Filtert nach Sprache |
| Klassen-Filter (Pills) | `button` | `onClick={() => setClassFilter(c)}` | Filtert PKW/Motorrad |
| „Jetzt anmelden“ pro Lehrer | `button` | `onClick={() => scrollToAnmelden(inst.id)}` | Setzt Lehrer, scrollt zu #anmelden |

### Home-Tabs (`components/sections/HomeTabs.tsx`)
| Element | Typ | Funktion | Erwartetes Verhalten |
|--------|-----|----------|----------------------|
| Tab-Buttons | `button` | `onClick={() => setActiveTab(index)}` | Wechselt aktiven Tab |

### Lehrer-Quiz / InstructorQuiz (`components/sections/InstructorQuiz.tsx`)
| Element | Typ | Funktion | Erwartetes Verhalten |
|--------|-----|----------|----------------------|
| Sprach-Auswahl | `button` | `onClick={() => handleLang(l)}` | Setzt Sprache, nächster Step |
| „PKW“ | `button` | `onClick={() => handleClass('pkw')}` | Setzt Klasse PKW |
| „Motorrad“ | `button` | `onClick={() => handleClass('motorrad')}` | Setzt Klasse Motorrad |
| „Fertig“ (Ergebnis) | `button` | `onClick={handleFinish}` | Zeigt Ergebnis |
| „Diesen Lehrer wählen“ | `button`/Link | `onClick={() => setRegistrationInstructor(result.id)}` | Setzt Lehrer für Anmeldung |
| „Lehrer anzeigen“ | `Link` | `href="/#lehrer"` | Scrollt zu #lehrer |
| „Nochmal“ | `button` | `onClick={() => { setStep(1); ... }}` | Setzt Quiz zurück |

### Buchungskalender (`components/sections/BookingCalendar.tsx`)
| Element | Typ | Funktion | Erwartetes Verhalten |
|--------|-----|----------|----------------------|
| Datum-Pills | `button` | `onClick={() => { setSelectedDate(d); setSelectedTime(null); }}` | Wählt Datum |
| Uhrzeit-Pills | `button` | `onClick={() => setSelectedTime(time)}` | Wählt Uhrzeit |
| „Termin buchen“ o.ä. | `button` | `onClick={handleSubmit}` | Sendet Buchungsanfrage |

### Preiskalkulator (`components/sections/PriceCalculator.tsx`)
| Element | Typ | Funktion | Erwartetes Verhalten |
|--------|-----|----------|----------------------|
| Klassen-Auswahl | `button` | `onClick={() => setSelectedClass(cls)}` | Wählt Führerscheinklasse |
| „Schaltung“ | `button` | `onClick={() => setTransmission('manual')}` | Setzt Schaltung |
| „Automatik“ | `button` | `onClick={() => setTransmission('automatic')}` | Setzt Automatik |
| Intensiv-Toggle | `button` | `onClick={() => setIntensive((v) => !v)}` | Schaltet Intensiv ein/aus |
| „Kostenüberblick“ o.ä. | `button` | `onClick={() => setBreakdownOpen((o) => !o)}` | Öffnet/schließt Kosten-Detail |

### Führerscheinklassen / Classes (`components/sections/Classes.tsx`)
| Element | Typ | Funktion | Erwartetes Verhalten |
|--------|-----|----------|----------------------|
| „→ [CTA]“ pro Klasse | `button` | `onClick={() => scrollToAnmelden(id)}` | Setzt Klasse, scrollt zu #anmelden |

### Navbar (`components/layout/Navbar.tsx`)
| Element | Typ | Funktion | Erwartetes Verhalten |
|--------|-----|----------|----------------------|
| Sprach-Umschalter (Desktop) | `button` | `onClick={() => setLangOpen((o) => !o)}` | Öffnet/schließt Sprach-Dropdown |
| Sprach-Option im Dropdown | `Link`/click | `onClick={() => setLangOpen(false)}` | Wechselt Sprache, schließt Dropdown |
| Mobile-Menü öffnen | `button` | `onClick={() => setMobileOpen(true)}` | Öffnet Mobile-Menü |
| Logo (im Mobile-Menü) | `Link` | `onClick={() => setMobileOpen(false)}` | Schließt Menü, geht zu Startseite |
| Mobile-Menü schließen (X) | `button` | `onClick={() => setMobileOpen(false)}` | Schließt Mobile-Menü |
| Mobile-Nav-Links | `Link` | `onClick={() => setMobileOpen(false)}` | Schließt Menü nach Klick |

### WhatsApp (`components/layout/WhatsAppButton.tsx`)
| Element | Typ | Funktion | Erwartetes Verhalten |
|--------|-----|----------|----------------------|
| WhatsApp-Icon | `a` | `href={WHATSAPP_URL}` | Öffnet WhatsApp (extern) |

### Footer
- Alle Einträge sind **Links** (`Link` mit `href`) – keine zusätzliche Button-Logik.

---

## Backoffice

### Login (`app/backoffice/login/page.tsx`)
| Element | Typ | Funktion | Erwartetes Verhalten |
|--------|-----|----------|----------------------|
| „Anmelden“ | `button` | `type="submit"` → `handleSubmit` | Loggt ein, leitet weiter |
| „← Zur Website“ | `Link` | `href="/"` | Zur Startseite |

### Shell / Layout (`app/backoffice/BackofficeShell.tsx`)
| Element | Typ | Funktion | Erwartetes Verhalten |
|--------|-----|----------|----------------------|
| Logout | `button` | `onClick={handleLogout}` | Loggt aus |

### Lehrer-Verwaltung (`app/backoffice/lehrer/page.tsx`)
| Element | Typ | Funktion | Erwartetes Verhalten |
|--------|-----|----------|----------------------|
| „+ Neu“ | `button` | `onClick={openNew}` | Öffnet leeres Formular |
| „Bearbeiten“ pro Zeile | `button` | `onClick={() => openEdit(item)}` | Öffnet Bearbeitung |
| „Löschen“ pro Zeile | `button` | `onClick={() => remove(item.id)}` | Löscht Lehrer |
| Sprach-Pills (Formular) | `button` | `onClick={() => toggleArray(..., 'languages', lang)}` | Toggle Sprache |
| Klassen-Pills (Formular) | `button` | `onClick={() => toggleArray(..., 'classes', c)}` | Toggle Klasse |
| „Abbrechen“ | `button` | `onClick={() => setEditing(null)}` | Schließt Formular |
| „Speichern“ | `button` | `onClick={save}` | Speichert Lehrer |

### FAQ-Verwaltung (`app/backoffice/faq/page.tsx`)
| Element | Typ | Funktion | Erwartetes Verhalten |
|--------|-----|----------|----------------------|
| „+ Neu“ | `button` | `onClick={openNew}` | Neue FAQ anlegen |
| „Bearbeiten“ | `button` | `onClick={() => openEdit(row)}` | FAQ bearbeiten |
| „Löschen“ | `button` | `onClick={() => remove(row.id)}` | FAQ löschen |
| „Abbrechen“ | `button` | `onClick={() => setEditing(null)}` | Formular schließen |
| „Speichern“ | `button` | `onClick={save}` | FAQ speichern |

### Einstellungen (`app/backoffice/einstellungen/page.tsx`)
| Element | Typ | Funktion | Erwartetes Verhalten |
|--------|-----|----------|----------------------|
| „Speichern“ | `button` | `onClick={save}` | Einstellungen speichern |

### Preise-Verwaltung (`app/backoffice/preise/page.tsx`)
| Element | Typ | Funktion | Erwartetes Verhalten |
|--------|-----|----------|----------------------|
| „Speichern“ | `button` | `onClick={save}` | Preise speichern |

---

## UI-Komponente

### `components/ui/Button.tsx`
- Wiederverwendbarer **Button**; alle Props (inkl. `onClick`, `type="submit"`) werden durchgereicht.  
- Jede Verwendung muss von der aufrufenden Seite einen Handler übergeben.

---

## Kurz-Check (Code)

- **Alle `<button>`** haben entweder `type="submit"` (Formular) oder `onClick={...}`.
- **Links mit Aktion** (z. B. Preise „Jetzt anmelden“): `Link` + `onClick` für `setRegistrationClass` / `setRegistrationInstructor` sind gesetzt.
- **scrollToAnmelden** in Classes und Instructors: setzt Registration-State und scrollt zu `#anmelden`.

---

## Manueller Test

1. **Startseite**: Hero-CTAs, FAQ auf/zu, Tabs, Lehrer-Filter, Klassen-Buttons, Preise-Links, Quiz, Buchung, Preiskalkulator.
2. **Navbar**: Sprachumschalter, Mobile-Menü öffnen/schließen, alle Nav-Links.
3. **Backoffice**: Login, Logout, CRUD Lehrer/FAQ, Einstellungen & Preise speichern.

Wenn du willst, können wir als Nächstes **data-cta** / **data-testid** für automatisierte Tests ergänzen oder einzelne Flows (z. B. Anmeldung, Buchung) genauer durchgehen.
