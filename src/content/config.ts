import { z, defineCollection } from 'astro:content';

export type SubjectProject = z.infer<typeof subjectProjectCategory>;
export type ResearchProject = z.infer<typeof subjectProjectCategory>;
export type ExtensionProject = z.infer<typeof subjectProjectCategory>;
export type OpenSourceProject = z.infer<typeof subjectProjectCategory>;
export type ProjectCategory =
  | SubjectProject
  | ResearchProject
  | ExtensionProject
  | OpenSourceProject;

export type Professor = z.infer<typeof professorOccupation>;
export type Employee = z.infer<typeof employeeOccupation>;
export type Student = z.infer<typeof studentOccupation>;
export type Occupation = Student | Professor | Employee;

export type Address = z.infer<typeof addresses>;

const id = z.number().refine((num) => {
  const length = num.toString().length;

  return [12, 11, 7, 6].includes(length);
});

export const cities = {
  jp: 'João Pessoa',
  cg: 'Campina Grande',
  gb: 'Guarabira',
  cz: 'Cajazeiras',
};

export const campi = {
  'ifpb-jp': 'João Pessoa',
  'ifpb-cg': 'Campina Grande',
  'ifpb-gb': 'Guarabira',
  'ifpb-cz': 'Cajazeiras',
  reitoria: 'Reitoria',
};

export const abbreviationCourses = [
  'cmpti',
  'csbee',
  'csbes',
  'cstads',
  'cstrc',
  'cstsi',
  'cstt',
  'ctie',
  'ctii',
  'ctim',
] as const;

const campusCode = Object.keys(campi) as [keyof typeof campi];

const campus = z.enum(campusCode);

const course = z.enum([...abbreviationCourses]);

const addresses = z.object({
  github: z.string().url().optional(),
  gitlab: z.string().url().optional(),
  linkedin: z.string().url().optional(),
  homepage: z.string().optional(),
  medium: z.string().optional(),
  devto: z.string().optional(),
  twitter: z.string().url().optional(),
  bluesky: z.string().url().optional(),
  threads: z.string().url().optional(),
  stackoverflow: z.string().url().optional(),
  lattes: z.string().url().optional(),
  researchgate: z.string().url().optional(),
  orcid: z.string().url().optional(),
  googleScholar: z.string().url().optional(),
  webOfScience: z.string().url().optional(),
  instagram: z.string().url().optional(),
  tiktok: z.string().url().optional(),
  youtube: z.string().url().optional(),
  twitch: z.string().url().optional(),
  email: z.string().email().optional(),
});

// occupation
const professorOccupation = z.object({
  id,
  type: z.literal('professor'),
  campus,
});

const employeeOccupation = z.object({
  id,
  type: z.literal('employee'),
  campus,
});

const studentOccupation = z.object({
  id,
  type: z.literal('student'),
  campus,
  course,
  isFinished: z.boolean(),
});

// project category
const projectCategory = z.object({
  campus,
});

const subjectProjectCategory = projectCategory.extend({
  type: z.literal('subject'),
  subject: z.string(),
  period: z.number(),
  semester: z.number().refine((value) => {
    const regex = /^\d{4}(\.[12])?$/;

    return regex.test(String(value));
  }),
  course,
  campus,
});

const researchProjectCategory = projectCategory.extend({
  type: z.literal('research'),
  campus,
});

const extensionProjectCategory = projectCategory.extend({
  type: z.literal('extension'),
  campus,
});

const openSourceProjectCategory = projectCategory.extend({
  type: z.literal('open source'),
  campus,
});

// collections
const courseCollection = defineCollection({
  type: 'data',
  schema: z.object({
    id: z.string(),
    name: z.string(),
    abbreviation: z.string(),
    department: z.string(),
    status: z.enum(['active', 'inactive']).optional(),
    level: z.object({
      compact: z.string(),
      full: z.string(),
    }),
    campus,
    addresses: addresses.optional(),
  }),
});

const peopleCollection = defineCollection({
  schema: z.object({
    id: id.optional(),
    name: z.object({
      compact: z.string(),
      full: z.string(),
    }),
    avatar: z.object({
      selected: z
        .enum([
          'github',
          'githubUC',
          'researchgate',
          'lattes',
          'linkedin',
          'none',
        ])
        .optional(),
      github: z.string().url().optional(),
      githubUC: z.string().url().optional(),
      researchgate: z.string().url().optional(),
      lattes: z.string().url().optional(),
      linkedin: z.string().url().optional(),
    }),
    occupations: z.array(
      z.union([professorOccupation, employeeOccupation, studentOccupation])
    ),
    addresses: addresses.extend({
      linkedin: z.string().url().optional(),
      github: z.string().url().optional(),
      projects: z.string().optional(),
      figma: z.string().optional(),
    }),
  }),
});

const projectCollection = defineCollection({
  schema: z.object({
    name: z.string(),
    description: z.string(),
    addresses: addresses.extend({
      repository: z.string().url(),
      preview: z.string().url().optional(),
      template: z.string().url().optional(),
    }),
    category: z.union([
      subjectProjectCategory,
      researchProjectCategory,
      extensionProjectCategory,
      openSourceProjectCategory,
    ]),
    tags: z.array(z.string()),
    owners: z.array(id),
  }),
});

const courseWithCityEnum = abbreviationCourses.flatMap((course) =>
  Object.keys(cities).map((city) => `${course}-${city}`)
);

const subjectCollection = defineCollection({
  type: 'data',
  schema: z.object({
    id: z.string(),
    name: z.object({
      compact: z.string(),
      full: z.string(),
    }),
    course: z.enum(courseWithCityEnum as [string, ...string[]]),
    period: z.number(),
  }),
});

export const collections = {
  people: peopleCollection,
  projects: projectCollection,
  courses: courseCollection,
  subjects: subjectCollection,
};
