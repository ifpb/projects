/**
 * Módulo puro de taxonomia: cursos, campi, cidades e as buscas usadas pelo filtro.
 *
 * Não importa `astro:content`. É o único módulo desta natureza que pode ser
 * importado por ilhas React — `src/helpers/*` acessam coleções e são server-only.
 */

export const cities = {
  jp: 'João Pessoa',
  cg: 'Campina Grande',
  gb: 'Guarabira',
  cz: 'Cajazeiras',
};

export const campi = {
  'ifpb-jp': 'João Pessoa',
  'ifpb-cg': 'Campina Grande',
  'ifpb-gb': 'Guarabira',
  'ifpb-cz': 'Cajazeiras',
  reitoria: 'Reitoria',
};

export const abbreviationCourses = [
  'cmpti',
  'csbee',
  'csbes',
  'cstads',
  'cstrc',
  'cstsi',
  'cstt',
  'ctie',
  'ctii',
  'ctim',
] as const;

export const courseLevels = ['técnico', 'graduação', 'mestrado', 'doutorado'];

export const courseWithCityEnum = abbreviationCourses.flatMap((course) =>
  Object.keys(cities).map((city) => `${course}-${city}`)
);

/**
 * Formato achatado e serializável das coleções `courses` e `subjects`, usado para
 * levar os dados até o cliente por props em vez de expor a coleção inteira.
 */
export interface CourseInfo {
  id: string;
  name: string;
  abbreviation: string;
  /** Equivale a `course.data.level.compact` (ex.: "Graduação"). */
  level: string;
}

export interface SubjectInfo {
  id: string;
  /** Equivale a `subject.data.name.full`. */
  name: string;
}

export function findCourse(courses: CourseInfo[], id: string) {
  return courses.find((course) => course.id === id);
}

export function findCourseByAbbreviation(
  courses: CourseInfo[],
  abbreviation: string
) {
  // Aceita tanto "cstsi" quanto "cstsi-jp"
  const courseAbbreviation = abbreviation.includes('-')
    ? abbreviation.split('-')[0]
    : abbreviation;

  return courses.find((course) => course.abbreviation === courseAbbreviation);
}

export function findSubject(subjects: SubjectInfo[], id: string) {
  return subjects.find((subject) => subject.id === id);
}

export function getPeriodCourses(periods: string[]) {
  const result: Record<string, string[]> = {};

  periods.forEach((period) => {
    // Split by '-' and take all parts except the last one as course
    // This handles course-campus-period format (e.g., cstads-cz-2008.2)
    const parts = period.split('-');
    const periodValue = parts.pop(); // Remove and get the last part (period)
    const course = parts.join('-'); // Join remaining parts as course-campus

    if (!periodValue) return;

    if (!result[course]) {
      result[course] = [];
    }

    result[course].push(periodValue);
  });

  // sort periods
  Object.keys(result).forEach((course) => {
    result[course].sort((a: string, b: string) => {
      const [aYear, aPeriod] = a.split('.');
      const [bYear, bPeriod] = b.split('.');

      if (aYear === bYear) {
        return Number(bPeriod) - Number(aPeriod);
      }

      return Number(bYear) - Number(aYear);
    });
  });

  return result;
}
