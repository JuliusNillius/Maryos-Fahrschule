import { setRequestLocale } from 'next-intl/server';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getPostBySlug, getPostImageUrl } from '@/lib/sanity-blog';
import { Link } from '@/i18n/navigation';

type Props = { params: Promise<{ locale: string; slug: string }> };

function renderBody(body: unknown): React.ReactNode {
  if (!body || !Array.isArray(body)) return null;
  return (
    <div className="prose prose-invert mt-6 max-w-none prose-p:text-text-muted">
      {body.map((block: { _type?: string; children?: { text?: string }[] }, i: number) => {
        if (block._type === 'block' && block.children?.length) {
          const text = block.children.map((c) => c.text ?? '').join('');
          if (text) return <p key={i}>{text}</p>;
        }
        return null;
      })}
    </div>
  );
}

export default async function BlogSlugPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const imgUrl = getPostImageUrl(post);

  return (
    <main className="min-h-screen bg-bg px-4 pt-16 pb-16 text-text max-md:pb-[calc(5.5rem+env(safe-area-inset-bottom)+4rem)]">
      <div className="mx-auto max-w-4xl">
        <Link
          href={locale === 'de' ? '/blog' : `/${locale}/blog`}
          className="inline-block text-green-500 underline"
        >
          ← Zurück zum Blog
        </Link>

        <article className="mt-8">
          {imgUrl && (
            <div className="relative h-64 w-full overflow-hidden rounded-xl sm:h-80">
              <Image
                src={imgUrl}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 896px) 100vw, 896px"
                priority
              />
            </div>
          )}
          <time className="mt-6 block font-body text-sm text-text-muted">
            {post.publishedAt
              ? new Date(post.publishedAt).toLocaleDateString(
                  locale === 'de' ? 'de-DE' : 'en-GB',
                  { dateStyle: 'long' }
                )
              : ''}
          </time>
          <h1 className="mt-2 font-heading text-3xl font-bold uppercase italic text-white sm:text-4xl">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="mt-4 font-body text-lg text-text-muted">{post.excerpt}</p>
          )}
          {post.body ? renderBody(post.body) : null}
        </article>
      </div>
    </main>
  );
}
