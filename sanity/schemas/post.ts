/**
 * Sanity Schema: Blog-Post
 * In Sanity Studio (sanity.config.ts) z. B. so einbinden:
 *   import { postSchema } from './sanity/schemas/post';
 *   export default defineConfig({ schema: { types: [postSchema, ...] } });
 */
import { defineType, defineField } from 'sanity';

export const postSchema = defineType({
  name: 'post',
  title: 'Blog Post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Titel',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Kurzbeschreibung',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'mainImage',
      title: 'Hauptbild',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'publishedAt',
      title: 'Veröffentlicht am',
      type: 'datetime',
    }),
    defineField({
      name: 'body',
      title: 'Inhalt',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'Überschrift 2', value: 'h2' },
            { title: 'Überschrift 3', value: 'h3' },
          ],
        },
      ],
    }),
  ],
  preview: {
    select: { title: 'title', media: 'mainImage' },
    prepare({ title, media }) {
      return { title: title ?? 'Ohne Titel', media };
    },
  },
});
