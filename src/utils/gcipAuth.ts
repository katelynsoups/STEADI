// src/utils/gcipAuth.ts
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  UserCredential
} from 'firebase/auth';
import Constants from "expo-constants";
import { 
  getFirestore,
  doc,
  setDoc 
} from 'firebase/firestore';

const extra = Constants.expoConfig?.extra ?? Constants.extra;

const firebaseConfig = {
  apiKey: extra?.apiKey,
  authDomain: 'research-digital-steadi-dev.firebaseapp.com',
  projectId: 'research-digital-steadi-dev',
  //storageBucket: "research-digital-steadi-dev.firebasestorage.app",
  //messagingSenderId: "228929058201",
  //appId: "1:228929058201:web:5299155e03c12213efcf08"
};

// Initialize Firebase/GCIP/Database
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Helper functions
export async function signUp(email: string, password: string): Promise<UserCredential> {
  return await createUserWithEmailAndPassword(auth, email, password);
}

export async function createDeIDUser(participantID: string, uid: string): Promise<string> {
  // first make a document in Users-AppData with uid as doc id, participant id, and save status "info"
  await setDoc(doc(db, "Users-AppData", uid), {
    participantID: participantID,
    saveStatus: "info"
  });
  // then make a document in Users-StudyData with participantID as doc id
  await setDoc(doc(db, "Users-StudyData", participantID), {});
  return participantID;
}

export async function signIn(email: string, password: string): Promise<UserCredential> {
  return await signInWithEmailAndPassword(auth, email, password);
}