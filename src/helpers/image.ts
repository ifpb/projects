export async function getInfoImage(url: string) {
  const response = await fetch(url, { method: 'HEAD' });

  const contentType = response.headers.get('Content-Type');

  const contentLength = Number(response.headers.get('Content-Length'));

  return {
    type: contentType,
    length: contentLength,
  };
}

export async function getPersonImage(url: string) {
  const { type, length } = await getInfoImage(url);

  if (url.includes('github') && length > 2000) {
    return url;
  } else if (url.includes('github')) {
    return '/projects/imgs/clarity-avatar-solid.svg';
  } else {
    return url;
  }
}
