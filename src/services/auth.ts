import { FirebaseError } from 'firebase/app';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
  type Unsubscribe,
} from 'firebase/auth';
import { getFirebaseAuth } from './firebase';

export async function registerWithEmail(email: string, password: string): Promise<User> {
  const auth = getFirebaseAuth();
  return createUserWithEmailAndPassword(auth, email, password).then((cred) => cred.user);
}

export async function loginWithEmail(email: string, password: string): Promise<User> {
  const auth = getFirebaseAuth();
  return signInWithEmailAndPassword(auth, email, password).then((cred) => cred.user);
}

export async function logoutUser(): Promise<void> {
  const auth = getFirebaseAuth();
  return signOut(auth);
}

export function subscribeToAuthState(callback: (user: User | null) => void): Unsubscribe {
  const auth = getFirebaseAuth();
  return onAuthStateChanged(auth, callback);
}

export function formatAuthError(error: unknown): string {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case 'auth/invalid-credential':
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        return 'Invalid email or password.';
      case 'auth/email-already-in-use':
        return 'This email is already registered.';
      case 'auth/weak-password':
        return 'Password must be at least 6 characters.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/too-many-requests':
        return 'Too many attempts. Please try again later.';
      default:
        return error.message || 'Authentication error.';
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Authentication failed. Please try again.';
}
