import type { CollectionEntry } from 'astro:content';
import type { SubjectProject } from '@/content/config';
import { getCollection } from 'astro:content';
import { getOccupationId } from './people';
import { isSubjectProject } from './projects';

const courses = await getCollection('courses');

export function getCourseByAbbreviation(abbreviation: string) {
  return courses.find(
    (course: CollectionEntry<'courses'>) =>
      course?.data?.abbreviation === abbreviation
  );
}

export function getFirstCourseByPeople(person: CollectionEntry<'people'>) {
  const { occupations } = person.data;

  const studentOccupation = occupations.find(
    (occupation) => occupation.type === 'student'
  );

  if (studentOccupation) {
    const { course } = studentOccupation;

    return course;
  } else {
    return occupations[0].type;
  }
}

export function getSubjectByProject(project: CollectionEntry<'projects'>) {
  const subjects: string[] = [];

  if (isSubjectProject(project)) {
    const {
      data: {
        category: { subject, semester },
      },
    } = project as { data: { category: SubjectProject } };

    return `${subject}-${semester}`;
  }
}

export function getSemesterCourses(semesters: string[]) {
  const result = {};

  semesters.forEach((semester) => {
    const [course, period] = semester.split('-');

    if (!result[course]) {
      result[course] = [];
    }

    result[course].push(period);
  });

  // sort semesters
  Object.keys(result).forEach((course) => {
    result[course].sort((a, b) => {
      const [aYear, aSemester] = a.split('.');
      const [bYear, bSemester] = b.split('.');

      if (aYear === bYear) {
        return bSemester - aSemester;
      }

      return bYear - aYear;
    });
  });

  return result;
}

export function getCourseName(tag: string) {
  const [abbreviation, semester] = tag.split('-');

  const course = getCourseByAbbreviation(abbreviation);

  const courseName = `${course?.data?.level?.compact} em ${course?.data?.name}`;

  if (semester) {
    return `${courseName} (${semester})`;
  } else if (course) {
    return courseName;
  } else {
    return abbreviation;
  }
}

export function getCourseAbbreviationByOccupation(occupation) {
  const { course, id } = occupation;

  return `${course}-${getOccupationId(occupation)}`;
}

export function getCourseAbbreviationCampusByOccupation(occupation) {
  const { course, id, campus } = occupation;

  const [, city] = campus.split('-');

  return `${course}-${city}-${getOccupationId(occupation)}`;
}
