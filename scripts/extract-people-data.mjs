import { readFileSync, readdirSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import pkg from 'yaml';
const { parse } = pkg;

const __dirname = dirname(fileURLToPath(import.meta.url));
const peopleDir = join(__dirname, '../src/content/people');

function parseCourseFilter(args) {
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    if (arg === '--course') {
      const value = args[index + 1]?.trim();
      if (!value || value.startsWith('-')) {
        throw new Error(
          'Missing value for --course. Example: npm run extract:linkedin -- --course csbes-jp',
        );
      }

      return value;
    }

    if (arg.startsWith('--course=')) {
      const value = arg.slice('--course='.length).trim();
      if (!value) {
        throw new Error(
          'Missing value for --course. Example: npm run extract:linkedin -- --course=csbes-jp',
        );
      }

      return value;
    }
  }

  return '';
}

const courseFilter = parseCourseFilter(process.argv.slice(2));
const now = new Date();
const timestamp = now.toISOString().replace(/[-:T]/g, '').slice(0, 12);
const courseSuffix = courseFilter
  ? `-${courseFilter.replace(/[^a-zA-Z0-9._-]/g, '-')}`
  : '';
const outputFile = join(
  __dirname,
  `../logs/people-data${courseSuffix}-${timestamp}.csv`,
);

const files = readdirSync(peopleDir).filter(f => f.endsWith('.yml'));
const nameCollator = new Intl.Collator('pt-BR', { sensitivity: 'base' });

const rows = [['name', 'matricula', 'courses', 'github', 'linkedin']];

for (const file of files) {
  const content = readFileSync(join(peopleDir, file), 'utf-8');
  const data = parse(content);

  const linkedin = data?.addresses?.linkedin;
  if (!linkedin) continue;

  const name = data?.name?.full ?? data?.name?.compact ?? '';
  const studentOccupations =
    data?.occupations?.filter(o => o.type === 'student') ?? [];
  const matchingOccupations = courseFilter
    ? studentOccupations.filter(o => o.course?.trim() === courseFilter)
    : studentOccupations;

  if (courseFilter && matchingOccupations.length === 0) continue;

  const occupation =
    matchingOccupations[0] ?? studentOccupations[0] ?? data?.occupations?.[0];
  const matricula = occupation?.id ?? '';
  const courses = studentOccupations
    .map(o => o.course?.trim())
    .filter(Boolean)
    .join(';');
  const github = data?.addresses?.github ?? '';

  rows.push([name, matricula, courses, github, linkedin]);
}

const [header, ...data] = rows;
data.sort((a, b) => nameCollator.compare(a[0], b[0]));

const csv = [header, ...data].map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n') + '\n';
writeFileSync(outputFile, csv, 'utf-8');

const filterMessage = courseFilter ? ` for course ${courseFilter}` : '';
console.log(
  `${rows.length - 1} records${filterMessage} saved to ${outputFile}`,
);
