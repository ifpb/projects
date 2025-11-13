import type { CollectionEntry } from 'astro:content';
import type { Student, Occupation } from '@/content/config';
import { getCollection } from 'astro:content';
import { getProjectsByPerson, isSubjectProject } from '@/helpers/projects';
import {
  courses,
  getCourseByAbbreviation,
  getFirstCourseByPeople,
  getSubjectByProject,
  getLastCourseLevelIndexByPeople,
} from '@/helpers/courses';

export function getFirstPersonId(person: CollectionEntry<'people'>) {
  if (isStudent(person)) {
    return person.data.occupations
      .filter((occupation) => occupation.type === 'student')
      .at(-1).id;
  } else {
    return person.data.occupations.at(-1).id;
  }
}

export function getPersonIdByCourse(
  person: CollectionEntry<'people'>,
  course: string
) {
  if (isStudent(person)) {
    return person.data.occupations.filter(
      (occupation: Student) => occupation.course === course
    )[0].id;
  } else {
    return person.data.occupations.at(-1).id;
  }
}

export function getOccupationId(occupation: Occupation) {
  if (occupation.type === 'student') {
    const { course: abbreviation } = occupation;

    const course = getCourseByAbbreviation(abbreviation);

    if (
      ['Técnico Integrado ao Médio', 'Mestrado'].includes(
        course.data.level.compact
      )
    ) {
      return String(occupation.id).slice(0, 4);
    } else {
      const year = String(occupation.id).slice(0, 4);

      const semester = String(occupation.id).slice(4, 5);

      return `${year}.${semester}`;
    }
  } else {
    return String(occupation.id);
  }
}

export function getAvatarImageUrl(person: CollectionEntry<'people'>) {
  const { avatar } = person.data;

  if (avatar.selected === 'none') {
    return 'none';
  }

  return avatar.selected
    ? avatar[avatar.selected]
    : avatar.githubUC || avatar.github;
}

export function isStudent(person: CollectionEntry<'people'>) {
  return person.data.occupations.some(
    (occupation) => occupation.type === 'student'
  );
}

export function isProfessor(person: CollectionEntry<'people'>) {
  return person.data.occupations.some(
    (occupation) => occupation.type === 'professor'
  );
}

export function isOnlyProfessor(person: CollectionEntry<'people'>) {
  return isProfessor(person) && !isStudent(person);
}

function hasPersonId(person: CollectionEntry<'people'>, id: number) {
  return person.data.occupations.some((occupation) => occupation.id === id);
}

export function isFinishedSomeCourse(person: CollectionEntry<'people'>) {
  return person.data.occupations.some(
    (occupation: Student) => occupation.isFinished
  );
}

export function hasHomepage(person: CollectionEntry<'people'>) {
  return !!person.data.addresses.homepage;
}

export function hasFigma(person: CollectionEntry<'people'>) {
  return !!person.data.addresses.figma;
}

export function hasResearchGate(person: CollectionEntry<'people'>) {
  return !!person.data.addresses.researchgate;
}

export async function hasProjects(person: CollectionEntry<'people'>) {
  const projects = await getProjectsByPerson(person);

  return !!projects.length;
}

export async function getStudentTags(person: CollectionEntry<'people'>) {
  const tags = [];

  if (isStudent(person)) {
    const courseOccupations = person.data.occupations.filter(
      (occupation) => occupation.type === 'student'
    );

    const courses = courseOccupations.map((occupation) => occupation.course);

    const courseEntries = courseOccupations.map((occupation) =>
      getOccupationId(occupation)
    );

    const courseLevels = courseOccupations.map((occupation) => {
      const course = getCourseByAbbreviation(occupation.course);

      return course.data.level.compact.split(' ')[0].toLocaleLowerCase();
    });

    const coursesByEntry = courseEntries.map(
      (courseEntry, index) => `${courses[index]}-${courseEntry}`
    );

    const subjects = (await getProjectsByPerson(person))
      .filter((project) => isSubjectProject(project))
      .map((project) => getSubjectByProject(project))
      .flat(); // Flatten the array since getSubjectByProject now returns an array

    tags.push(
      'student',
      ...courses,
      ...courseEntries,
      ...courseLevels,
      ...coursesByEntry,
      ...subjects
    );
  }

  if (isFinishedSomeCourse(person)) {
    tags.push('egresso');

    const courses = person.data.occupations
      .filter((occupation: Student) => occupation.isFinished)
      .map((occupation: Student) => [
        `egresso-${occupation.course}-${occupation.campus.split('-')[1]}`,
        `egresso-${occupation.course}`,
      ]);

    tags.push(...courses.flat());
  }

  return tags;
}

export async function getPersonTags(person: CollectionEntry<'people'>) {
  const campi = person.data.occupations.map((occupation) => occupation.campus);

  const tags: string[] = [...campi];

  if (await hasProjects(person)) {
    tags.push('projects');
  }

  if (hasHomepage(person)) {
    tags.push('homepage');
  }

  if (hasFigma(person)) {
    tags.push('figma');
  }

  if (hasResearchGate(person)) {
    tags.push('researchgate');
  }

  if (isProfessor(person)) {
    tags.push('professor');
  }

  const studentTags = await getStudentTags(person);

  tags.push(...studentTags);

  tags.sort();

  return tags;
}

async function getPeopleTagsMap(people: CollectionEntry<'people'>[]) {
  const peopleTags = await Promise.all(
    people.map<Promise<[number, string[]]>>(async (person) => {
      const tags = await getPersonTags(person);

      return [getFirstPersonId(person), tags];
    })
  );

  return new Map(peopleTags);
}

export function getPersonTagGroups(person: CollectionEntry<'people'>) {
  const courses = person.data.occupations
    .filter((occupation) => occupation.type === 'student')
    .map((occupation) => occupation.course);

  const semesters = person.data.occupations
    .filter((occupation) => occupation.type === 'student')
    .map((course) => getOccupationId(course));

  const coursesBySemester = semesters.map(
    (semester, index) => `${courses[index]}-${semester}`
  );

  const tags = {
    course: {
      name: 'curso',
      values: courses,
    },
    semester: {
      name: 'semestre',
      values: coursesBySemester,
    },
  };

  return tags;
}

export async function getAllStudentTags() {
  const people = await getCollection('people');

  const studentTags = await Promise.all(
    people.map(async (person) => {
      return getStudentTags(person);
    })
  );

  const repeatedTags = studentTags.flat();

  const uniqueTags = [...new Set(repeatedTags)];

  uniqueTags.sort();

  return uniqueTags;
}

export async function getAllPersonTags() {
  const people = await getCollection('people');

  const peopleTags = await getPeopleTagsMap(people);

  const repeatedTags = people.reduce((acc: string[], person) => {
    const tags = peopleTags.get(getFirstPersonId(person));

    return [...acc, ...tags];
  }, []);

  const uniqueTags = [...new Set(repeatedTags)];

  uniqueTags.sort();

  return uniqueTags;
}

export async function getAllPeopleTagGroups() {
  const people = await getCollection('people');

  const tags = people.reduce((acc, person) => {
    const tagGroups = getPersonTagGroups(person);

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

// Sort people by graduation status, twitter presence, semester and name
function personRank(person: CollectionEntry<'people'>) {
  const weights = {
    isProfessor: {
      value: 1,
      status: isProfessor(person),
    },
    isFinished: {
      value: 2,
      status: isFinishedSomeCourse(person),
    },
    // hasHomepage: {
    //   value: 1,
    //   status: !!person.data.addresses.homepage,
    // },
  };

  let rank = Object.values(weights).reduce((acc, weight) => {
    return acc + Number(!!Number(weight.status)) * weight.value;
  }, 0);

  if (isProfessor(person) && isFinishedSomeCourse(person)) {
    rank -= 1;
  }

  return rank;
}

const getSortId = (person: CollectionEntry<'people'>) =>
  isOnlyProfessor(person)
    ? 99999
    : Number(String(getFirstPersonId(person)).substring(0, 6));

function sortPeopleByTag(people: CollectionEntry<'people'>[], sortTag: string) {
  const sortPeopleByTag = (
    a: CollectionEntry<'people'>,
    b: CollectionEntry<'people'>
  ) => {
    // professor, researchgate
    if (
      /\w+-\d{4}(\.\d)?/.test(sortTag) ||
      ['professor', 'researchgate'].includes(sortTag)
    ) {
      return a.data.name.compact.localeCompare(b.data.name.compact);
    }

    // course levels
    if (courses.some((course) => sortTag.includes(course.data.abbreviation))) {
      const course = courses
        .map((course) => course.data.abbreviation)
        .filter((course) => sortTag.includes(course))[0];

      return (
        getPersonIdByCourse(a, course) - getPersonIdByCourse(b, course) ||
        a.data.name.compact.localeCompare(b.data.name.compact)
      );
    }

    // projects
    if (sortTag === 'projects') {
      return (
        Number(isProfessor(b)) - Number(isProfessor(a)) || sortPeople(a, b)
      );
    }

    // other tags
    return sortPeople(a, b);
  };

  people.sort(sortPeopleByTag);
}

export function sortPeople(
  a: CollectionEntry<'people'>,
  b: CollectionEntry<'people'>
) {
  return (
    // personRank(b) - personRank(a) ||
    // Number(isOnlyProfessor(a)) - Number(isOnlyProfessor(b)) ||
    // getFirstCourseByPeople(a).localeCompare(getFirstCourseByPeople(b)) ||
    getLastCourseLevelIndexByPeople(b) - getLastCourseLevelIndexByPeople(a) ||
    getSortId(a) - getSortId(b) ||
    a.data.name.compact.localeCompare(b.data.name.compact)
  );
}

export async function getPeople() {
  const people = await getCollection('people');

  people.sort(sortPeople);

  return people;
}

export async function getPeopleByProject(project: CollectionEntry<'projects'>) {
  const people = await getCollection('people');

  const filteredPeople = people.reduce(
    (acc: CollectionEntry<'people'>[], person) => {
      if (project.data.owners.some((ownerId) => hasPersonId(person, ownerId))) {
        return [...acc, person];
      } else {
        return acc;
      }
    },
    []
  );

  filteredPeople.sort(sortPeople);

  return filteredPeople;
}

export async function getPeopleByTag(tag: string) {
  const people = await getCollection('people');

  const peopleTags = await getPeopleTagsMap(people);

  const filteredPeople = people.filter((person) => {
    const tags = peopleTags.get(getFirstPersonId(person));

    return tags.includes(tag);
  });

  sortPeopleByTag(filteredPeople, tag);

  return filteredPeople;
}

export async function getPeopleWithProjects() {
  return await getPeopleByTag('projects');
}
