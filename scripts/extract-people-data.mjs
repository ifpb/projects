import { readFileSync, readdirSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import pkg from 'yaml';
const { parse } = pkg;

const __dirname = dirname(fileURLToPath(import.meta.url));
const peopleDir = join(__dirname, '../src/content/people');
const outputFile = join(__dirname, '../logs/linkedin.csv');

const files = readdirSync(peopleDir).filter(f => f.endsWith('.yml'));

const rows = [['name', 'matricula', 'github', 'linkedin']];

for (const file of files) {
  const content = readFileSync(join(peopleDir, file), 'utf-8');
  const data = parse(content);

  const linkedin = data?.addresses?.linkedin;
  if (!linkedin) continue;

  const name = data?.name?.full ?? data?.name?.compact ?? '';
  const occupation = data?.occupations?.find(o => o.type === 'student') ?? data?.occupations?.[0];
  const matricula = occupation?.id ?? '';
  const github = data?.addresses?.github ?? '';

  rows.push([name, matricula, github, linkedin]);
}

const [header, ...data] = rows;
data.sort((a, b) => (a[0] > b[0] ? 1 : -1));

const csv = [header, ...data].map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n') + '\n';
writeFileSync(outputFile, csv, 'utf-8');

console.log(`${rows.length - 1} records saved to logs/linkedin.csv`);
