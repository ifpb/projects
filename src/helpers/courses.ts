import type { CollectionEntry } from 'astro:content';
import type { SubjectProject } from '@/content.config';
import { getCollection } from 'astro:content';
import { getOccupationId } from '@/helpers/people';
import { isSubjectProject } from '@/helpers/projects';
import { courseLevels, getPeriodCourses } from '@/lib/taxonomy';

export { courseLevels, getPeriodCourses };

export const courses = await getCollection('courses');

export function getCourse(id: string) {
  return courses.find(
    (course: CollectionEntry<'courses'>) => course?.data?.id === id,
  );
}

export function getCourseByAbbreviation(abbreviation: string) {
  // Extract course part if it includes campus (e.g., "cstsi-jp" -> "cstsi")
  const courseAbbreviation = abbreviation.includes('-')
    ? abbreviation.split('-')[0]
    : abbreviation;

  return courses.find(
    (course: CollectionEntry<'courses'>) =>
      course?.data?.abbreviation === courseAbbreviation,
  );
}

export function getFirstCourseByPeople(person: CollectionEntry<'people'>) {
  const { occupations } = person.data;

  const studentOccupation = occupations.find(
    (occupation) => occupation.type === 'student',
  );

  if (studentOccupation) {
    const { course } = studentOccupation;

    return course;
  } else {
    return occupations[0].type;
  }
}

export function getLastLevelCourseByPeople(person: CollectionEntry<'people'>) {
  const { occupations } = person.data;

  const studentOccupations = occupations.filter(
    (occupation) => occupation.type === 'student',
  );

  if (studentOccupations.length > 0) {
    const sortedOccupations = studentOccupations.sort((a, b) => {
      return (
        courseLevels.indexOf(
          getCourseByAbbreviation(b.course)
            ?.data.level.compact.split(' ')[0]
            .toLocaleLowerCase(),
        ) -
        courseLevels.indexOf(
          getCourseByAbbreviation(a.course)
            ?.data.level.compact.split(' ')[0]
            .toLocaleLowerCase(),
        )
      );
    });

    const lastCourse = getCourseByAbbreviation(sortedOccupations[0].course)
      ?.data.level.compact.split(' ')[0]
      .toLocaleLowerCase();

    return lastCourse;
  }
}

export function getLastCourseLevelIndexByPeople(
  person: CollectionEntry<'people'>,
) {
  const lastCourse = getLastLevelCourseByPeople(person);

  const index = courseLevels.indexOf(lastCourse);

  return index !== -1 ? index : 0;
}

export function getSubjectByProject(project: CollectionEntry<'projects'>) {
  if (isSubjectProject(project)) {
    const {
      data: {
        category: { subject, period },
      },
    } = project as { data: { category: SubjectProject } };

    // Handle both single subject (string) and multiple subjects (array)
    const subjects = Array.isArray(subject) ? subject : [subject];

    // Return array of subject-period combinations
    return subjects.map((subj) => `${subj}-${period}`);
  }
  return [];
}

export function getCourseName(tag: string) {
  // Handle different tag formats:
  // 1. course-campus (e.g., "cstsi-jp")
  // 2. course-campus-period (e.g., "cstsi-jp-2024.1")
  // 3. subject-course-campus-period (e.g., "dw-cstrc-jp-2022.2")

  const parts = tag.split('-');

  // Check if it's a subject-course-campus-period format
  if (parts.length === 4) {
    const [subject, courseAbbr, campus, period] = parts;
    const courseFull = `${courseAbbr}-${campus}`;
    const course = getCourseByAbbreviation(courseFull);
    const courseName = `${course?.data?.level?.compact} em ${course?.data?.name}`;

    if (course) {
      return `${courseName} | ${campus.toUpperCase()} | ${period}`;
    } else {
      return tag;
    }
  }

  // Check if it's a course-campus-period format
  if (parts.length === 3) {
    const [courseAbbr, campus, period] = parts;
    const courseFull = `${courseAbbr}-${campus}`;
    const course = getCourseByAbbreviation(courseFull);
    const courseName = `${course?.data?.level?.compact} em ${course?.data?.name}`;

    if (course) {
      return `${courseName} | ${campus.toUpperCase()} | ${period}`;
    } else {
      return tag;
    }
  }

  // Original logic for course-campus or simple course format
  const [abbreviation, period] = parts;
  const course = getCourseByAbbreviation(abbreviation);

  if (course) {
    const courseName = `${course?.data?.level?.compact} em ${course?.data?.name}`;

    if (period) {
      return `${courseName} | ${period.toUpperCase()}`;
    } else {
      return courseName;
    }
  } else {
    return abbreviation;
  }
}

export function getCourseAbbreviationByOccupation(occupation) {
  const { course, id } = occupation;

  return `${course}-${getOccupationId(occupation)}`;
}

export function getCourseAbbreviationCampusByOccupation(occupation) {
  const { course, id } = occupation;

  if (!course) {
    // For non-student occupations that might not have course
    return `${getOccupationId(occupation)}`;
  }

  // Extract campus from course string (e.g., "cstsi-jp" -> "jp")
  const [courseAbbr, campus] = course.split('-');

  return `${courseAbbr}-${campus}-${getOccupationId(occupation)}`;
}
