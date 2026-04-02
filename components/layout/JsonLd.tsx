import { getSiteData } from '@/lib/site-data';
import { buildDrivingSchoolSchema } from '@/lib/build-driving-school-schema';

/** Server: DrivingSchool-Schema inkl. Reviews (aus Backoffice-Zitaten, sonst Fallback). */
export default async function JsonLd() {
  let quotes = undefined;
  try {
    const data = await getSiteData();
    quotes = data.settings.google_review_quotes;
  } catch {
    // z. B. Build ohne Supabase
  }
  const jsonLd = buildDrivingSchoolSchema(quotes);
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
