import { getCollection } from 'astro:content';

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

export async function getAllProjectTags() {
  const projects = await getCollection('projects');

  const repeatedTags = projects.reduce((acc, project) => {
    return [...acc, ...getProjectTags(project)];
  }, []);

  const uniqueTags = [...new Set(repeatedTags)];

  uniqueTags.sort();

  return uniqueTags;
}

export async function getProjectsByTag(tag) {
  const projects = await getCollection('projects');

  const allProjects = projects.filter((project) =>
    getProjectTags(project).includes(tag)
  );

  allProjects.sort((a, b) => a.data.title.localeCompare(b.data.title));

  return allProjects;
}

export async function getProjectsByStudent(studentId) {
  const projects = await getCollection('projects');

  const allProjects = projects.filter(({ data: { owners } }) => {
    return owners.some((id) => id === studentId);
  });

  allProjects.sort((a, b) => a.data.title.localeCompare(b.data.title));

  return allProjects;
}
