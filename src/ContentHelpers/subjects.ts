import { getCollection } from 'astro:content';

export async function getSubjects() {
  const subjects = await getCollection('subjects');
  return subjects;
}
