import { getCollection } from 'astro:content';
import { getProjectsByStudent } from './projects';

function getStudentSemester(id) {
  const year = String(id).slice(0, 4);
  const semester = String(id).slice(4, 5);

  return `${year}.${semester}`;
}

function getFirstSemesterCourse(student) {
  return Math.trunc(student.data.courses[0].id / 100000);
}

function hasFinishedSomeCourse(student) {
  return student.data.courses.some((course) => course.isFinished);
}

async function hasProjects(student) {
  const projects = await getProjectsByStudent(student);

  return !!projects.length;
}

export async function getStudentTags(student) {
  const courses = student.data.courses.map((course) => course.name);

  const semesters = student.data.courses.map((course) =>
    getStudentSemester(course.id)
  );

  const coursesBySemeter = semesters.map(
    (semester, index) => `${courses[index]}-${semester}`
  );

  const campi = student.data.courses.map((course) => course.campus);

  const studentTags = [
    ...courses,
    ...semesters,
    ...coursesBySemeter,
    ...campi,
    hasFinishedSomeCourse(student) ? 'egresso' : 'incompleto',
    (await hasProjects(student)) ? 'código' : 'noCode',
  ];

  studentTags.sort();

  return studentTags;
}

export function getStudentTagGropus(student) {
  const courses = student.data.courses.map((course) => course.name);

  const semesters = student.data.courses.map((course) =>
    getStudentSemester(course.id)
  );

  const coursesBySemeter = semesters.map(
    (semester, index) => `${courses[index]}-${semester}`
  );

  const studentTags = {
    course: {
      name: 'curso',
      values: courses,
    },
    semester: {
      name: 'semestre',
      values: coursesBySemeter,
    },
  };

  return studentTags;
}

export async function getAllStudentTags() {
  const students = await getCollection('students');

  const repeatedTags = await students.reduce(async (acc, student) => {
    const tags = await getStudentTags(student);

    return [...(await acc), ...tags];
  }, Promise.resolve([]));

  const uniqueTags = [...new Set(repeatedTags)];

  uniqueTags.sort();

  return uniqueTags;
}

export async function getAllStudentTagGroups() {
  const students = await getCollection('students');

  const tags = students.reduce((acc, student) => {
    const tagGroups = getStudentTagGropus(student);

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

// Sort students by graduation status, twitter presence, semester and name
function sortStudents(a, b) {
  return (
    Number(!!hasFinishedSomeCourse(b)) - Number(!!hasFinishedSomeCourse(a)) ||
    Number(!!b.data.addresses.twitter) - Number(!!a.data.addresses.twitter) ||
    getFirstSemesterCourse(a) - getFirstSemesterCourse(b) ||
    a.data.name.compact.localeCompare(b.data.name.compact)
  );
}

export async function getStudents() {
  const students = await getCollection('students');

  students.sort(sortStudents);

  return students;
}

export async function getStudentsByTag(tag) {
  const students = await getCollection('students');

  const filteredStudents = await students.reduce(async (acc, student) => {
    const tags = await getStudentTags(student);

    if (tags.includes(tag)) {
      return [...(await acc), student];
    } else {
      return acc;
    }
  }, []);

  filteredStudents.sort(sortStudents);

  return filteredStudents;
}

export async function getStudentsWithProjects() {
  const students = await getCollection('students');

  const filteredStudents = await students.reduce(async (acc, student) => {
    const tags = await getStudentTags(student);

    if (tags.includes('código')) {
      return [...(await acc), student];
    } else {
      return acc;
    }
  }, []);

  filteredStudents.sort(sortStudents);

  return filteredStudents;
}
