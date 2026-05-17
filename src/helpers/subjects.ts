import { getCollection, type CollectionEntry } from 'astro:content';

export const subjects = await getCollection('subjects');

export function getSubject(id: string) {
  return subjects.find(
    (subject: CollectionEntry<'subjects'>) => subject?.data?.id === id
  );
}
