const PROJECT_ID = import.meta.env.VITE_FIREBASE_PROJECT_ID ?? 'gorzeszow-fun-page';
const DATABASE_NAME = import.meta.env.VITE_FIREBASE_DATABASE_NAME ?? 'berlin-guardians';
const API_KEY = import.meta.env.VITE_FIREBASE_API_KEY ?? '';

const BASE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/${DATABASE_NAME}/documents`;

export interface FirestoreRestDocument {
  readonly name: string;
  readonly fields?: Record<string, FirestoreRestValue>;
  readonly createTime?: string;
  readonly updateTime?: string;
}

interface FirestoreFieldValue {
  stringValue?: string;
  integerValue?: string;
  booleanValue?: boolean;
  timestampValue?: string;
  nullValue?: null;
}

export interface RunQueryResponseItem {
  document?: {
    name: string;
    fields?: Record<string, FirestoreFieldValue>;
    createTime?: string;
    updateTime?: string;
  };
  readTime?: string;
}

export function toNumber(field?: FirestoreFieldValue, fallback = 0): number {
  if (field?.integerValue === undefined) {
    return fallback;
  }
  const value = Number(field.integerValue);
  return Number.isFinite(value) ? value : fallback;
}

export function toNullableString(field?: FirestoreFieldValue): string | null {
  if (!field || field.nullValue === null) {
    return null;
  }
  return field.stringValue ?? field.timestampValue ?? null;
}

export type FirestoreRestValue =
  | { readonly stringValue: string }
  | { readonly integerValue: string }
  | { readonly doubleValue: number }
  | { readonly booleanValue: boolean }
  | { readonly nullValue: null }
  | { readonly timestampValue: string }
  | { readonly mapValue: { readonly fields?: Record<string, FirestoreRestValue> } }
  | { readonly arrayValue: { readonly values?: readonly FirestoreRestValue[] } };

export async function restGetCollection(
  collectionName: string,
  pageSize = 20,
): Promise<FirestoreRestDocument[]> {
  const url = `${BASE_URL}/${collectionName}?pageSize=${pageSize}&key=${encodeURIComponent(API_KEY)}`;
  const response = await fetch(url);

  if (!response.ok) {
    const details = await response.text();
    throw new Error(
      `Firestore REST GET /${collectionName} failed (${response.status}): ${details}`,
    );
  }

  const data = (await response.json()) as { documents?: FirestoreRestDocument[] };
  return data.documents ?? [];
}

export async function restGetDocument(
  collectionName: string,
  docId: string,
): Promise<FirestoreRestDocument | null> {
  const url = `${BASE_URL}/${collectionName}/${encodeURIComponent(docId)}?key=${encodeURIComponent(API_KEY)}`;
  const response = await fetch(url);

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    const details = await response.text();
    throw new Error(
      `Firestore REST GET /${collectionName}/${docId} failed (${response.status}): ${details}`,
    );
  }

  return (await response.json()) as FirestoreRestDocument;
}

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

export async function restReadDocument(collectionName: string, idToken?: string): Promise<unknown> {
  const url =
    `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}` +
    `/databases/${DATABASE_NAME}/documents/product/beehive-valley` + //product~2F
    `?key=${encodeURIComponent(API_KEY)}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (idToken) {
    headers.Authorization = `Bearer ${idToken}`;
  }

  const response = await fetch(url, {
    method: 'GET',
    headers,
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(
      `Firestore REST GET /${collectionName} failed (${response.status}): ${details}`,
    );
  }

  return response.json();
}
