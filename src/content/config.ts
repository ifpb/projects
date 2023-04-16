import { z, defineCollection } from 'astro:content';

const peopleCollection = defineCollection({
  schema: z.object({
    id: z.number(),
    name: z.object({
      compact: z.string(),
      full: z.string(),
    }),
    avatar: z.string().url(),
    courses: z.array(
      z.object({
        id: z.number(),
        type: z.enum(['student', 'professor']),
        campus: z.string(),
        isFinished: z.boolean().optional(),
      })
    ),
    addresses: z.object({
      github: z.string().url(),
      linkedin: z.string().url(),
      twitter: z.string().url().optional(),
      stackoverflow: z.string().url().optional(),
      lattes: z.string().email().optional(),
      researchgate: z.string().email().optional(),
      instagram: z.string().email().optional(),
      email: z.string().email().optional(),
    }),
  }),
});

const projectCollection = defineCollection({
  schema: z.object({
    name: z.string(),
    description: z.string(),
    preview: z.string().url(),
    page: z.string().url(),
    repository: z.string().url(),
    category: z.object({
      type: z.enum(['subject', 'research', 'extension', 'open source']),
      campus: z.string(),
      semester: z.number().optional(),
      subject: z.string().optional(),
      course: z.string().optional(),
    }),
    tags: z.array(z.string()),
    owners: z.array(z.number()),
  }),
});

export const collections = {
  people: peopleCollection,
  projects: projectCollection,
};
