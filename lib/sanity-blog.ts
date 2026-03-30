import { sanityClient, urlFor } from '@/lib/sanity';
import { POSTS_QUERY, POST_BY_SLUG_QUERY } from '@/lib/sanity-queries';

export interface SanityPostListItem {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  mainImage?: { _type: string; asset?: { _ref: string } };
  publishedAt?: string;
}

export interface SanityPost extends SanityPostListItem {
  body?: unknown;
}

export async function getPosts(): Promise<SanityPostListItem[]> {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  if (!projectId) return [];
  try {
    const list = await sanityClient.fetch<SanityPostListItem[]>(POSTS_QUERY);
    return list ?? [];
  } catch {
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<SanityPost | null> {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  if (!projectId) return null;
  try {
    const post = await sanityClient.fetch<SanityPost | null>(POST_BY_SLUG_QUERY, { slug });
    return post ?? null;
  } catch {
    return null;
  }
}

export function getPostImageUrl(post: { mainImage?: { _type: string; asset?: { _ref: string } } }): string | null {
  if (!post.mainImage) return null;
  try {
    return urlFor(post.mainImage).width(800).url();
  } catch {
    return null;
  }
}
