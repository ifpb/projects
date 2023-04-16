import { z, defineCollection } from 'astro:content';

const occupationProfessor = z.object({
  id: z.number(),
  type: z.literal('professor'),
  campus: z.string(),
});

const occupationEmployee = z.object({
  id: z.number(),
  type: z.literal('employee'),
  campus: z.string(),
});

const occupationStudent = z.object({
  id: z.number(),
  type: z.literal('student'),
  campus: z.string(),
  course: z.string(),
  isFinished: z.boolean().optional(),
});

const peopleCollection = defineCollection({
  schema: z.object({
    id: z.number(),
    name: z.object({
      compact: z.string(),
      full: z.string(),
    }),
    avatar: z.string().url(),
    occupations: z.array(
      z.union([occupationProfessor, occupationStudent, occupationEmployee])
    ),
    addresses: z.object({
      github: z.string().url(),
      linkedin: z.string().url(),
      twitter: z.string().url().optional(),
      stackoverflow: z.string().url().optional(),
      lattes: z.string().url().optional(),
      researchgate: z.string().url().optional(),
      instagram: z.string().url().optional(),
      email: z.string().email().optional(),
    }),
  }),
});

const subjectProject = z.object({
  type: z.literal('subject'),
  subject: z.string(),
  semester: z.number(),
  course: z.string(),
  campus: z.string(),
});

const researchProject = z.object({
  type: z.literal('research'),
  campus: z.string(),
});

const extensionProject = z.object({
  type: z.literal('extension'),
  campus: z.string(),
});

const openSourceProject = z.object({
  type: z.literal('open source'),
  campus: z.string(),
});

const projectCollection = defineCollection({
  schema: z.object({
    name: z.string(),
    description: z.string(),
    preview: z.string().url(),
    page: z.string().url(),
    repository: z.string().url(),
    category: z.union([
      subjectProject,
      researchProject,
      extensionProject,
      openSourceProject,
    ]),
    tags: z.array(z.string()),
    owners: z.array(z.number()),
  }),
});

export const collections = {
  people: peopleCollection,
  projects: projectCollection,
};
