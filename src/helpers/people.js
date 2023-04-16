import { getCollection } from 'astro:content';
import { getProjectsByPerson } from './projects';

function isStudent(person) {
  return person.data.occupations.some(
    (occupation) => occupation.type === 'student'
  );
}

function isProfessor(person) {
  return person.data.occupations.some(
    (occupation) => occupation.type === 'professor'
  );
}

function getStudentSemesterId(id) {
  const year = String(id).slice(0, 4);
  const semester = String(id).slice(4, 5);

  return `${year}.${semester}`;
}

function getFirstSemesterCourseIds(student) {
  return Math.trunc(student.data.occupations[0].id / 100000);
}

function hasFinishedSomeCourse(student) {
  return student.data.occupations.some((course) => course.isFinished);
}

async function hasProjects(person) {
  const projects = await getProjectsByPerson(person);

  return !!projects.length;
}

export async function getPersonTags(person) {
  const campi = person.data.occupations.map((occupation) => occupation.campus);

  const tags = [
    ...campi,
    (await hasProjects(person)) ? 'código' : 'sem código',
  ];

  const courses = person.data.occupations
    .filter((occupation) => occupation.type === 'student')
    .map((occupation) => occupation.course);

  const semesters = person.data.occupations
    .filter((occupation) => occupation.type === 'student')
    .map((occupation) => getStudentSemesterId(occupation.id));

  const coursesBySemeter = semesters.map(
    (semester, index) => `${courses[index]}-${semester}`
  );

  if (isStudent(person)) {
    tags.push(
      'aluno',
      ...courses,
      ...semesters,
      ...coursesBySemeter,
      hasFinishedSomeCourse(person) ? 'egresso' : 'incompleto'
    );
  }

  if (isProfessor(person)) {
    tags.push('professor');
  }

  tags.sort();

  return tags;
}

export function getPersonTagGropus(person) {
  const courses = person.data.occupations
    .filter((occupation) => occupation.type === 'student')
    .map((occupation) => occupation.course);

  const semesters = person.data.occupations
    .filter((occupation) => occupation.type === 'student')
    .map((course) => getStudentSemesterId(course.id));

  const coursesBySemeter = semesters.map(
    (semester, index) => `${courses[index]}-${semester}`
  );

  const tags = {
    course: {
      name: 'curso',
      values: courses,
    },
    semester: {
      name: 'semestre',
      values: coursesBySemeter,
    },
  };

  return tags;
}

export async function getAllPersonTags() {
  const people = await getCollection('people');

  const repeatedTags = await people.reduce(async (acc, person) => {
    const tags = await getPersonTags(person);

    return [...(await acc), ...tags];
  }, Promise.resolve([]));

  const uniqueTags = [...new Set(repeatedTags)];

  uniqueTags.sort();

  return uniqueTags;
}

export async function getAllPeopleTagGroups() {
  const people = await getCollection('people');

  const tags = people.reduce((acc, person) => {
    const tagGroups = getPersonTagGropus(person);

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
function sortPeople(a, b) {
  return (
    Number(!!hasFinishedSomeCourse(b)) - Number(!!hasFinishedSomeCourse(a)) ||
    Number(!!b.data.addresses.twitter) - Number(!!a.data.addresses.twitter) ||
    getFirstSemesterCourseIds(a) - getFirstSemesterCourseIds(b) ||
    a.data.name.compact.localeCompare(b.data.name.compact)
  );
}

export async function getPeople() {
  const people = await getCollection('people');

  people.sort(sortPeople);

  return people;
}

export async function getPeopleByProject(project) {
  const people = await getCollection('people');

  const filteredPeople = await people.reduce(async (acc, person) => {
    if (project.data.owners.includes(person.data.id)) {
      return [...(await acc), person];
    } else {
      return acc;
    }
  }, []);

  filteredPeople.sort(sortPeople);

  return filteredPeople;
}

export async function getPeopleByTag(tag) {
  const people = await getCollection('people');

  const filteredPeople = await people.reduce(async (acc, person) => {
    const tags = await getPersonTags(person);

    if (tags.includes(tag)) {
      return [...(await acc), person];
    } else {
      return acc;
    }
  }, []);

  filteredPeople.sort(sortPeople);

  return filteredPeople;
}

export async function getPeopleWithProjects() {
  const people = await getCollection('people');

  const filteredPeople = await people.reduce(async (acc, person) => {
    const tags = await getPersonTags(person);

    if (tags.includes('código')) {
      return [...(await acc), person];
    } else {
      return acc;
    }
  }, []);

  filteredPeople.sort(sortPeople);

  return filteredPeople;
}
