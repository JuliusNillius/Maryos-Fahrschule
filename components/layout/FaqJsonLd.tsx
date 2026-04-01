import { SITE_URL } from '@/lib/seo';
import type { FaqItem } from '@/lib/site-data';

type Props = {
  faq: FaqItem[];
  locale: string;
};

/** FAQPage-Schema für Google (Rich Results), basierend auf sichtbaren FAQ-Einträgen. */
export default function FaqJsonLd({ faq, locale }: Props) {
  if (!faq.length) return null;

  const qKey = locale === 'tr' ? 'question_tr' : locale === 'ar' ? 'question_ar' : 'question_de';
  const aKey = locale === 'tr' ? 'answer_tr' : locale === 'ar' ? 'answer_ar' : 'answer_de';

  const mainEntity = faq.map((item) => {
    const question = (item[qKey as keyof FaqItem] as string) || item.question_de;
    const answer = (item[aKey as keyof FaqItem] as string) || item.answer_de;
    return {
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer.replace(/\s+/g, ' ').trim() },
    };
  });

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${SITE_URL.replace(/\/$/, '')}/${locale}/faq#faqpage`,
    mainEntity,
  };

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
  );
}
