-- FAQ: Kategorie für Filter + ausführliche Standard-Fragen (DE/TR/AR).
-- Bestehende Einträge bleiben; diese IDs werden per UPSERT aktualisiert.

alter table public.faq add column if not exists category text not null default 'allgemein';

insert into public.faq (id, sort_order, category, question_de, answer_de, question_tr, answer_tr, question_ar, answer_ar)
values
(
  'a0000001-0000-4000-8000-000000000001'::uuid,
  10,
  'allgemein',
  'Wo finde ich euch in Mönchengladbach — und wie komme ich am besten hin?',
  'Unsere Fahrschule liegt zentral in Mönchengladbach an der Bahnhofstraße 25 (41236). Viele Fahrschüler:innen kommen mit Bus oder Bahn in die Nähe des Hauptbahnhofs und sind von dort schnell zu Fuß bei uns. Wenn du mit dem Auto kommst: In der Innenstadt gilt wie überall Augenmerk auf Kurzparkzonen — ein paar Minuten weiter gibt es oft freiere Stellplätze. Kurz: Wir sind gut erreichbar, egal ob du aus Rheydt, Wickrath oder einem anderen Stadtteil von Mönchengladbach startest.',
  'Mönchengladbach''da sizi nerede bulurum, en iyi nasıl gelirim?',
  'Sürücü kursumuz Mönchengladbach merkezde Bahnhofstraße 25 (41236) adresindedir. Birçok kursiyer ana tren istasyonuna otobüs veya trenle yaklaşıp kısa bir yürüyüşle bize ulaşır. Arabayla geliyorsan şehir merkezinde kısa süreli park kurallarına dikkat etmen yeterli. Rheydt, Wickrath veya Mönchengladbach''ın başka bir semtinden de kolayca ulaşabilirsin.',
  'أين أجدكم في مونشنغلادباخ وكيف أصل إليكم بسهولة؟',
  'مدرسة القيادة في مونشنغلادباخ في Bahnhofstraße 25 (41236). كثير من الطلاب يصلون بالحافلة أو القطار قرب المحطة الرئيسية ثم يمشون قليلاً. بالسيارة انتبه لمناطق الوقوف القصير في المدينة. من رايدت أو ويكراث أو أي حي في مونشنغلادباخ الوصول مريح.'
),
(
  'a0000001-0000-4000-8000-000000000002'::uuid,
  20,
  'preise',
  'Was kostet die Anmeldung, die Lern-App und eine Fahrstunde bei euch?',
  'Transparent und gleich für alle unsere PKW-Klassen: Die Anmeldung kostet 349 € inkl. MwSt., die Lern-App 50 € inkl. MwSt. Jede übliche Fahrstunde liegt bei 65 € inkl. MwSt. Die genauen Summen siehst du auch im Preisrechner auf unserer Seite „Preise“ — dort kannst du für Klasse B, BF17, B197 oder BE dein Szenario durchspielen. TÜV-Gebühren und der Erste-Hilfe-Kurs sind separate Posten (siehe eigene Fragen dazu).',
  'Kayıt, öğrenme uygulaması ve bir direksiyon dersi ne kadar?',
  'Net fiyatlar: Kayıt 349 € (KDV dahil), öğrenme uygulaması 50 € (KDV dahil), standart direksiyon dersi 65 € (KDV dahil). „Fiyatlar“ sayfasındaki hesap makinesinde B, BF17, B197 veya BE için senaryonu görebilirsin. TÜV ücretleri ve İlk Yardım kursu ayrı kalemlerdir.',
  'كم تكلفة التسجيل وتطبيق التعلّم وساعة قيادة واحدة؟',
  'أسعار شفافة: التسجيل 349 € شامل الضريبة، التطبيق 50 €، ساعة القيادة الاعتيادية 65 €. راجع حاسبة الأسعار في صفحة الأسعار لسيناريوهات B وBF17 وB197 وBE. رسوم TÜV ودورة الإسعافات الأولية بندان منفصلان.'
),
(
  'a0000001-0000-4000-8000-000000000003'::uuid,
  30,
  'preise',
  'Mit welchem Gesamtbudget sollte ich für Klasse B in Mönchengladbach rechnen?',
  'Eine pauschale Zahl gibt es nicht — es hängt von deinen Fahrstunden und den TÜV-Gebühren ab. Als grobe Orientierung: Viele Fahrschüler:innen landen mit typischem Verlauf oft bei etwa 2.000 € (eher zügig), 2.400 € (normal) oder 2.800 € (mehr Übung und Wiederholung). Rechne immer Anmeldung + App + (Fahrstunden × 65 €) + TÜV Praxis/Theorie + Sonstiges ein. In Mönchengladbach gilt dieselbe Struktur wie überall — wir erklären dir gern persönlich, was für dich realistisch ist.',
  'Mönchengladbach''da B sınıfı için toplam bütçe ne olmalı?',
  'Net bir rakam yok; direksiyon saatlerine ve TÜV ücretlerine bağlı. Çoğu aday yaklaşık 2.000 € (hızlı), 2.400 € (ortalama) veya 2.800 € (daha fazla pratik) bandında kalır. Kayıt + uygulama + (saat × 65 €) + TÜV + diğer giderleri hesaba kat. Mönchengladbach''ta yapı aynı — sana kişisel olarak neyin gerçekçi olduğunu anlatırız.',
  'ما الميزانية الإجمالية التقريبية لرخصة الصنف B في مونشنغلادباخ؟',
  'لا رقمًا موحّدًا؛ يعتمد على ساعات القيادة ورسوم TÜV. غالبًا بين 2000 € و2400 € و2800 € حسب السرعة والتدريب. احسب التسجيل + التطبيق + (الساعات × 65 €) + TÜV وغيرها. في مونشنغلادباخ البنية مماثلة؛ نشرح لك الواقعي شخصيًا.'
),
(
  'a0000001-0000-4000-8000-000000000004'::uuid,
  40,
  'foerderung',
  'Kann ich den Führerschein über das Jobcenter / die Agentur für Arbeit bei euch machen?',
  'Ja, grundsätzlich kann eine Förderung über die Agentur für Arbeit oder das Jobcenter möglich sein — wenn die Voraussetzungen im Einzelfall erfüllt sind (z. B. beruflicher Bezug, Bildungs- und Teilhabepaket je nach Situation). Wir sind als Fahrschule in Mönchengladbach dein Ausbildungspartner: Die Bewilligung und der Bewilligungsbescheid laufen über deine zuständige Behörde, nicht über uns. Bring Bescheid oder Rückfragen idealerweise zu einem Beratungsgespräch mit — dann stimmen wir Ablauf und Dokumente mit dir ab.',
  'İşkur / Jobcenter ile ehliyetinizi yapabilir miyim?',
  'Evet, şartlar sağlanırsa İş Ajansı veya Jobcenter desteği mümkün olabilir (mesleki bağ, bireysel durum). Mönchengladbach''taki sürücü kursu olarak biz eğitim tarafındayız; onay belgesi yetkili kurumdan gelir. Bize belgelerinle gel, süreci birlikte netleştirelim.',
  'هل يمكن تمويل الرخصة عبر مكتب العمل أو جوب سنتر لديكم؟',
  'نعم، قد يكون الدعم ممكنًا إذا استوفيت الشروط؛ الموافقة من الجهة المختصة وليس منا. نحن شريك التدريب في مونشنغلادباخ. أحضر المستندات أو ناقش ذلك في جلسة استشارة.'
),
(
  'a0000001-0000-4000-8000-000000000005'::uuid,
  50,
  'klassen',
  'Was ist der Unterschied zwischen Klasse B, BF17, B197 und BE?',
  'Klasse B ist der klassische Pkw-Führerschein ab 18. BF17 bedeutet begleitetes Fahren ab 17 mit vorgegebenen Begleitpersonen — die Ausbildung entspricht im Kern der Klasse B. B197: Du legst die praktische Prüfung auf Automatik ab, hast aber eine nachgewiesene Schaltkompetenz und darfst später auch Schaltwagen fahren. BE ist der Anhängerführerschein für größere Kombinationen aus Auto und Anhänger. Alle vier Themen besprechen wir gern in Ruhe — passend zu deinem Alltag in Mönchengladbach und Umgebung.',
  'B, BF17, B197 ve BE arasındaki fark nedir?',
  'B: 18 yaştan itibaren klasik otomobil ehliyeti. BF17: 17 yaştan eşlikli sürüş. B197: Pratik sınav otomatikte, belgeli vites bilgisi sonrası manuel de sürebilirsin. BE: Römork/römorklu kombinasyonlar. Hepsini Mönchengladbach ve çevrendeki ihtiyacına göre açıklarız.',
  'ما الفرق بين الصنف B وBF17 وB197 وBE؟',
  'B: سيارة من 18. BF17: قيادة مرافَقة من 17. B197: امتحان عملي أوتوماتيك مع إثبات مهارة نقل الحركة لاحقًا. BE: مقطورة أكبر. نشرح ذلك وفق احتياجك في مونشنغلادباخ.'
),
(
  'a0000001-0000-4000-8000-000000000006'::uuid,
  60,
  'klassen',
  'Wie läuft B197 genau — und für wen lohnt sich das in Mönchengladbach?',
  'B197 richtet sich an Fahrschüler:innen, die in der Prüfung auf Automatik fahren möchten, aber später flexibel bleiben wollen. Du erbringst eine zusätzliche Schaltkompetenz in der Ausbildung — danach darfst du nicht nur Automatik fahren. Für Pendler:innen und Stadtverkehr in Mönchengladbach ist das oft eine praktische Wahl. Details zu Stunden und Prüfung klären wir individuell; die Preisbasis für Anmeldung, App und Fahrstunden entspricht dem übrigen PKW-Angebot.',
  'B197 nasıl işler, Mönchengladbach''ta kimler için uygundur?',
  'B197: pratik sınav otomatikte, ek vites eğitimiyle ileride manuel de kullanabilirsin. Mönchengladbach''ta şehir ve işe gidiş için pratik bir seçenek. Saatler ve sınavı birlikte netleştiririz; kayıt ve ders ücretleri diğer PKW sınıflarıyla aynı çerçevede.',
  'كيف يعمل B197 ولمن يناسب في مونشنغلادباخ؟',
  'B197 للراغبين بالامتحان العملي أوتوماتيك مع مرونة لاحقًا؛ تثبت كفاءة نقل الحركة فتقود يدويًا لاحقًا. عملي للتنقل في المدينة. الساعات والامتحان نناقشها فرديًا؛ أسعار التسجيل والدروس كباقي فئات السيارات.'
),
(
  'a0000001-0000-4000-8000-000000000007'::uuid,
  70,
  'klassen',
  'Brauche ich einen Erste-Hilfe-Kurs — und was kostet er bei euch?',
  'Ja, für die Führerscheinanmeldung brauchst du eine Erste-Hilfe-Bescheinigung. Bei uns kannst du den Kurs direkt über die Fahrschule anfragen — aktuell 50 € inkl. MwSt. (Stand Website). Der Kurs ist nicht in der Anmeldegebühr oder dem App-Paket enthalten; er wird separat gebucht. Auf der Seite „Erste Hilfe“ findest du alle Infos und den Weg zur Terminvereinbarung.',
  'İlk yardım kursu gerekli mi, sizde ücreti ne kadar?',
  'Evet, ehliyet başvurusu için geçerli bir ilk yardım sertifikası gerekir. Bizde kursu ayrıca talep edebilirsin — sitede güncel fiyat 50 € KDV dahil. Kayıt paketine dahil değildir. „İlk Yardım“ sayfasında detaylar var.',
  'هل أحتاج دورة إسعافات أولية وكم تكلفتها لديكم؟',
  'نعم، يلزم شهادة للتسجيل. تطلب الدورة عبر المدرسة؛ السعر الحالي 50 € شامل الضريبة (حسب الموقع). غير مشمولة في رسوم التسجيل أو التطبيق. صفحة الإسعافات الأولية للتفاصيل والموعد.'
),
(
  'a0000001-0000-4000-8000-000000000008'::uuid,
  80,
  'anmeldung',
  'Wie läuft die Online-Anmeldung ab — und wie schnell meldet ihr euch?',
  'Du füllst das Formular auf unserer Website aus, wählst Kurs und wenn möglich deine:n Wunschlehrer:in und schließt die Zahlung ab (u. a. Apple Pay, Google Pay, Klarna). Wir bearbeiten Anmeldungen in der Regel innerhalb von 24 Stunden — das ist unser Mindeststandard. Du erreichst uns telefonisch unter 0178 4557528 oder über die grünen Schnellbuttons (WhatsApp / Termin). Wenn etwas unklar ist, klären wir es gern vor Ort in Mönchengladbach.',
  'Online kayıt nasıl işler, ne kadar sürede dönüş yapıyorsunuz?',
  'Formu doldurur, kursu ve mümkünse eğitmenini seçer, ödemeyi tamamlarsın (Apple Pay, Google Pay, Klarna vb.). Başvuruları genelde 24 saat içinde işleriz. 0178 4557528 veya yeşil hızlı düğmelerden ulaşabilirsin. Soruların olursa Mönchengladbach''ta yüz yüze de netleştiririz.',
  'كيف يعمل التسجيل عبر الإنترنت وما مدة الرد؟',
  'تملأ النموذج وتختار الدورة والمدرب إن أمكن وتدفع (Apple Pay وGoogle Pay وKlarna وغيرها). نعالج الطلبات عادة خلال 24 ساعة. للتواصل: 0178 4557528 أو أزرار الواتساب/الموعد. للاستفسارات نرحب بك في مونشنغلادباخ.'
),
(
  'a0000001-0000-4000-8000-000000000009'::uuid,
  90,
  'allgemein',
  'Auf welchen Sprachen unterrichtet ihr — passt das zur Website?',
  'Wir unterrichten auf Deutsch, Türkisch und Arabisch — genau wie unsere Website und das Lehrer-Quiz. So findest du in Mönchengladbach eine Fahrschule, bei der Theorie, Erklärungen und Absprachen in deiner Sprache funktionieren können. Wenn du unsicher bist, welche:r Lehrer:in am besten passt, hilft dir unser Quiz oder unser Team bei der Auswahl.',
  'Hangi dillerde ders veriyorsunuz?',
  'Almanca, Türkçe ve Arapça — site ve öğretmen testiyle uyumlu. Mönchengladbach''ta teori ve iletişim için dil desteği sunuyoruz. Hangi eğitmenin uyacağından emin değilsen test veya ekibimiz yardımcı olur.',
  'أي لغات تدرّسونها وهل تتوافق مع الموقع؟',
  'الألمانية والتركية والعربية — كالموقع واختبار المدربين. دعم لغوي للنظرية والتواصل في مونشنغلادباخ. لاختيار المدرب يساعدك الاختبار أو الفريق.'
),
(
  'a0000001-0000-4000-8000-00000000000a'::uuid,
  100,
  'preise',
  'Gibt es Ratenzahlung oder flexible Zahlungsarten?',
  'Ja. Neben Apple Pay, Google Pay, Sofort und Karte kannst du über Klarna u. a. in Raten zahlen — z. B. in drei Raten ohne Zinsen, sofern Klarna das für dich freigibt. Genaues siehst du beim Checkout. So wird der Führerschein auch in Mönchengladbach planbar, ohne dass alles sofort auf einmal fällig ist.',
  'Taksit veya esnek ödeme var mı?',
  'Evet. Apple Pay, Google Pay, anında ödeme ve kartın yanı sıra Klarna ile taksit mümkün (ör. faizsiz 3 taksit, Klarna onayıyla). Ödeme ekranında görürsün. Böylece Mönchengladbach''ta ehliyet maliyetini planlayabilirsin.',
  'هل توجد أقساط أو طرق دفع مرنة؟',
  'نعم: Apple Pay وGoogle Pay والبطاقة وKlarna وأقساط مثل ثلاثة أقساط بدون فائدة إذا وافقت Klarna. التفاصيل عند الدفع. يصبح التخطيط للرخصة أسهل في مونشنغلادباخ.'
),
(
  'a0000001-0000-4000-8000-00000000000b'::uuid,
  110,
  'foerderung',
  'Gibt es noch andere Förderungen außer Jobcenter — z. B. Bildung und Teilhabe?',
  'Je nach Alter und Lebenssituation können Leistungen wie „Bildung und Teilhabe“ oder andere regionale Programme eine Rolle spielen — das prüft immer die zuständige Stelle bzw. die Familienkasse. Wir als Fahrschule stellen die Ausbildung bereit und helfen bei Fragen zu Kursplan und Dokumenten. Die Bewilligung selbst liegt außerhalb unserer Zuständigkeit — gemeinsam mit deinem Bescheid finden wir aber meist einen klaren Fahrplan.',
  'Jobcenter dışında başka destekler var mı?',
  'Yaş ve duruma göre „Bildung und Teilhabe“ veya yerel programlar mümkün olabilir; bunu yetkili kurum değerlendirir. Biz eğitimi sağlar, belgeler ve plan konusunda yardımcı oluruz. Onay bizden değil — ama belgenle net bir yol çizeriz.',
  'هل توجد دعومات أخرى غير جوب سنتر مثل «التعليم والمشاركة»؟',
  'بحسب العمر والحالة قد تنطبق برامج؛ الجهة المختصة تقرر. نوفر التدريب ونساعد بالمستندات والخطة؛ الموافقة ليست من اختصاصنا لكن نضع خطة واضحة بمستندك.'
),
(
  'a0000001-0000-4000-8000-00000000000c'::uuid,
  120,
  'klassen',
  'BF17: Ab wann darf ich starten und was muss die Begleitperson können?',
  'BF17 startet ab 17 Jahren. Du brauchst eine gesetzmäßig vorgeschriebene Begleitperson (u. a. Mindestalter und Führerscheinvoraussetzungen). Die praktische Ausbildung ist vergleichbar mit Klasse B; der Unterschied liegt im Übungsbetrieb mit Begleitung bis zur Volljährigkeit. Wir erklären dir in Mönchengladbach gern die Formalitäten und den sicheren Einstieg.',
  'BF17: ne zaman başlarım, refakatçi kim olabilir?',
  'BF17 için 17 yaş gerekir. Kanunda tanımlı refakatçi şartlarını sağlamalısın. Pratik eğitim B''ye benzer; fark eşlikli sürüş dönemidir. Mönchengladbach''ta formaliteleri ve güvenli başlangıcı anlatırız.',
  'BF17: متى أبدأ وماذا يلزم للمرافق؟',
  'من 17 سنة؛ مرافق وفق القانون (سن ورخصة وشروط). التدريب العملي مشابه لـ B مع القيادة المرافقة حتى البلوغ. نشرح الإجراءات في مونشنغلادباخ.'
),
(
  'a0000001-0000-4000-8000-00000000000d'::uuid,
  130,
  'allgemein',
  'Wann habt ihr geöffnet und wie erreiche ich euch am schnellsten?',
  'Mo–Fr von 12:00 bis 18:00 Uhr sind wir für dich da — Bahnhofstraße 25, 41236 Mönchengladbach. Am schnellsten oft per WhatsApp oder Terminbutton (grün unten rechts auf der Website) sowie telefonisch unter 0178 4557528. Wenn du außerhalb der Zeiten schreibst, antworten wir zum nächsten Öffnungstag.',
  'Çalışma saatleriniz ve en hızlı iletişim?',
  'Pzt–Cum 12:00–18:00, Bahnhofstraße 25, 41236 Mönchengladbach. En hızlısı genelde WhatsApp veya takvim düğmesi (sağ altta yeşil) ve 0178 4557528. Mesai dışı yazarsan bir sonraki iş günü döneriz.',
  'ما أوقات العمل وأسرع وسيلة للتواصل؟',
  'الاثنين–الجمعة 12:00–18:00، Bahnhofstraße 25. الأسرع غالبًا واتساب أو زر الموعد (أخضر) أو 0178 4557528. خارج الأوقات نرد في يوم العمل التالي.'
),
(
  'a0000001-0000-4000-8000-00000000000e'::uuid,
  140,
  'anmeldung',
  'Kann ich nach der Anmeldung noch den Fahrlehrer wechseln?',
  'Ja, das ist in der Regel möglich. Sprich uns einfach an — wir finden eine Lösung, die zu deinem Tempo und deinen Terminen in Mönchengladbach passt. Wichtig ist uns, dass du dich wohlfühlst und sicher lernst.',
  'Kayıttan sonra eğitmen değiştirebilir miyim?',
  'Genelde evet. Bize yaz veya ara — Mönchengladbach''taki takvimine uygun bir çözüm buluruz. Rahat ve güvenli öğrenmen önemli.',
  'هل يمكن تغيير المدرب بعد التسجيل؟',
  'غالبًا نعم. تواصل معنا لحل يناسب جدولك في مونشنغلادباخ؛ راحتك وتعلمك الآمن أولوية.'
),
(
  'a0000001-0000-4000-8000-00000000000f'::uuid,
  150,
  'klassen',
  'Wie läuft BE (Anhänger) bei euch — und was kostet es ungefähr?',
  'BE erweitert deinen Pkw-Führerschein für schwerere Anhänger-Kombinationen. Umfang und Dauer hängen von deinem Stand ab (ob du schon Erfahrung hast). Die Preisbasis für Fahrstunden entspricht unserem üblichen Stundensatz; wie viele Stunden nötig sind, klären wir nach einer kurzen Einschätzung. Melde dich gern — auch wenn du aus dem Umland von Mönchengladbach kommst.',
  'BE (römork) sizde nasıl işler, maliyet ne olur?',
  'BE, daha ağır römork kombinasyonları için genişletir. Süre ve kapsam deneyimine bağlıdır. Ders ücreti standart saatlik ücretle; kaç saat gerektiğini kısa değerlendirmede konuşuruz. Mönchengladbach çevresinden de bekleriz.',
  'كيف يعمل BE (المقطورة) وتكلفته التقريبية؟',
  'BE يوسع الرخصة لمقطورات أثقل؛ المدة تعتمد على خبرتك. سعر الساعة كالمعتاد؛ نحدد عدد الساعات بعد تقييم قصير. نرحب بك من مونشنغلادباخ والجوار.'
),
(
  'a0000001-0000-4000-8000-000000000010'::uuid,
  160,
  'preise',
  'Was ist nicht in der Online-Anmeldung (Anmeldepaket) enthalten?',
  'In der Regel umfasst das Paket bei uns die Anmeldegebühr und die Lern-App — nicht aber die einzelnen Fahrstunden (die werden nach Bedarf abgerechnet), nicht die TÜV-Gebühren für Theorie- und Praxisprüfung und nicht der Erste-Hilfe-Kurs. So bleibt es übersichtlich: Du siehst im Preisrechner, wie sich dein Gesamtbild aus Anmeldung, App, Stunden und typischen Nebenkosten zusammensetzt.',
  'Online kayıt paketine neler dahil değil?',
  'Paket genelde kayıt ücreti ve öğrenme uygulamasını kapsar; direksiyon dersleri (ihtiyaca göre), TÜV sınav ücretleri ve ilk yardım kursu ayrıdır. Hesap makinesinde toplam tabloyu görebilirsin.',
  'ما الذي لا يشمله باقة التسجيل عبر الإنترنت؟',
  'غالبًا رسوم التسجيل والتطبيق فقط؛ لا ساعات القيادة الفردية ولا رسوم TÜV ولا دورة الإسعافات. راجع حاسبة الأسعار للصورة الكاملة.'
),
(
  'a0000001-0000-4000-8000-000000000011'::uuid,
  170,
  'klassen',
  'Wie viele Fahrstunden brauche ich ungefähr für Klasse B?',
  'Das ist sehr individuell. Als grobe Orientierung: sehr schnelle Lerner:innen kommen manchmal mit deutlich weniger Stunden aus, viele liegen im Mittelfeld, manche brauchen mehr Wiederholung und Sicherheit. Rechne im Kopf lieber mit einem realistischen Mittelweg — unser Team in Mönchengladbach gibt dir nach den ersten Fahrten ehrliches Feedback. Jede Stunde kostet 65 € inkl. MwSt.',
  'B sınıfı için yaklaşık kaç direksiyon saati gerekir?',
  'Kişiye göre değişir. Hızlı öğrenenler daha az, çoğu orta banda, bazıları daha fazla tekrar ister. Mönchengladbach''taki ekibimiz ilk derslerden sonra dürüst geri bildirim verir. Saat başı 65 € KDV dahil.',
  'كم ساعة قيادة أحتاج تقريبًا للصنف B؟',
  'يختلف حسب الشخص؛ سريعو التعلم أقل ساعات وكثيرون في الوسط وبعضهم يحتاج تكرارًا. الفريق يعطيك ملاحظات صادقة بعد الدروس الأولى. الساعة 65 € شامل الضريبة.'
)
on conflict (id) do update set
  sort_order = excluded.sort_order,
  category = excluded.category,
  question_de = excluded.question_de,
  answer_de = excluded.answer_de,
  question_tr = excluded.question_tr,
  answer_tr = excluded.answer_tr,
  question_ar = excluded.question_ar,
  answer_ar = excluded.answer_ar;
