import { getCollection } from 'astro:content';

/**
 * Get all unique tags from project files
 * @returns Array of unique tags sorted alphabetically
 */
export async function getAllProjectTags(): Promise<string[]> {
  try {
    const projects = await getCollection('projects');
    const allTags = new Set<string>();

    projects.forEach((project) => {
      if (project.data.tags && Array.isArray(project.data.tags)) {
        project.data.tags.forEach((tag: string) => {
          if (tag && tag.trim()) {
            allTags.add(tag.trim().toLowerCase());
          }
        });
      }
    });

    return Array.from(allTags).sort();
  } catch (error) {
    console.error('Error fetching project tags:', error);
    return [];
  }
}
