import { getCollection } from 'astro:content';
import { getPeopleByProject } from './people';

export function isSubjectProject(project) {
  return project.data.category.type === 'subject';
}

export function getProjectId(project) {
  return project.data.repository.split('github.com/').at(-1).replace('/', '-');
}

export function getProjectTags(project) {
  const {
    data: {
      category: { subject, semester, course, campus },
      tags,
    },
  } = project;

  const projectTags = tags;

  if (isSubjectProject(project)) {
    projectTags.push(subject, `${subject}-${semester}`, `${course}-${campus}`);
  }

  projectTags.sort();

  return projectTags;
}

export function getProjectTagGroups(project) {
  const {
    data: { subject, semester, course, campus, tags },
  } = project;

  let projectTags = {
    tags: {
      name: 'tags',
      values: tags,
    },
  };

  if (isSubjectProject(project)) {
    projectTags = {
      ...projectTags,
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
  }

  return projectTags;
}

export async function getAllProjectTags() {
  const projects = await getCollection('projects');

  const repeatedTags = projects.reduce((acc, project) => {
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

function sortProjects(a, b) {
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

export async function getProjectsByTag(tag) {
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

export async function getProjectsByPerson(person) {
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
