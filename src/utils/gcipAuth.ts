// src/utils/gcipAuth.ts
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  UserCredential
} from 'firebase/auth';
import Constants from "expo-constants";

const extra = Constants.expoConfig?.extra ?? Constants.extra;

const firebaseConfig = {
  apiKey: extra?.apiKey,
  authDomain: 'research-digital-steadi-dev.firebaseapp.com',
  projectId: 'research-digital-steadi-dev',
};

// Initialize Firebase/GCIP
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Helper functions
export async function signUp(email: string, password: string): Promise<UserCredential> {
  return await createUserWithEmailAndPassword(auth, email, password);
}

export async function signIn(email: string, password: string): Promise<UserCredential> {
  return await signInWithEmailAndPassword(auth, email, password);
}