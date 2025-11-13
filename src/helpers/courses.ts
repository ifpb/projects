
export const courseLevels = ['técnico', 'graduação', 'mestrado', 'doutorado'];

export const courses = [
  {
    data: {
      id: 'rc',
      abbreviation: 'RC',
      name: 'Redes de Computadores',
      level: { compact: 'Técnico' },
    },
  },
  {
    data: {
      id: 'si',
      abbreviation: 'SI',
      name: 'Sistemas para Internet',
      level: { compact: 'Graduação' },
    },
  },
];

export function getCourse(id: string) {
  return courses.find((course) => course.data.id === id);
}

export function getCourseByAbbreviation(abbreviation: string) {
  return courses.find(
    (course) =>
      course.data.abbreviation.toLowerCase() === abbreviation.toLowerCase()
  );
}

export function getFirstCourseByPeople(person: any) {
  const { occupations } = person?.data || {};
  const studentOccupation = occupations?.find(
    (occupation: any) => occupation.type === 'student'
  );

  return studentOccupation ? studentOccupation.course : occupations?.[0]?.type;
}

export function getLastLevelCourseByPeople(person: any) {
  const { occupations } = person?.data || {};
  const studentOccupations = occupations?.filter(
    (occupation: any) => occupation.type === 'student'
  );

  if (studentOccupations?.length > 0) {
    const sortedOccupations = studentOccupations.sort((a: any, b: any) => {
      return (
        courseLevels.indexOf(
          getCourseByAbbreviation(b.course)?.data.level.compact
            .split(' ')[0]
            .toLowerCase()
        ) -
        courseLevels.indexOf(
          getCourseByAbbreviation(a.course)?.data.level.compact
            .split(' ')[0]
            .toLowerCase()
        )
      );
    });

    const lastCourse = getCourseByAbbreviation(sortedOccupations[0].course)
      ?.data.level.compact.split(' ')[0]
      .toLowerCase();

    return lastCourse;
  }
}

export function getLastCourseLevelIndexByPeople(person: any) {
  const lastCourse = getLastLevelCourseByPeople(person);
  const index = courseLevels.indexOf(lastCourse);
  return index !== -1 ? index : 0;
}

export function getSubjectByProject(project: any) {
  if (project?.data?.category?.subject) {
    const { subject, semester } = project.data.category;
    return `${subject}-${semester}`;
  }
}

export function getSemesterCourses(semesters: string[]) {
  const result: Record<string, string[]> = {};

  semesters.forEach((semester) => {
    const [course, period] = semester.split('-');

    if (!result[course]) {
      result[course] = [];
    }

    result[course].push(period);
  });

  Object.keys(result).forEach((course) => {
    result[course].sort((a, b) => {
      const [aYear, aSemester] = a.split('.');
      const [bYear, bSemester] = b.split('.');

      if (aYear === bYear) {
        return parseInt(bSemester) - parseInt(aSemester);
      }

      return parseInt(bYear) - parseInt(aYear);
    });
  });

  return result;
}

export function getCourseName(tag: string) {
  const [abbreviation, semester] = tag.split('-');
  const course = getCourseByAbbreviation(abbreviation);
  const courseName = `${course?.data?.level?.compact} em ${course?.data?.name}`;

  if (semester) return `${courseName} | ${semester}`;
  else if (course) return courseName;
  else return abbreviation;
}

export function getCourseAbbreviationByOccupation(occupation: any) {
  const { course, id } = occupation;
  return `${course}-${id}`;
}

export function getCourseAbbreviationCampusByOccupation(occupation: any) {
  const { course, id, campus } = occupation;
  const [, city] = campus.split('-');
  return `${course}-${city}-${id}`;
}