// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { 
    getFirestore,
    doc,
    setDoc 
    ,
    collection,
    addDoc

} from "firebase/firestore"
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAL5LroW5yhf7veD-rv8HC4hiMqenjeT1k",
    authDomain: "steadiapp-9c5b2.firebaseapp.com",
    projectId: "steadiapp-9c5b2",
    storageBucket: "steadiapp-9c5b2.firebasestorage.app",
    messagingSenderId: "805645357651",
    appId: "1:805645357651:web:f065f42b27b3367b76eca6",
    measurementId: "G-19547ZNP7X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

/**
 * Create or overwrite a user document with a known id under collection `users`.
 * @param {string} userId - document id for the user
 * @param {Object} userData - plain object with user fields
 */
export async function addUser(userId, userData) {
    try {
        await setDoc(doc(db, 'users', userId), userData);
        return { success: true };
    } catch (error) {
        console.error('addUser error', error);
        return { success: false, error };
    }
}

/**
 * Create a user document with an auto-generated id under `users`.
 * Returns the new document id on success.
 */
export async function addUserAuto(userData) {
    try {
        const ref = await addDoc(collection(db, 'users'), userData);
        return { success: true, id: ref.id };
    } catch (error) {
        console.error('addUserAuto error', error);
        return { success: false, error };
    }
}

export { db };