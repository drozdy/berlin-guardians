import type { PageView } from '../../types/routes';
import { createElement } from '../../utils/dom';

const PROJECT_ID = import.meta.env.VITE_FIREBASE_PROJECT_ID ?? 'gorzeszow-fun-page';
const DATABASE_NAME = import.meta.env.VITE_FIREBASE_DATABASE_NAME ?? 'berlin-guardians';
const API_KEY = import.meta.env.VITE_FIREBASE_API_KEY ?? '';

export async function restCreateDocument(
  collectionName: string,
  fields: Record<string, unknown>,
  idToken?: string,
): Promise<unknown> {
  const url =
    `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}` +
    `/databases/${DATABASE_NAME}/documents/${collectionName}` +
    `?key=${encodeURIComponent(API_KEY)}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (idToken) {
    headers.Authorization = `Bearer ${idToken}`;
  }

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify({ fields }),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(
      `Firestore REST POST /${collectionName} failed (${response.status}): ${details}`,
    );
  }

  return response.json();
}

export function renderCartPage(): PageView {
  return {
    elements: [
      createElement('section', {
        className: 'section container',
        children: [createElement('h1', { text: 'Cart' })],
      }),
    ],
  };
}
