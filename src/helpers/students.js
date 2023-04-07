import { getCollection } from 'astro:content';

function getStudentSemester(id) {
  const year = String(id).slice(0, 4);
  const semester = String(id).slice(4, 5);

  return `${year}.${semester}`;
}

export function getStudentTags(student) {
  const {
    data: { id, course, campus, isGraduated },
  } = student;

  const semester = getStudentSemester(id);

  const studentTags = [
    course,
    semester,
    `${course}-${semester}`,
    campus,
    isGraduated ? 'egresso' : 'cursando',
  ];

  studentTags.sort();

  return studentTags;
}

export function getStudentTagGropus(student) {
  const {
    data: { id, course, campus, isGraduated },
  } = student;

  const semester = getStudentSemester(id);

  const studentTags = {
    course: {
      name: 'curso',
      values: [course],
    },
    semester: {
      name: 'semestre',
      values: [`${course}-${semester}`],
    },
    // campus: {
    //   name: 'campus',
    //   values: [campus],
    // },
    // status: {
    //   name: 'situação',
    //   values: [isGraduated ? 'egresso' : 'cursando'],
    // },
  };

  return studentTags;
}

export async function getAllStudentTags() {
  const students = await getCollection('students');

  const repeatedTags = students.reduce((acc, student) => {
    return [...acc, ...getStudentTags(student)];
  }, []);

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

export async function getStudentsByTag(tag) {
  const students = await getCollection('students');

  const allStudents = students.filter((student) =>
    getStudentTags(student).includes(tag)
  );

  allStudents.sort((a, b) => a.data.name.localeCompare(b.data.name));

  return allStudents;
}
