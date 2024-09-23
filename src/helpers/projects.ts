import type { CollectionEntry } from 'astro:content';
import type { SubjectProject } from './../content/config';
import { getCollection } from 'astro:content';
import { getPeopleByProject } from './people';

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
  return project.data.addresses.repository
    .split(/(github|gitlab).com\//)
    .at(-1)
    .replace('/', '-');
}

export function getProjectTags(project: CollectionEntry<'projects'>) {
  if (isSubjectProject(project)) {
    const {
      data: {
        category: { type, subject, semester, course, campus },
        addresses: { template },
        tags,
      },
    } = project as {
      data: {
        category: SubjectProject;
        tags: string[];
        addresses: { template?: string };
      };
    };

    const projectTags = tags;

    projectTags.sort();

    if (template) {
      projectTags.unshift('figma');
    }

    projectTags.unshift(
      type,
      subject,
      `${subject}-${semester}`,
      `${course}-${campus.split('-')[1]}`
    );

    return projectTags;
  } else {
    const {
      data: {
        tags,
        category: { type, campus },
        addresses: { template },
      },
    } = project;

    const projectTags = tags;

    projectTags.sort();

    if (template) {
      projectTags.unshift('figma');
    }

    projectTags.unshift(type, campus);

    return projectTags;
  }
}

export function getProjectTagGroups(project: CollectionEntry<'projects'>) {
  if (isSubjectProject(project)) {
    const { subject, semester, course, campus } = project.data
      .category as SubjectProject;

    const projectTags = {
      tags: {
        name: 'tags',
        values: project.data.tags,
      },
      subject: {
        name: 'disciplina',
        values: [subject],
      },
      semester: {
        name: 'semestre',
        values: [`${subject}-${semester}`],
      },
      course: {
        name: 'curso',
        values: [`${course}-${campus}`],
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

  const getPeriod = (project: CollectionEntry<'projects'>) =>
    project.data.category.type === 'subject' && project.data.category.period;

  const getSemester = (project: CollectionEntry<'projects'>) =>
    project.data.category.type === 'subject' && project.data.category.semester;

  return (
    Number(isResearchProject(b)) - Number(isResearchProject(a)) ||
    Number(isExtensionProject(b)) - Number(isExtensionProject(a)) ||
    Number(isSubjectProject(a)) - Number(isSubjectProject(b)) ||
    Number(hasPreview(b)) - Number(hasPreview(a)) ||
    getPeriod(b) - getPeriod(a) ||
    getSemester(a) - getSemester(b) ||
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
