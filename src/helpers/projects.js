export function getProjectTags(project) {
  const tags = [
    project.data.subject,
    `${project.data.subject}-${project.data.semester}`,
    `${project.data.course}-${project.data.campus}`,
    ...project.data.tags,
  ];

  tags.sort();

  return tags;
}

export function getAllProjectsTags(projects) {
  const tags = projects.reduce((acc, project) => {
    return [...acc, ...getProjectTags(project)];
  }, []);

  return [...new Set(tags)];
}

export function getProjectsByTag(projects, tag) {
  return projects.filter((project) => getProjectTags(project).includes(tag));
}
