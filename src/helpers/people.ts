import type { CollectionEntry } from 'astro:content';
import type { Student } from '@/content/config';
import { getCollection } from 'astro:content';
import { getProjectsByPerson } from './projects';

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

export function isFinished(person: CollectionEntry<'people'>) {
  return person.data.occupations.some(
    (occupation: Student) => occupation?.isFinished === true
  );
}

export function getStudentSemesterId(id: number) {
  const year = String(id).slice(0, 4);
  const semester = String(id).slice(4, 5);

  return Number(`${year}.${semester}`);
}

function getFirstSemesterCourseId(student: CollectionEntry<'people'>) {
  if (isStudent(student)) {
    const firstId = student.data.occupations
      .filter((occupation) => occupation.type === 'student')
      .map((course) => course.id)
      .sort()[0];

    return firstId;
  }
}

function hasPersonId(person: CollectionEntry<'people'>, id: number) {
  return person.data.occupations.some((occupation) => occupation.id === id);
}

function hasFinishedSomeCourse(person: CollectionEntry<'people'>) {
  return person.data.occupations.some(
    (occupation: Student) => occupation.isFinished
  );
}

async function hasProjects(person: CollectionEntry<'people'>) {
  const projects = await getProjectsByPerson(person);

  return !!projects.length;
}

export async function getPersonTags(person: CollectionEntry<'people'>) {
  const campi = person.data.occupations.map((occupation) => occupation.campus);

  const tags: string[] = [...campi];

  if (await hasProjects(person)) {
    tags.push('projetos');
  }

  if (hasFinishedSomeCourse(person)) {
    tags.push('egresso');
  }

  const courses = person.data.occupations
    .filter((occupation) => occupation.type === 'student')
    .map((occupation) => occupation.course);

  const semesters = person.data.occupations
    .filter((occupation) => occupation.type === 'student')
    .map((occupation) => String(getStudentSemesterId(occupation.id)));

  const coursesBySemester = semesters.map(
    (semester, index) => `${courses[index]}-${semester}`
  );

  if (isStudent(person)) {
    tags.push('aluno', ...courses, ...semesters, ...coursesBySemester);
  }

  if (isProfessor(person)) {
    tags.push('professor');
  }

  tags.sort();

  return tags;
}

async function getPeopleTagsMap(people: CollectionEntry<'people'>[]) {
  const peopleTags = await Promise.all(
    people.map<Promise<[number, string[]]>>(async (person) => {
      const tags = await getPersonTags(person);

      return [person.data.id, tags];
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
    .map((course) => getStudentSemesterId(course.id));

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

export async function getAllPersonTags() {
  const people = await getCollection('people');

  const peopleTags = await getPeopleTagsMap(people);

  const repeatedTags = people.reduce((acc: string[], person) => {
    const tags = peopleTags.get(person.data.id);

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
      status: hasFinishedSomeCourse(person),
    },
    weightedId: {
      value: isStudent(person)
        ? 1000 / getStudentSemesterId(getFirstSemesterCourseId(person))
        : 1,
      status: true,
    },
    hasTwitter: {
      value: 1,
      status: !!person.data.addresses.twitter,
    },
    //TODO countCourses 0.2
  };

  let rank = Object.values(weights).reduce((acc, weight) => {
    return acc + Number(!!Number(weight.status)) * weight.value;
  }, 0);

  if (isProfessor(person) && hasFinishedSomeCourse(person)) {
    rank -= 1;
  }

  return rank;
}

function sortPeople(
  a: CollectionEntry<'people'>,
  b: CollectionEntry<'people'>
) {
  return (
    personRank(b) - personRank(a) ||
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
    const tags = peopleTags.get(person.data.id);

    return tags.includes(tag);
  });

  filteredPeople.sort(sortPeople);

  return filteredPeople;
}

export async function getPeopleWithProjects() {
  return await getPeopleByTag('projetos');
}
