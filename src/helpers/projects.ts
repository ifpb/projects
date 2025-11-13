import type { CollectionEntry } from 'astro:content';
import type { SubjectProject } from '@/content/config';
import { getCollection } from 'astro:content';
import { getPeopleByProject } from '@/helpers/people';

export function isSubjectProject(project: CollectionEntry<'projects'>) {
  return project.data.category.type === 'subject';
}

export function isResearchProject(project: CollectionEntry<'projects'>) {
  return project.data.category.type === 'research';
}

export function isExtensionProject(project: CollectionEntry<'projects'>) {
  return project.data.category.type === 'extension';
}

export function getProjectId(project: CollectionEntry<'projects'>) {
  const repository = Array.isArray(project.data.addresses.repository)
    ? project.data.addresses.repository[0]
    : project.data.addresses.repository;

  return repository
    .split(/(github|gitlab).com\//)
    .at(-1)
    .replace('/', '-');
}

export function getProjectTags(project: CollectionEntry<'projects'>) {
  if (isSubjectProject(project)) {
    const {
      data: {
        category: { type, subject, period },
        addresses: { design, workflow },
        tags,
      },
    } = project as {
      data: {
        category: SubjectProject;
        tags: string[];
        addresses: { design?: string; workflow?: string };
      };
    };

    const projectTags = tags;

    projectTags.sort();

    if (design) {
      projectTags.unshift('design');
    }

    if (workflow) {
      projectTags.unshift('workflow');
    }

    // Handle both single subject (string) and multiple subjects (array)
    const subjects = Array.isArray(subject) ? subject : [subject];

    // Add tags for all subjects
    subjects.forEach((sub) => {
      const [subjectName, course, campus] = sub.split('-');
      projectTags.unshift(sub, `${sub}-${period}`, `${course}-${campus}`);
    });

    // Add the type tag
    projectTags.unshift(type);

    return projectTags;
  } else {
    const {
      data: {
        tags,
        category,
        addresses: { design, workflow },
      },
    } = project;

    const projectTags = [...tags];

    projectTags.sort();

    if (design) {
      projectTags.unshift('design');
    }

    if (workflow) {
      projectTags.unshift('workflow');
    }

    // Add type and campus for non-subject projects
    projectTags.unshift(category.type);
    if ('campus' in category && category.campus) {
      projectTags.unshift(category.campus);
    }

    return projectTags;
  }
}

export function getProjectTagGroups(project: CollectionEntry<'projects'>) {
  if (isSubjectProject(project)) {
    const { subject, period } = project.data.category as SubjectProject;

    // Handle both single subject (string) and multiple subjects (array)
    const subjects = Array.isArray(subject) ? subject : [subject];

    // Get all unique courses from subjects
    const courses = subjects.map((sub) => {
      const [subjectName, course, campus] = sub.split('-');
      return `${course}-${campus}`;
    });
    const uniqueCourses = [...new Set(courses)];

    // Get all subject-period combinations
    const subjectPeriods = subjects.map((sub) => `${sub}-${period}`);

    const projectTags = {
      tags: {
        name: 'tags',
        values: project.data.tags,
      },
      subject: {
        name: 'disciplina',
        values: subjects,
      },
      period: {
        label: 'Período',
        values: subjectPeriods,
      },
      course: {
        name: 'curso',
        values: uniqueCourses,
      },
    };

    return projectTags;
  } else {
    const projectTags = {
      tags: {
        name: 'tags',
        values: project.data.tags,
      },
    };

    return projectTags;
  }
}

export async function getAllProjectTags() {
  const projects = await getCollection('projects');

  const repeatedTags = projects.reduce((acc: string[], project) => {
    return [...acc, ...getProjectTags(project)];
  }, []);

  const uniqueTags = [...new Set(repeatedTags)];

  uniqueTags.sort();

  return uniqueTags;
}

export async function getAllProjectTagGroups() {
  const projects = await getCollection('projects');

  const tags = projects.reduce((acc, project) => {
    const tagGroups = getProjectTagGroups(project);

    for (const key in tagGroups) {
      const values = acc[key]
        ? [...acc[key].values, ...tagGroups[key].values]
        : tagGroups[key].values;

      acc[key] = {
        name: tagGroups[key].name,
        values: [...new Set(values)].sort(),
      };
    }

    return acc;
  }, {});

  return tags;
}

function sortProjects(
  a: CollectionEntry<'projects'>,
  b: CollectionEntry<'projects'>
) {
  const hasPreview = (project: CollectionEntry<'projects'>) =>
    !!project.data.addresses.preview;

  const getPeriod = (project: CollectionEntry<'projects'>) => {
    if (project.data.category.type === 'subject') {
      return project.data.category.period;
    }
    return 0;
  };

  return (
    Number(hasPreview(b)) - Number(hasPreview(a)) ||
    Number(isResearchProject(b)) - Number(isResearchProject(a)) ||
    Number(isExtensionProject(b)) - Number(isExtensionProject(a)) ||
    Number(isSubjectProject(a)) - Number(isSubjectProject(b)) ||
    getPeriod(a) - getPeriod(b) ||
    a.data.name.localeCompare(b.data.name)
  );
}

export async function getProjects() {
  const projects = await getCollection('projects');

  projects.sort(sortProjects);

  return await Promise.all(
    projects.map(async (project) => ({
      ...project,
      people: await getPeopleByProject(project),
    }))
  );
}

export async function getProjectsByTag(tag: string) {
  const projects = await getCollection('projects');

  const filteredProjects = projects.filter((project) =>
    getProjectTags(project).includes(tag)
  );

  filteredProjects.sort(sortProjects);

  return await Promise.all(
    filteredProjects.map(async (project) => ({
      ...project,
      people: await getPeopleByProject(project),
    }))
  );
}

export async function getProjectsByPerson(person: CollectionEntry<'people'>) {
  const projects = await getCollection('projects');

  const ids = person.data.occupations.map((occupation) => occupation.id);

  const filteredProjects = projects.filter(({ data: { owners } }) => {
    return owners.some((id) => ids.includes(id));
  });

  filteredProjects.sort(sortProjects);

  return await Promise.all(
    filteredProjects.map(async (project) => ({
      ...project,
      people: await getPeopleByProject(project),
    }))
  );
}
