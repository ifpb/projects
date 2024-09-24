import fs from 'node:fs';
import path from 'node:path';

const randomDelay = (): Promise<void> => {
  const delay = Math.floor(Math.random() * 3000) + 1000;
  return new Promise((resolve) => setTimeout(resolve, delay));
};

async function processFile(filePath: string): Promise<void> {
  let content = fs.readFileSync(filePath, 'utf-8');

  // const regex = /avatar:\n\s*default:\s*(https:\/\/github.com\/.+\.png)/;
  const regex = /avatar:\n  default: (https:\/\/github.com\/.+\.png)/i;
  const regexGithub =
    /github:\s*(https:\/\/avatars\.githubusercontent\.com\/u\/\d+\?v=\d+)/i;

  const match = content.match(regex);

  if (match && !regexGithub.test(content)) {
    const avatarDefaultUrl = match[1];
    const username = avatarDefaultUrl.match(
      /https:\/\/github\.com\/(.+)\.png/i
    )?.[1];

    if (username) {
      await randomDelay(); // Add random delay before the request
      try {
        const response = await fetch(
          `https://api.github.com/users/${username}`
        );

        if (!response.ok) {
          throw new Error();
        }

        const data = await response.json();
        const avatarGithubUrl = data.avatar_url;
        const replacement = `${match[0]}\n  github: ${avatarGithubUrl}`;
        content = content.replace(match[0], replacement);

        fs.writeFileSync(filePath, content, 'utf-8');
        console.log(`File ${filePath} successfully modified.`);
      } catch (error) {
        console.error(`Error fetching avatar for ${avatarDefaultUrl}`);
      }
    }
  }
}

async function processDirectory(dirPath: string): Promise<void> {
  const files = fs.readdirSync(dirPath);

  for (const file of files) {
    const filePath = path.join(dirPath, file);

    if (fs.statSync(filePath).isFile()) {
      await processFile(filePath);
    }
  }
}

const targetDirectory = 'src/content/people';

processDirectory(targetDirectory)
  .then(() => console.log('Processing completed.'))
  .catch((err) => console.error('Processing error:', err));
