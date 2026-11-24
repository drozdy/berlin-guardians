// src/pages/profile/profile-page.ts
import { onAuthStateChanged, type User } from 'firebase/auth';
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
  getDocsFromServer,
  type Firestore,
  FirestoreError,
  type DocumentData,
} from 'firebase/firestore';
import { QuerySnapshot } from 'firebase/firestore';
import { getFirebaseAuth, getFirebaseDb } from '../../services/firebase';
import { AuthMode } from '../../types/auth';
import { DialogParameter, Route, type PageView } from '../../types/routes';
import { createButton } from '../../components/ui/button/button';
import { createElement } from '../../utils/dom';
import { getRouteHref } from '../../utils/url';
import type { UserProfile } from '../../types/users';
export async function sanityCheckAllUsers(db: Firestore) {
  console.log("🔍 Fetching ALL documents from 'users'...");
  const snapshot = await getDocs(collection(db, 'users'));

  if (snapshot.empty) {
    console.warn("⚠️ The 'users' collection is completely empty!");
    return;
  }

  console.log(`✅ Found ${snapshot.size} documents:`);
  snapshot.forEach((doc) => {
    console.log(`📄 Doc ID: ${doc.id} -> Data:`, JSON.stringify(doc.data(), null, 2));
  });
}

const USER_DB_NAME = 'users';

export async function debugUserQuery(testUid: string): Promise<void> {
  console.log('=== FIRESTORE DEBUG START ===');

  // 1. Validate the input parameter strictly as a string
  if (!testUid.trim()) {
    console.error('❌ Error: The testUid is undefined or empty!');
    return;
  }
  console.log(`🔍 1. Searching 'users' collection for field 'uid' matching: "${testUid}"`);

  try {
    const db = getFirebaseDb();
    // 2. Build the query pointing to your custom database
    const usersCollection = collection(db, USER_DB_NAME);
    const usersQuery = query(usersCollection, where('uid', '==', testUid));

    console.log('📡 2. Sending request to database: berlin-guardians');
    const snapshot: QuerySnapshot<unknown, DocumentData> = await getDocs(usersQuery);

    // 3. Inspect results safely
    console.log(`📊 3. Query finished! Snapshot size (documents found): ${snapshot.size}`);

    if (snapshot.empty) {
      console.warn('⚠️ Warning: No documents matched this query. Double-check that:');
      console.warn("   a) The collection is named exactly 'users' (case-sensitive).");
      console.warn(
        `   b) There is a document with a field key named 'uid' containing the value: "${testUid}"`,
      );
    } else {
      console.log('✅ Success! Documents found:');
      snapshot.forEach((doc) => {
        console.log(`   📄 Document ID: ${doc.id}`);
        console.log('      Data:', JSON.stringify(doc.data(), null, 2));
      });
    }
  } catch (error) {
    // 4. Strictly catch and type-check errors using the SDK's FirestoreError class
    console.error('❌ Query Failed with Error!');

    if (error instanceof FirestoreError) {
      console.error('Firestore Code:', error.code);
      console.error('Firestore Message:', error.message);

      if (error.code === 'permission-denied') {
        console.error('👉 Solution: Your Firestore Security Rules are blocking this read request.');
      } else if (error.code === 'failed-precondition') {
        console.error(
          '👉 Solution: You might be missing a composite index. Check the console link in the error details.',
        );
      }
    } else if (error instanceof Error) {
      console.error('General Error Message:', error.message);
    } else {
      console.error('An unexpected non-Error object was thrown.');
    }
  }

  console.log('=== FIRESTORE DEBUG END ===');
}

export interface ProfilePageOptions {
  readonly onOpenAuth?: (mode: AuthMode) => void;
}

async function fetchUserStrictFromServer(uid: string, db: Firestore) {
  const usersQuery = query(collection(db, USER_DB_NAME), where('uid', '==', uid));

  try {
    // 2. Force the request to hit the server directly
    const snapshot = await getDocsFromServer(usersQuery);

    console.log(`📊 Query finished! Snapshot size from server: ${snapshot.size}`);

    if (snapshot.empty) {
      console.log('No documents matched on the server.');
    } else {
      snapshot.forEach((doc) => {
        console.log(`✅ Success! Found Document ID: ${doc.id}`, doc);
      });
    }
  } catch (error) {
    console.error('Server query failed:', error);
  }
}

async function fetchUserProfileByDocId(
  db: Firestore,
  docId = 'htochko',
): Promise<Partial<UserProfile> | undefined> {
  const startedAt = performance.now();
  const ref = doc(db, USER_DB_NAME, docId);
  const snap = await getDoc(ref);
  const elapsedMs = Math.round(performance.now() - startedAt);

  console.log(`[profile] getDoc users/${docId} in ${elapsedMs}ms, exists:`, snap.exists());

  if (!snap.exists()) {
    return undefined;
  }

  const raw = snap.data() as Partial<UserProfile>;
  console.log('[profile] doc fields:', raw);

  return {
    uid: raw.uid ?? '',
    username: raw.username ?? snap.id,
    balance_cents: typeof raw.balance_cents === 'number' ? raw.balance_cents : 0,
    currency: raw.currency ?? 'EUR',
    bio: raw.bio ?? '',
    logo_img: raw.logo_img ?? '',
    linkedin_link: raw.linkedin_link ?? '',
    github_link: raw.github_link ?? '',
    discord_link: raw.discord_link ?? '',
  };
}

export async function fetchProducts(db: Firestore = getFirebaseDb()): Promise<unknown[]> {
  const startedAt = performance.now();
  console.log('[products] fetching collection...');

  const snapshot = await getDocs(collection(db, 'products'));
  const elapsedMs = Math.round(performance.now() - startedAt);

  console.log(`[products] done in ${elapsedMs}ms, count: ${snapshot.size}`);

  return snapshot.docs.map((docSnap) => {
    const data = docSnap.data();
    console.log(docSnap.id, data);
  });
}

function formatBalance(balanceCents: number | undefined, currency = 'EUR'): string {
  if (!balanceCents) {
    return `0 ${currency}`;
  }
  const amount = (balanceCents / 100).toFixed(2);
  return `${amount} ${currency}`;
}

export function renderProfilePage(options: ProfilePageOptions = {}): PageView {
  let isDestroyed = false;
  let authSeq = 0;

  const heading: HTMLHeadingElement = createElement('h1', {
    className: 'profile-page__title',
    text: 'Profile',
  });

  const statusText: HTMLParagraphElement = createElement('p', {
    className: 'profile-page__status',
    text: 'Checking session...',
  });

  const loginButton = createButton({
    text: 'Log in',
    onClick: (): void => {
      if (options.onOpenAuth) {
        options.onOpenAuth(AuthMode.Login);
        return;
      }

      const url: URL = new URL(window.location.href);
      url.searchParams.set(DialogParameter.Auth, AuthMode.Login);
      window.history.pushState({}, '', url);
      window.dispatchEvent(new PopStateEvent('popstate'));
    },
  });

  const homeLink = createButton({
    text: 'Back to Home',
    variant: 'outline',
    href: getRouteHref(Route.Home),
  });

  const guestActions: HTMLElement = createElement('div', {
    className: 'profile-page__actions',
    children: [loginButton, homeLink],
  });

  const profileDetails: HTMLElement = createElement('div', {
    className: 'profile-page__details',
  });

  guestActions.hidden = true;
  profileDetails.hidden = true;

  const auth = getFirebaseAuth();
  const db = getFirebaseDb();

  const unsubscribe = onAuthStateChanged(auth, (user: User | null): void => {
    const currentSeq = ++authSeq;

    if (isDestroyed) {
      return;
    }

    if (!user) {
      profileDetails.hidden = true;
      profileDetails.replaceChildren();
      statusText.textContent = 'You are not signed in. Log in to view your profile.';
      guestActions.hidden = false;
      return;
    }

    guestActions.hidden = true;
    profileDetails.hidden = true;
    statusText.textContent = `Signed in as ${user.email ?? user.uid}. Loading profile...`;

    fetchProducts(db);

    void (async (): Promise<void> => {
      try {
        console.log('USER_ID', user.uid);
        await debugUserQuery(user.uid); // fetchUserProfileByUid(db, user.uid);
        await sanityCheckAllUsers(db);
        const profile = await fetchUserProfileByDocId(db);
        await fetchUserStrictFromServer(user.uid, db);
        if (!profile) {
          statusText.textContent = 'P document was not found in Firestore.';
          return;
        }

        statusText.textContent = `Signed in as @${profile.username}`;
        profileDetails.replaceChildren(
          createElement('p', {
            className: 'profile-page__username',
            text: `Username: ${profile.username}`,
          }),
          createElement('p', {
            className: 'profile-page__balance',
            text: `Balance: ${formatBalance(profile.balance_cents, profile.currency)}`,
          }),
          createElement('p', {
            className: 'profile-page__bio',
            text: profile.bio ? `Bio: ${profile.bio}` : 'Bio: —',
          }),
        );
        profileDetails.hidden = false;
      } catch (error: unknown) {
        if (isDestroyed || currentSeq !== authSeq) {
          return;
        }
        console.error('Failed to load profile from Firestore:', error);
        statusText.textContent = 'Failed to load profile data.';
      }
    })();
  });

  return {
    elements: [heading, statusText, guestActions, profileDetails],
    destroy: (): void => {
      isDestroyed = true;
      unsubscribe();
    },
  };
}
