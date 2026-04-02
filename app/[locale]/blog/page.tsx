import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import Image from 'next/image';
import Link from 'next/link';
import { getPosts, getPostImageUrl } from '@/lib/sanity-blog';
import { Link as NavLink } from '@/i18n/navigation';
import { buildPageMetadata, type Locale } from '@/lib/seo';
import { staticPageMeta } from '@/lib/seo-static-pages';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const l = (locale as Locale) || 'de';
  const m = staticPageMeta('blog', l);
  return buildPageMetadata({ locale: l, path: '/blog', title: m.title, description: m.description });
}

export default async function BlogPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const posts = await getPosts();

  return (
    <main className="min-h-screen bg-bg px-4 pt-16 pb-16 text-text max-md:pb-[calc(5.5rem+env(safe-area-inset-bottom)+4rem)]">
      <div className="mx-auto max-w-4xl">
        <h1 className="font-heading text-4xl font-bold uppercase italic text-white">
          Blog & Tipps
        </h1>
        <p className="mt-4 text-text-muted">
          {posts.length > 0
            ? `Artikel aus dem Sanity CMS. ${posts.length} ${posts.length === 1 ? 'Artikel' : 'Artikel'}.`
            : 'Keine Artikel vorhanden. Sanity CMS anbinden mit NEXT_PUBLIC_SANITY_PROJECT_ID.'}
        </p>

        {posts.length > 0 && (
          <ul className="mt-10 space-y-8">
            {posts.map((post) => {
              const imgUrl = getPostImageUrl(post);
              return (
                <li key={post._id}>
                  <Link
                    href={locale === 'de' ? `/blog/${post.slug}` : `/${locale}/blog/${post.slug}`}
                    className="block overflow-hidden rounded-xl border border-white/10 bg-card transition-colors hover:border-green-500/40"
                  >
                    {imgUrl && (
                      <div className="relative h-48 w-full">
                        <Image
                          src={imgUrl}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="(max-width: 896px) 100vw, 896px"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <time className="font-body text-xs text-text-muted">
                        {post.publishedAt
                          ? new Date(post.publishedAt).toLocaleDateString(
                              locale === 'de' ? 'de-DE' : 'en-GB',
                              { dateStyle: 'long' }
                            )
                          : ''}
                      </time>
                      <h2 className="mt-2 font-heading text-xl font-bold italic text-white">
                        {post.title}
                      </h2>
                      {post.excerpt && (
                        <p className="mt-2 font-body text-text-muted line-clamp-2">
                          {post.excerpt}
                        </p>
                      )}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}

        <NavLink href="/" className="mt-10 inline-block text-green-500 underline">
          Zur Startseite
        </NavLink>
      </div>
    </main>
  );
}
