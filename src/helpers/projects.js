import { getCollection } from 'astro:content';
import { getStudentsByProject } from './students';

export function getProjectId(project) {
  return project.data.repository.split('github.com/').at(-1).replace('/', '-');
}

export function getProjectTags(project) {
  const {
    data: { subject, semester, course, campus, tags },
  } = project;

  const projectTags = [
    subject,
    `${subject}-${semester}`,
    `${course}-${campus}`,
    ...tags,
  ];

  projectTags.sort();

  return projectTags;
}

export function getProjectTagGroups(project) {
  const {
    data: { subject, semester, course, campus, tags },
  } = project;

  const projectTags = {
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
    tags: {
      name: 'tags',
      values: tags,
    },
  };

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
  return a.data.title.localeCompare(b.data.title);
}

export async function getProjects() {
  const projects = await getCollection('projects');

  projects.sort(sortProjects);

  return await Promise.all(
    projects.map(async (project) => ({
      ...project,
      students: await getStudentsByProject(project),
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
      students: await getStudentsByProject(project),
    }))
  );
}

export async function getProjectsByStudent(student) {
  const projects = await getCollection('projects');

  const ids = student.data.courses.map((student) => student.id);

  const filteredProjects = projects.filter(({ data: { owners } }) => {
    return owners.some((id) => ids.includes(id));
  });

  filteredProjects.sort(sortProjects);

  return await Promise.all(
    filteredProjects.map(async (project) => ({
      ...project,
      students: await getStudentsByProject(project),
    }))
  );
}
