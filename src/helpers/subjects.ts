
const subjects = [
  { id: 1, name: 'Redes de Computadores I', course: 'RC' },
  { id: 2, name: 'Segurança da Informação', course: 'RC' },
  { id: 3, name: 'Administração de Sistemas', course: 'RC' },
];

export function getSubject(id: number) {
  return subjects.find(subject => subject.id === id);
}

export function getAllSubjects() {
  return subjects;
}
