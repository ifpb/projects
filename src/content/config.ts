import { z, defineCollection } from 'astro:content';

const campus = z.enum(['ifpb-jp', 'ifpb-cg', 'ifpb-gb', 'reitoria']);

const course = z.enum([
  'cstsi',
  'cstrc',
  'csbee',
  'csbes',
  'cmpti',
  'cstt',
  'ctie',
  'ctii',
]);

const occupationProfessor = z.object({
  id: z.number(),
  type: z.literal('professor'),
  campus,
});

const occupationEmployee = z.object({
  id: z.number(),
  type: z.literal('employee'),
  campus,
});

const occupationStudent = z.object({
  id: z.number(),
  type: z.literal('student'),
  campus,
  course,
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
  course,
  campus,
});

const researchProject = z.object({
  type: z.literal('research'),
  campus,
});

const extensionProject = z.object({
  type: z.literal('extension'),
  campus,
});

const openSourceProject = z.object({
  type: z.literal('open source'),
  campus,
});

const workshopProject = z.object({
  type: z.literal('workshop'),
  event: z.string(),
  year: z.number().int(),
  campus,
});

const projectCollection = defineCollection({
  schema: z.object({
    name: z.string(),
    description: z.string(),
    repository: z.string().url(),
    preview: z.string().url().optional(),
    page: z.string().url().optional(),
    category: z.union([
      subjectProject,
      researchProject,
      extensionProject,
      openSourceProject,
      workshopProject,
    ]),
    tags: z.array(z.string()),
    owners: z.array(z.number()),
  }),
});

export const collections = {
  people: peopleCollection,
  projects: projectCollection,
};
