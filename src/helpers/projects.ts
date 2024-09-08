import { SubjectProject } from './../content/config';
import { getCollection } from 'astro:content';
import { getPeopleByProject } from './people';
import type { CollectionEntry } from 'astro:content';

export function isSubjectProject(project: CollectionEntry<'projects'>) {
  return project.data.category.type === 'subject';
}

export function getProjectId(project: CollectionEntry<'projects'>) {
  return project.data.addresses.repository
    .split('github.com/')
    .at(-1)
    .replace('/', '-');
}

export function getProjectTags(project: CollectionEntry<'projects'>) {
  if (isSubjectProject(project)) {
    const {
      data: {
        category: { subject, semester, course, campus },
        tags,
      },
    } = project as { data: { category: SubjectProject; tags: string[] } };

    const projectTags = [
      ...tags,
      subject,
      `${subject}-${semester}`,
      `${course}-${campus}`,
    ];

    projectTags.sort();

    return projectTags;
  } else {
    const {
      data: {
        tags,
        category: { type, campus },
      },
    } = project;

    const projectTags = [...tags, type, campus];

    projectTags.sort();

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
  return a.data.name.localeCompare(b.data.name);
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
