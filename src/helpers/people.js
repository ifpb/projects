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

export function getStudentSemesterId(id) {
  const year = String(id).slice(0, 4);
  const semester = String(id).slice(4, 5);

  return Number(`${year}.${semester}`);
}

function getFirstSemesterCourseId(student) {
  if (isStudent(student)) {
    const firstId = student.data.occupations
      .filter((occupation) => occupation.type === 'student')
      .map((course) => course.id)
      .sort()[0];

    return firstId;
  }
}

function hasPersonId(person, id) {
  return person.data.occupations.some((occupation) => occupation.id === id);
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

  const tags = [...campi, (await hasProjects(person)) && 'projetos'];

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
function personRank(person) {
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
    return acc + !!Number(weight.status) * weight.value;
  }, 0);

  if (isProfessor(person) && hasFinishedSomeCourse(person)) {
    rank -= 1;
  }

  return rank;
}

function sortPeople(a, b) {
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

export async function getPeopleByProject(project) {
  const people = await getCollection('people');

  const filteredPeople = await people.reduce(async (acc, person) => {
    if (project.data.owners.some((ownerId) => hasPersonId(person, ownerId))) {
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
