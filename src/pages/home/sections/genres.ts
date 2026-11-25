import { createSectionHeader } from '../../../components/ui/section-header/section-header';
import { createElement } from '../../../utils/dom';
import { FIREBASE_ENDPOINT_QUERY } from '../../../services/firebase';
import { type CategoryRecord, CATEGORY_DB_NAME } from '../../../types/categories';
import { type RunQueryResponseItem } from '../../../api/firestore-rest';
import { toCategoriesRecordMapper } from '../../../api/categories-adapter';
//import { BASE_PATH } from '../../../utils/url';

// const iconAssetsBasePath = BASE_PATH;

export async function fetchPublishedCategories(): Promise<Partial<CategoryRecord> | null> {
  const url = FIREBASE_ENDPOINT_QUERY;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      structuredQuery: {
        from: [{ collectionId: CATEGORY_DB_NAME }],
        where: {
          fieldFilter: {
            field: { fieldPath: 'published' },
            op: 'EQUAL',
            value: { booleanValue: true },
          },
        },
        limit: 6,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const rows: RunQueryResponseItem[] = await response.json();
  return toCategoriesRecordMapper(rows as unknown as RunQueryResponseItem[]);
}

export function createGenresSection(): HTMLElement {
  const statusText: HTMLParagraphElement = createElement('p', {
    className: 'profile-page__status',
    text: 'Checking genres available...',
  });

  void (async (): Promise<void> => {
    try {
      const categories = await fetchPublishedCategories();
      if (!categories) {
        statusText.textContent = 'Any genre is present in app';
        return;
      }
      console.log(categories);
    } catch (error: unknown) {
      console.error('Failed to load profile from Firestore:', error);
      statusText.textContent = 'Failed to load profile data.';
    }
  })();

  return createElement('section', {
    className: 'section container',
    attributes: { 'aria-labelledby': 'genres-title' },
    children: [
      createSectionHeader({
        id: 'genres-title',
        title: 'Browse by Genre',
      }),
      statusText,
    ],
  });
}
