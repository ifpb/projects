const fs = require('fs');
const path = require('path');

async function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');

  const regex = /avatar:\s*default:\s*(https:\/\/github.com\/\w+\.png)/;
  const regexGithub =
    /github:\s*(https:\/\/avatars\.githubusercontent\.com\/u\/\d+\?v=\d+)/;

  const match = content.match(regex);

  if (match && !regexGithub.test(content)) {
    const avatarDefaultUrl = match[1];
    const username = avatarDefaultUrl.match(
      /https:\/\/github\.com\/(\w+)\.png/
    )[1];

    try {
      const response = await fetch(`https://api.github.com/users/${username}`);
      const data = await response.json();
      const avatarGithubUrl = data.avatar_url;
      const replacement = `${match[0]}\n  github: ${avatarGithubUrl}`;
      content = content.replace(match[0], replacement);

      fs.writeFileSync(filePath, content, 'utf-8');
      console.log(`File ${filePath} successfully modified.`);
    } catch (error) {
      console.error(`Error fetching avatar for ${avatarDefaultUrl}:`, error);
    }
  }
}

async function processDirectory(dirPath) {
  const files = fs.readdirSync(dirPath);

  for (const file of files) {
    const filePath = path.join(dirPath, file);

    if (fs.statSync(filePath).isFile()) {
      await processFile(filePath);
    }
  }
}

const targetDirectory = '.';

processDirectory(targetDirectory)
  .then(() => console.log('Processing completed.'))
  .catch((err) => console.error('Processing error:', err));
